import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RaceParam, SubCategory } from '../RobotWizard';

interface Step3RaceParamsProps {
  raceParams: RaceParam[];
  onUpdate: (value: RaceParam[]) => void;
}

const raceCategories = [
  {
    category: '騎手',
    subCategories: [
      { id: 1, name: '勝率', description: '騎手の勝率' },
      { id: 2, name: '複勝率', description: '騎手の複勝率' },
      { id: 3, name: '平均順位', description: '騎手の平均順位' },
      { id: 4, name: '重賞実績', description: '重賞での実績' },
      { id: 5, name: '距離適性', description: '距離別の成績' },
      { id: 6, name: '馬場適性', description: '馬場別の成績' }
    ]
  },
  {
    category: '調教師',
    subCategories: [
      { id: 7, name: '勝率', description: '調教師の勝率' },
      { id: 8, name: '複勝率', description: '調教師の複勝率' },
      { id: 9, name: '出走数', description: '年間出走数' },
      { id: 10, name: '重賞実績', description: '重賞での実績' },
      { id: 11, name: '距離適性', description: '距離別の成績' },
      { id: 12, name: '馬場適性', description: '馬場別の成績' }
    ]
  },
  {
    category: '馬場',
    subCategories: [
      { id: 13, name: '芝適性', description: '芝コースでの成績' },
      { id: 14, name: 'ダート適性', description: 'ダートコースでの成績' },
      { id: 15, name: '良馬場', description: '良馬場での成績' },
      { id: 16, name: '重馬場', description: '重馬場での成績' },
      { id: 17, name: '稍重馬場', description: '稍重馬場での成績' },
      { id: 18, name: '不良馬場', description: '不良馬場での成績' }
    ]
  },
  {
    category: '距離',
    subCategories: [
      { id: 19, name: '短距離', description: '1000m〜1400m' },
      { id: 20, name: 'マイル', description: '1600m' },
      { id: 21, name: '中距離', description: '1800m〜2000m' },
      { id: 22, name: '長距離', description: '2200m〜3200m' },
      { id: 23, name: '上り坂', description: '上り坂での成績' },
      { id: 24, name: '下り坂', description: '下り坂での成績' }
    ]
  },
  {
    category: '天候',
    subCategories: [
      { id: 25, name: '晴天', description: '晴天時の成績' },
      { id: 26, name: '雨天', description: '雨天時の成績' },
      { id: 27, name: '曇天', description: '曇天時の成績' },
      { id: 28, name: '風速', description: '風速の影響' },
      { id: 29, name: '気温', description: '気温の影響' },
      { id: 30, name: '湿度', description: '湿度の影響' }
    ]
  }
];

const Step3RaceParams: React.FC<Step3RaceParamsProps> = ({ raceParams, onUpdate }) => {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(raceParams.map(p => p.category))
  );

  const handleCategorySelect = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else if (newSelected.size < 3) {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);

    // 新しいパラメータを生成
    const newParams: RaceParam[] = Array.from(newSelected).map(cat => {
      const existingParam = raceParams.find(p => p.category === cat);
      if (existingParam) {
        return existingParam;
      }
      
      const categoryData = raceCategories.find(c => c.category === cat);
      return {
        category: cat,
        subCategories: categoryData?.subCategories.slice(0, 4).map((sub, index) => ({
          id: sub.id,
          name: sub.name,
          priority: index + 1
        })) || []
      };
    });

    onUpdate(newParams);
  };

  const handleSubCategorySelect = (category: string, subCategoryId: number) => {
    const newParams = [...raceParams];
    const categoryParam = newParams.find(p => p.category === category);
    
    if (categoryParam) {
      const existingIndex = categoryParam.subCategories.findIndex(sub => sub.id === subCategoryId);
      
      if (existingIndex !== -1) {
        // 既に選択済みの場合は削除
        categoryParam.subCategories.splice(existingIndex, 1);
      } else if (categoryParam.subCategories.length < 4) {
        // 新しいサブカテゴリを追加
        const categoryData = raceCategories.find(c => c.category === category);
        const subCategoryData = categoryData?.subCategories.find(sub => sub.id === subCategoryId);
        
        if (subCategoryData) {
          categoryParam.subCategories.push({
            id: subCategoryData.id,
            name: subCategoryData.name,
            priority: categoryParam.subCategories.length + 1
          });
        }
      }
      
      onUpdate(newParams);
    }
  };

  const handlePriorityChange = (category: string, subCategoryId: number, newPriority: number) => {
    const newParams = [...raceParams];
    const categoryParam = newParams.find(p => p.category === category);
    
    if (categoryParam) {
      const targetIndex = categoryParam.subCategories.findIndex(sub => sub.id === subCategoryId);
      
      if (targetIndex !== -1) {
        // 優先順位を更新
        categoryParam.subCategories[targetIndex].priority = newPriority;
        
        // 他の項目の優先順位を調整
        categoryParam.subCategories.forEach((sub, index) => {
          if (sub.id !== subCategoryId) {
            if (sub.priority >= newPriority) {
              sub.priority++;
            }
          }
        });
        
        // 優先順位でソート
        categoryParam.subCategories.sort((a, b) => a.priority - b.priority);
        
        // 優先順位を1から連番に修正
        categoryParam.subCategories.forEach((sub, index) => {
          sub.priority = index + 1;
        });
        
        onUpdate(newParams);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text mb-2">レース傾向パラメータの選択</h2>
        <p className="text-gray-600">
          大カテゴリを3つ選択し、各カテゴリで4つの小カテゴリを優先順位付きで選択してください
        </p>
      </div>

      {/* 選択状況表示 */}
      <div className="bg-primary-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary-700">
            選択済み大カテゴリ: {selectedCategories.size} / 3
          </span>
          {selectedCategories.size === 3 && (
            <span className="text-sm text-green-600 font-medium">
              ✓ 大カテゴリ選択完了
            </span>
          )}
        </div>
      </div>

      {/* 大カテゴリ選択 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {raceCategories.map((categoryData) => (
          <motion.div
            key={categoryData.category}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedCategories.has(categoryData.category)
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => handleCategorySelect(categoryData.category)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{categoryData.category}</h3>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedCategories.has(categoryData.category)
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-gray-300'
              }`}>
                {selectedCategories.has(categoryData.category) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {categoryData.subCategories.length}個の小カテゴリ
            </p>
          </motion.div>
        ))}
      </div>

      {/* 選択済みカテゴリの詳細設定 */}
      <AnimatePresence>
        {raceParams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-text">小カテゴリの選択と優先順位設定</h3>
            
            {raceParams.map((param) => {
              const categoryData = raceCategories.find(c => c.category === param.category);
              
              return (
                <motion.div
                  key={param.category}
                  className="bg-gray-50 p-6 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    {param.category} - 選択済み: {param.subCategories.length} / 4
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryData?.subCategories.map((subCategory) => {
                      const isSelected = param.subCategories.some(sub => sub.id === subCategory.id);
                      const selectedSub = param.subCategories.find(sub => sub.id === subCategory.id);
                      
                      return (
                        <div
                          key={subCategory.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                          onClick={() => handleSubCategorySelect(param.category, subCategory.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-800">{subCategory.name}</h5>
                              <p className="text-sm text-gray-600">{subCategory.description}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-primary-500 bg-primary-500 text-white'
                                : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-1.5 h-1.5 bg-white rounded-full"
                                />
                              )}
                            </div>
                          </div>
                          
                          {isSelected && selectedSub && (
                            <div className="mt-3">
                              <select
                                value={selectedSub.priority}
                                onChange={(e) => handlePriorityChange(param.category, subCategory.id, parseInt(e.target.value))}
                                className="select-field w-full text-sm"
                              >
                                {[1, 2, 3, 4].map((priority) => (
                                  <option key={priority} value={priority}>
                                    優先度{priority}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 説明 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">レース傾向パラメータについて</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          レース傾向パラメータは、特定のレース条件でのAIロボットの判断基準を決定します。
          各カテゴリで4つの小カテゴリを選択し、優先順位を設定することで、
          より詳細な予想ロジックを構築できます。
        </p>
      </div>
    </div>
  );
};

export default Step3RaceParams; 