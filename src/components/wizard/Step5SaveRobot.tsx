import React from 'react';
import { motion } from 'framer-motion';
import { RobotData } from '../RobotWizard';

interface Step5SaveRobotProps {
  robotData: RobotData;
  onUpdate: (value: string) => void;
  onSave: () => void;
}

const Step5SaveRobot: React.FC<Step5SaveRobotProps> = ({ robotData, onUpdate, onSave }) => {
  const getLearningThoughtTitle = (id: string) => {
    const options = [
      { id: 'jockey', title: '騎手心理思考' },
      { id: 'trainer', title: '調教師心理思考' },
      { id: 'predictor', title: '予想家心理思考' }
    ];
    return options.find(opt => opt.id === id)?.title || id;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text mb-2">AIロボットの保存</h2>
        <p className="text-gray-600">
          設定内容を確認し、ロボット名を入力して保存してください
        </p>
      </div>

      {/* ロボット名入力 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ロボット名 *
          </label>
          <input
            type="text"
            value={robotData.robotName}
            onChange={(e) => onUpdate(e.target.value)}
            className="input-field w-full"
            placeholder="例: マイAI予想ロボット"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            {robotData.robotName.length}/50文字
          </p>
        </div>
      </div>

      {/* 設定内容確認 */}
      <motion.div
        className="bg-gray-50 p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">設定内容の確認</h3>
        
        <div className="space-y-4">
          {/* 根幹指数 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium text-gray-700">根幹指数</span>
            <span className="text-primary-600 font-semibold">
              {robotData.rootIndex} (計算値: {robotData.rootIndex * 0.5}点)
            </span>
          </div>

          {/* 傾向パラメータ */}
          <div className="p-3 bg-white rounded-lg">
            <span className="font-medium text-gray-700 block mb-2">傾向パラメータ</span>
            <div className="space-y-1">
              {robotData.tendencyParams.map((param) => (
                <div key={param.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{param.name}</span>
                  <span className="text-primary-600 font-medium">優先度{param.priority}</span>
                </div>
              ))}
            </div>
          </div>

          {/* レース傾向パラメータ */}
          <div className="p-3 bg-white rounded-lg">
            <span className="font-medium text-gray-700 block mb-2">レース傾向パラメータ</span>
            <div className="space-y-2">
              {robotData.raceParams.map((param) => (
                <div key={param.category} className="border-l-2 border-primary-200 pl-3">
                  <span className="font-medium text-gray-700 text-sm">{param.category}</span>
                  <div className="mt-1 space-y-1">
                    {param.subCategories.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{sub.name}</span>
                        <span className="text-primary-600">優先度{sub.priority}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 学習的思考 */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg">
            <span className="font-medium text-gray-700">学習的思考</span>
            <span className="text-primary-600 font-semibold">
              {getLearningThoughtTitle(robotData.learningThought)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* 保存ボタン */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={onSave}
          disabled={!robotData.robotName.trim()}
          className={`btn-primary text-lg px-12 py-4 ${
            !robotData.robotName.trim() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span className="flex items-center justify-center">
            <span className="mr-2">🤖</span>
            AIロボットを保存
          </span>
        </button>
        
        {!robotData.robotName.trim() && (
          <p className="text-red-600 text-sm mt-3 font-medium">
            ロボット名を入力してください
          </p>
        )}
      </motion.div>

      {/* 保存後の説明 */}
      <motion.div
        className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="font-semibold text-green-800 mb-2">保存後の利用について</h4>
        <div className="space-y-2 text-sm text-green-700">
          <p>• 保存されたAIロボットは、ホーム画面から利用できます</p>
          <p>• ロボットは継続的に学習し、予想精度が向上します</p>
          <p>• 設定内容は後から編集することも可能です</p>
          <p>• 複数のロボットを作成して、異なる戦略を試すことができます</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Step5SaveRobot; 