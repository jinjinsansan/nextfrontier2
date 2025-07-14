// 想定オッズ計算ユーティリティ

export interface HorseOdds {
  horseId: number;
  horseNumber: number;
  horseName: string;
  odds: number;
  abilityIndex?: number;
}

export interface RaceOdds {
  raceId: number;
  raceName: string;
  horses: HorseOdds[];
  createdAt?: string;
  updatedAt?: string;
}

// 能力指数計算関数
export const calculateAbilityIndex = (odds: number): number => {
  if (odds <= 0) return 0;
  
  // 能力指数計算式（オッズの逆数ベース）
  // オッズが低いほど能力指数が高くなる
  const baseIndex = (1 / odds) * 100;
  
  // 上限を50点に制限
  return Math.min(50, Math.round(baseIndex * 100) / 100);
};

// 全馬の能力指数を計算
export const calculateAllAbilityIndices = (horses: HorseOdds[]): HorseOdds[] => {
  return horses.map(horse => ({
    ...horse,
    abilityIndex: calculateAbilityIndex(horse.odds)
  }));
};

// オッズの妥当性チェック
export const validateOdds = (odds: number): boolean => {
  return odds > 0 && odds <= 1000; // 1.0〜1000.0の範囲
};

// 平均オッズ計算
export const calculateAverageOdds = (horses: HorseOdds[]): number => {
  const validOdds = horses.filter(h => h.odds > 0).map(h => h.odds);
  if (validOdds.length === 0) return 0;
  
  const sum = validOdds.reduce((acc, odds) => acc + odds, 0);
  return Math.round((sum / validOdds.length) * 100) / 100;
};

// オッズの分散計算
export const calculateOddsVariance = (horses: HorseOdds[]): number => {
  const validOdds = horses.filter(h => h.odds > 0).map(h => h.odds);
  if (validOdds.length === 0) return 0;
  
  const average = calculateAverageOdds(horses);
  const squaredDifferences = validOdds.map(odds => Math.pow(odds - average, 2));
  const variance = squaredDifferences.reduce((acc, diff) => acc + diff, 0) / validOdds.length;
  
  return Math.round(variance * 100) / 100;
}; 