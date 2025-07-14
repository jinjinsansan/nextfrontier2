import { Horse, HorseCategory, CalculationResult } from '../types';

// 根幹指数の計算
export const calculateBaseIndex = (inputValue: number): number => {
  return inputValue * 0.5;
};

// 能力指数の計算（GPT計算式によるスコア、最大50点）
export const calculateAbilityIndex = (horse: Horse): number => {
  // オッズと複勝率を基にした簡易的な能力指数計算
  const oddsScore = Math.max(0, 50 - (horse.odds - 1) * 5);
  const placeRateScore = horse.placeRate * 30;
  return Math.min(50, (oddsScore + placeRateScore) / 2);
};

// 傾向指数の計算（複勝率 × 優先度係数 × 複勝効率、最大50点）
export const calculateTendencyIndex = (
  horse: Horse,
  selectedCategories: HorseCategory[]
): number => {
  if (selectedCategories.length === 0) return 0;

  let totalScore = 0;
  let totalWeight = 0;

  selectedCategories.forEach((category, index) => {
    const priority = 4 - index; // 1位=4, 2位=3, 3位=2, 4位=1
    const weight = priority / 10; // 優先度係数
    
    const categoryScore = category.placeRate * weight * category.efficiency;
    totalScore += categoryScore;
    totalWeight += weight;
  });

  // 50点満点に正規化
  const averageScore = totalWeight > 0 ? totalScore / totalWeight : 0;
  return Math.min(50, averageScore * 50);
};

// 競走馬能力総合指数の計算
export const calculateTotalIndex = (
  baseIndex: number,
  abilityIndex: number,
  tendencyIndex: number
): number => {
  const x = baseIndex; // 根幹指数をxとして使用
  const total = (x / 200) * abilityIndex + ((200 - x) / 200) * tendencyIndex;
  return Math.round(total * 100) / 100; // 小数点2桁で丸める
};

// 全馬の計算結果を生成
export const calculateAllResults = (
  horses: Horse[],
  baseIndex: number,
  selectedCategories: HorseCategory[]
): CalculationResult[] => {
  return horses.map(horse => {
    const abilityIndex = calculateAbilityIndex(horse);
    const tendencyIndex = calculateTendencyIndex(horse, selectedCategories);
    const totalIndex = calculateTotalIndex(baseIndex, abilityIndex, tendencyIndex);

    return {
      horseId: horse.id,
      horseName: horse.name,
      baseIndex: Math.round(baseIndex * 100) / 100,
      abilityIndex: Math.round(abilityIndex * 100) / 100,
      tendencyIndex: Math.round(tendencyIndex * 100) / 100,
      totalIndex
    };
  });
}; 