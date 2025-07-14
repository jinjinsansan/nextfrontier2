export interface Horse {
  id: number;
  name: string;
  odds: number;
  placeRate: number; // 複勝率
}

export interface Race {
  id: number;
  name: string;
  date: string;
}

// レース一覧用の拡張型
export interface RaceListItem {
  id: string;
  name: string;
  date: string;
  venue: string; // 競馬場
  raceNumber: number; // R数
  course: string; // 距離・条件
  horses: number; // 頭数
  distance: string; // 距離
  condition: string; // 条件
}

export interface HorseCategory {
  id: number;
  name: string;
  priority: number;
  placeRate: number; // 複勝率
  efficiency: number; // 複勝効率
}

export interface CalculationResult {
  horseId: number;
  horseName: string;
  baseIndex: number; // 根幹指数
  abilityIndex: number; // 能力指数
  tendencyIndex: number; // 傾向指数
  totalIndex: number; // 競走馬能力総合指数
} 