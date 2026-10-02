import {
  WASTE_CATEGORIES,
  REGION_SCHEDULES,
  BULKY_WASTE_ITEMS,
  SAMPLE_WASTE_PHOTOS,
} from '../src/data/koreanWasteData';

export default function handler(_req: any, res: any) {
  res.status(200).json({
    categories: WASTE_CATEGORIES,
    schedules: REGION_SCHEDULES,
    bulkyItems: BULKY_WASTE_ITEMS,
    history: [
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
    ],
  });
}
