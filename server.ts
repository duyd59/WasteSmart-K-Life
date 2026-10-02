import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  WASTE_CATEGORIES,
  REGION_SCHEDULES,
  BULKY_WASTE_ITEMS,
  SAMPLE_WASTE_PHOTOS,
  KOREAN_WASTE_SYSTEM_INSTRUCTION,
  ScanResultData,
} from './src/data/koreanWasteData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory store initialized with realistic scan history
const scanHistoryStore: ScanResultData[] = [
  {
    id: 'scan-init-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    guDistrict: 'Gwanak-gu (관악구)',
    ...SAMPLE_WASTE_PHOTOS[0].presetResult,
  },
  {
    id: 'scan-init-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    guDistrict: 'Gwanak-gu (관악구)',
    ...SAMPLE_WASTE_PHOTOS[3].presetResult,
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // 1. GET Categories & Schedules & Bulky Waste Data
  app.get('/api/waste-data', (_req, res) => {
    res.json({
      categories: WASTE_CATEGORIES,
      schedules: REGION_SCHEDULES,
      bulkyItems: BULKY_WASTE_ITEMS,
      history: scanHistoryStore,
    });
  });

  // 2. GET Scan History
  app.get('/api/history', (_req, res) => {
    res.json(scanHistoryStore);
  });

  // 3. DELETE Scan History
  app.delete('/api/history', (_req, res) => {
    scanHistoryStore.length = 0;
    res.json({ success: true, history: scanHistoryStore });
  });

  // 4. POST /api/scan-waste — Gemini Vision API Endpoint for Korean Bunrisugeo
  app.post('/api/scan-waste', async (req, res) => {
    try {
      const { imageBase64, mimeType, guDistrict = 'Gwanak-gu (관악구)', sampleId } = req.body;

      // If sampleId is provided and no custom base64 is sent, try reading the sample image to send to Gemini,
      // with instant fallback to the verified Korean regulation preset.
      const matchedSample = SAMPLE_WASTE_PHOTOS.find((s) => s.id === sampleId);

      let base64Data = imageBase64;
      let resolvedMimeType = mimeType || 'image/jpeg';

      if (!base64Data && matchedSample) {
        const localFilePath = path.join(__dirname, 'public', matchedSample.imageUrl);
        if (fs.existsSync(localFilePath)) {
          base64Data = fs.readFileSync(localFilePath).toString('base64');
          resolvedMimeType = 'image/jpeg';
        }
      }

      if (!base64Data) {
        return res.status(400).json({ error: 'Missing imageBase64 or valid sampleId' });
      }

      // Remove data URL prefix if present
      const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: resolvedMimeType,
                  data: cleanBase64,
                },
              },
              {
                text: `Analyze this waste item for a resident living in ${guDistrict}, South Korea. Identify exact material, check if contaminated with grease/sauce/labels, determine whether it is General Waste (종량제봉투), Food Waste (음식물), Clear PET (투명 페트병), Recyclable, or Bulky Waste (대형폐기물), and provide step-by-step disposal instructions in Vietnamese (vi), Korean (ko), and English (en).`,
              },
            ],
          },
          config: {
            systemInstruction: KOREAN_WASTE_SYSTEM_INSTRUCTION,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                itemName: {
                  type: Type.OBJECT,
                  properties: {
                    vi: { type: Type.STRING },
                    ko: { type: Type.STRING },
                    en: { type: Type.STRING },
                  },
                  required: ['vi', 'ko', 'en'],
                },
                categoryCode: {
                  type: Type.STRING,
                  description:
                    'One of: CLEAR_PET, PLASTIC, VINYL, PAPER, CAN_GLASS, STYROFOAM, FOOD_WASTE, GENERAL_JONGNYANGJE, BULKY_WASTE, E_WASTE',
                },
                categoryLabel: {
                  type: Type.OBJECT,
                  properties: {
                    vi: { type: Type.STRING },
                    ko: { type: Type.STRING },
                    en: { type: Type.STRING },
                  },
                  required: ['vi', 'ko', 'en'],
                },
                isContaminated: {
                  type: Type.BOOLEAN,
                  description: 'True if item has food grease, red chili oil, or unpeeled vinyl labels/sealing film',
                },
                contaminationReason: {
                  type: Type.OBJECT,
                  properties: {
                    vi: { type: Type.STRING },
                    ko: { type: Type.STRING },
                    en: { type: Type.STRING },
                  },
                  required: ['vi', 'ko', 'en'],
                },
                recommendedBag: {
                  type: Type.OBJECT,
                  properties: {
                    vi: { type: Type.STRING },
                    ko: { type: Type.STRING },
                    en: { type: Type.STRING },
                  },
                  required: ['vi', 'ko', 'en'],
                },
                bagColorTag: {
                  type: Type.STRING,
                  description: 'Hex color representing category, e.g. #0284C7, #2563EB, #D97706, #475569, #DC2626',
                },
                disposalSteps: {
                  type: Type.OBJECT,
                  properties: {
                    vi: { type: Type.ARRAY, items: { type: Type.STRING } },
                    ko: { type: Type.ARRAY, items: { type: Type.STRING } },
                    en: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['vi', 'ko', 'en'],
                },
                fineWarning: {
                  type: Type.OBJECT,
                  properties: {
                    vi: { type: Type.STRING },
                    ko: { type: Type.STRING },
                    en: { type: Type.STRING },
                  },
                  required: ['vi', 'ko', 'en'],
                },
                fineAmountKrw: {
                  type: Type.INTEGER,
                  description: 'Typical fine in KRW (e.g. 100000, 200000, 300000)',
                },
                confidenceScore: {
                  type: Type.INTEGER,
                  description: 'Confidence score from 85 to 100',
                },
                koreanSortingPrinciple: {
                  type: Type.STRING,
                  description: 'Summary of Korean 4 core principles applied',
                },
              },
              required: [
                'itemName',
                'categoryCode',
                'categoryLabel',
                'isContaminated',
                'contaminationReason',
                'recommendedBag',
                'bagColorTag',
                'disposalSteps',
                'fineWarning',
                'fineAmountKrw',
                'confidenceScore',
                'koreanSortingPrinciple',
              ],
            },
          },
        });

        const rawJson = response.text?.trim();
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          const scanRecord: ScanResultData = {
            id: `scan-${Date.now()}`,
            createdAt: new Date().toISOString(),
            guDistrict,
            ...parsed,
            imagePreview: matchedSample ? matchedSample.imageUrl : `data:${resolvedMimeType};base64,${cleanBase64.slice(0, 100000)}`,
          };
          scanHistoryStore.unshift(scanRecord);
          return res.json({ source: 'gemini-vision-api', result: scanRecord });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call fallback check:', geminiError?.message || geminiError);
        if (matchedSample) {
          const fallbackRecord: ScanResultData = {
            id: `scan-${Date.now()}`,
            createdAt: new Date().toISOString(),
            guDistrict,
            ...matchedSample.presetResult,
          };
          scanHistoryStore.unshift(fallbackRecord);
          return res.json({ source: 'verified-regulation-engine', result: fallbackRecord });
        }
        return res.status(500).json({
          error: geminiError?.message || 'Failed to analyze waste image with Gemini Vision API.',
        });
      }
    } catch (err: any) {
      console.error('Error in /api/scan-waste:', err);
      res.status(500).json({ error: err?.message || 'Internal server error' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WasteSmart K-Life server running on http://localhost:${PORT}`);
  });
}

startServer();
