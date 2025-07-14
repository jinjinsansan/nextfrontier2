import React from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

interface Step4LearningThoughtProps {
  learningThought: string;
  onUpdate: (value: string) => void;
}

const learningThoughtOptions = [
  {
    id: 'jockey',
    title: '騎手心理思考',
    description: '騎手の心理状態や戦略を重視した思考パターン',
    details: [
      '騎手の過去の戦績を分析',
      '騎手の性格や特徴を考慮',
      'レース展開の読み方を学習',
      '騎手の得意・不得意を把握'
    ],
    icon: '🏇'
  },
  {
    id: 'trainer',
    title: '調教師心理思考',
    description: '調教師の戦略や馬の状態管理を重視した思考パターン',
    details: [
      '調教師の過去の実績を分析',
      '馬の状態管理能力を評価',
      '調教師の戦略パターンを学習',
      '調教師の得意分野を把握'
    ],
    icon: '👨‍🏫'
  },
  {
    id: 'predictor',
    title: '予想家心理思考',
    description: 'プロ予想家の分析手法を模倣した思考パターン',
    details: [
      'プロ予想家の分析手法を学習',
      '統計データの読み方を習得',
      '市場動向の分析を重視',
      '予想精度の向上を目指す'
    ],
    icon: '📊'
  }
];

const Step4LearningThought: React.FC<Step4LearningThoughtProps> = ({ learningThought, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text mb-2">学習的思考の選択</h2>
        <p className="text-gray-600">
          AIロボットが学習する思考パターンを選択してください
        </p>
      </div>

      {/* 選択状況表示 */}
      <div className="bg-primary-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary-700">
            選択状況: {learningThought ? '選択済み' : '未選択'}
          </span>
          {learningThought && (
            <span className="text-sm text-green-600 font-medium">
              ✓ 思考パターン選択完了
            </span>
          )}
        </div>
      </div>

      {/* 選択肢 */}
      <div className="space-y-4">
        {learningThoughtOptions.map((option) => (
          <motion.div
            key={option.id}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              learningThought === option.id
                ? 'border-primary-500 bg-primary-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => onUpdate(option.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-4">
              {/* アイコン */}
              <div className="text-3xl">{option.icon}</div>
              
              {/* コンテンツ */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{option.title}</h3>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    learningThought === option.id
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-gray-300'
                  }`}>
                    {learningThought === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{option.description}</p>
                
                {/* 詳細リスト */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">学習内容:</h4>
                  <ul className="space-y-1">
                    {option.details.map((detail, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 選択された思考パターンの詳細表示 */}
      <AnimatePresence>
        {learningThought && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-primary-50 to-accent-orange-50 p-6 rounded-xl border border-primary-200"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-primary-700 mb-2">
                選択された思考パターン
              </h3>
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {learningThoughtOptions.find(opt => opt.id === learningThought)?.title}
              </div>
              <p className="text-sm text-gray-600">
                {learningThoughtOptions.find(opt => opt.id === learningThought)?.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 説明 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">学習的思考について</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          学習的思考は、AIロボットが予想を行う際の基本的な思考パターンを決定します。
          選択した思考パターンに基づいて、AIロボットは継続的に学習し、
          より精度の高い予想を提供するようになります。
        </p>
      </div>
    </div>
  );
};

export default Step4LearningThought; 