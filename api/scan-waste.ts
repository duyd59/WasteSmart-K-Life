import { GoogleGenAI, Type } from '@google/genai';
import {
  SAMPLE_WASTE_PHOTOS,
  KOREAN_WASTE_SYSTEM_INSTRUCTION,
  ScanResultData,
} from '../src/data/koreanWasteData';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      guDistrict = 'Gwanak-gu (관악구)',
      sampleId,
    } = req.body || {};

    const matchedSample = SAMPLE_WASTE_PHOTOS.find((s) => s.id === sampleId);

    if (!imageBase64 && matchedSample) {
      const fallbackRecord: ScanResultData = {
        id: `scan-${Date.now()}`,
        createdAt: new Date().toISOString(),
        guDistrict,
        ...matchedSample.presetResult,
      };
      return res.status(200).json({
        source: 'verified-regulation-engine',
        result: fallbackRecord,
      });
    }

    if (!imageBase64) {
      return res
        .status(400)
        .json({ error: 'Missing imageBase64 or valid sampleId' });
    }

    const cleanBase64 = imageBase64.replace(
      /^data:image\/[a-zA-Z0-9+.-]+;base64,/,
      ''
    );

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
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
              categoryCode: { type: Type.STRING },
              categoryLabel: {
                type: Type.OBJECT,
                properties: {
                  vi: { type: Type.STRING },
                  ko: { type: Type.STRING },
                  en: { type: Type.STRING },
                },
                required: ['vi', 'ko', 'en'],
              },
              isContaminated: { type: Type.BOOLEAN },
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
              bagColorTag: { type: Type.STRING },
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
              fineAmountKrw: { type: Type.INTEGER },
              confidenceScore: { type: Type.INTEGER },
              koreanSortingPrinciple: { type: Type.STRING },
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
          imagePreview: matchedSample
            ? matchedSample.imageUrl
            : `data:${mimeType};base64,${cleanBase64.slice(0, 100000)}`,
        };
        return res
          .status(200)
          .json({ source: 'gemini-vision-api', result: scanRecord });
      }
    } catch (geminiError: any) {
      if (matchedSample) {
        const fallbackRecord: ScanResultData = {
          id: `scan-${Date.now()}`,
          createdAt: new Date().toISOString(),
          guDistrict,
          ...matchedSample.presetResult,
        };
        return res.status(200).json({
          source: 'verified-regulation-engine',
          result: fallbackRecord,
        });
      }
      return res.status(500).json({
        error:
          geminiError?.message ||
          'Failed to analyze waste image with Gemini Vision API.',
      });
    }
  } catch (err: any) {
    return res
      .status(500)
      .json({ error: err?.message || 'Internal server error' });
  }
}
