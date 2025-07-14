import React from 'react';
import { motion } from 'framer-motion';

interface Step1RootIndexProps {
  rootIndex: number;
  onUpdate: (value: number) => void;
}

const Step1RootIndex: React.FC<Step1RootIndexProps> = ({ rootIndex, onUpdate }) => {
  const calculatedIndex = rootIndex * 0.5;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text mb-2">根幹指数の設定</h2>
        <p className="text-gray-600">
          あなたのAIロボットの基本性能を決定する根幹指数を設定してください
        </p>
      </div>

      <div className="space-y-6">
        {/* スライダー */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            根幹指数: {rootIndex}
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={rootIndex}
              onChange={(e) => onUpdate(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* 数値入力 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            直接入力
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={rootIndex}
            onChange={(e) => onUpdate(parseInt(e.target.value) || 0)}
            className="input-field w-full"
            placeholder="0〜100の値を入力"
          />
        </div>

        {/* 計算結果表示 */}
        <motion.div
          className="bg-gradient-to-r from-primary-50 to-accent-orange-50 p-6 rounded-xl border border-primary-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary-700 mb-2">
              計算結果
            </h3>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              根幹指数: {calculatedIndex}点
            </div>
            <p className="text-sm text-gray-600">
              入力値 × 0.5 = {rootIndex} × 0.5 = {calculatedIndex}
            </p>
          </div>
        </motion.div>

        {/* 説明 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">根幹指数について</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            根幹指数は、AIロボットの基本性能を決定する重要なパラメータです。
            この値が高いほど、ロボットの基本性能が向上しますが、
            他のパラメータとのバランスも重要です。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1RootIndex; 