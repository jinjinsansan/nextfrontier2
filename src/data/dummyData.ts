import { Horse, Race, HorseCategory } from '../types';

export const dummyHorses: Horse[] = [
  { id: 1, name: 'トウカイテイオー', odds: 3.2, placeRate: 0.75 },
  { id: 2, name: 'ディープインパクト', odds: 2.8, placeRate: 0.82 },
  { id: 3, name: 'オグリキャップ', odds: 4.1, placeRate: 0.68 },
  { id: 4, name: 'シンボリルドルフ', odds: 5.5, placeRate: 0.61 },
  { id: 5, name: 'メジロマックイーン', odds: 6.2, placeRate: 0.55 },
  { id: 6, name: 'ナリタタイシン', odds: 7.8, placeRate: 0.48 },
  { id: 7, name: 'エアグルーヴ', odds: 8.5, placeRate: 0.42 },
  { id: 8, name: 'サイレンススズカ', odds: 9.2, placeRate: 0.38 },
];

export const dummyRaces: Race[] = [
  { id: 1, name: '第1回 東京競馬場 1R', date: '2024-01-15' },
  { id: 2, name: '第1回 東京競馬場 2R', date: '2024-01-15' },
  { id: 3, name: '第1回 東京競馬場 3R', date: '2024-01-15' },
  { id: 4, name: '第1回 東京競馬場 4R', date: '2024-01-15' },
  { id: 5, name: '第1回 東京競馬場 5R', date: '2024-01-15' },
];

export const horseCategories: HorseCategory[] = [
  { id: 1, name: '先行力', priority: 0, placeRate: 0.72, efficiency: 0.85 },
  { id: 2, name: '瞬発力', priority: 0, placeRate: 0.68, efficiency: 0.78 },
  { id: 3, name: '持久力', priority: 0, placeRate: 0.75, efficiency: 0.82 },
  { id: 4, name: '調整力', priority: 0, placeRate: 0.70, efficiency: 0.80 },
  { id: 5, name: '精神力', priority: 0, placeRate: 0.65, efficiency: 0.75 },
  { id: 6, name: '適応力', priority: 0, placeRate: 0.73, efficiency: 0.83 },
  { id: 7, name: '回復力', priority: 0, placeRate: 0.67, efficiency: 0.77 },
  { id: 8, name: '成長力', priority: 0, placeRate: 0.69, efficiency: 0.79 },
]; 