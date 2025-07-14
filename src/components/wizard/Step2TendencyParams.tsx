import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TendencyParam } from '../RobotWizard';

interface Step2TendencyParamsProps {
  tendencyParams: TendencyParam[];
  onUpdate: (value: TendencyParam[]) => void;
}

const tendencyCategories = [
  { id: 1, name: '血統分析', description: '血統による能力予測' },
  { id: 2, name: '調教師実績', description: '調教師の過去成績' },
  { id: 3, name: '騎手実績', description: '騎手の過去成績' },
  { id: 4, name: '馬場適性', description: '馬場条件への適応性' },
  { id: 5, name: '距離適性', description: 'レース距離への適応性' },
  { id: 6, name: '天候適性', description: '天候条件への適応性' },
  { id: 7, name: '出走間隔', description: '前走からの経過日数' },
  { id: 8, name: '負担重量', description: '負担重量の影響度' }
];

const Step2TendencyParams: React.FC<Step2TendencyParamsProps> = ({ tendencyParams, onUpdate }) => {
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(
    new Set(tendencyParams.map(p => p.id))
  );

  const handleCategorySelect = (categoryId: number) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else if (newSelected.size < 4) {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);

    // 優先順位を自動設定
    const newParams: TendencyParam[] = Array.from(newSelected).map((id, index) => {
      const category = tendencyCategories.find(c => c.id === id);
      return {
        id,
        name: category?.name || '',
        priority: index + 1
      };
    });

    onUpdate(newParams);
  };

  const handlePriorityChange = (categoryId: number, newPriority: number) => {
    const newParams = [...tendencyParams];
    const targetIndex = newParams.findIndex(p => p.id === categoryId);
    
    if (targetIndex !== -1) {
      // 優先順位を更新
      newParams[targetIndex].priority = newPriority;
      
      // 他の項目の優先順位を調整
      newParams.forEach((param, index) => {
        if (param.id !== categoryId) {
          if (param.priority >= newPriority) {
            param.priority++;
          }
        }
      });
      
      // 優先順位でソート
      newParams.sort((a, b) => a.priority - b.priority);
      
      // 優先順位を1から連番に修正
      newParams.forEach((param, index) => {
        param.priority = index + 1;
      });
      
      onUpdate(newParams);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text mb-2">傾向パラメータの選択</h2>
        <p className="text-gray-600">
          8つのカテゴリから4つを選択し、優先順位を設定してください
        </p>
      </div>

      {/* 選択状況表示 */}
      <div className="bg-primary-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary-700">
            選択済み: {selectedCategories.size} / 4
          </span>
          {selectedCategories.size === 4 && (
            <span className="text-sm text-green-600 font-medium">
              ✓ 選択完了
            </span>
          )}
        </div>
      </div>

      {/* カテゴリ選択 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tendencyCategories.map((category) => (
          <motion.div
            key={category.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedCategories.has(category.id)
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => handleCategorySelect(category.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedCategories.has(category.id)
                  ? 'border-primary-500 bg-primary-500 text-white'
                  : 'border-gray-300'
              }`}>
                {selectedCategories.has(category.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 選択済みカテゴリの優先順位設定 */}
      <AnimatePresence>
        {tendencyParams.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-text">優先順位の設定</h3>
            <div className="space-y-3">
              {tendencyParams.map((param) => (
                <motion.div
                  key={param.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span className="font-medium text-gray-800">{param.name}</span>
                  <select
                    value={param.priority}
                    onChange={(e) => handlePriorityChange(param.id, parseInt(e.target.value))}
                    className="select-field w-24"
                  >
                    {[1, 2, 3, 4].map((priority) => (
                      <option key={priority} value={priority}>
                        優先度{priority}
                      </option>
                    ))}
                  </select>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 説明 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">傾向パラメータについて</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          傾向パラメータは、AIロボットが予想を行う際に重視する要素を決定します。
          優先度が高いほど、その要素を重視した予想を行います。
        </p>
      </div>
    </div>
  );
};

export default Step2TendencyParams; 