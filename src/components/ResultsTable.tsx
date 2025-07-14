import React from 'react';
import { motion } from 'framer-motion';
import { CalculationResult } from '../types';

interface ResultsTableProps {
  results: CalculationResult[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-text mb-4">計算結果</h3>
        <p className="text-gray-500 text-center py-8">計算結果がありません</p>
      </motion.div>
    );
  }

  // 総合指数でソート（降順）
  const sortedResults = [...results].sort((a, b) => b.totalIndex - a.totalIndex);

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
        <span className="w-8 h-8 bg-accent-green text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">✓</span>
        計算結果
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
              <th className="border border-primary-400 px-4 py-3 text-left text-sm font-semibold rounded-l-lg">
                順位
              </th>
              <th className="border border-primary-400 px-4 py-3 text-left text-sm font-semibold">
                馬名
              </th>
              <th className="border border-primary-400 px-4 py-3 text-left text-sm font-semibold">
                根幹指数
              </th>
              <th className="border border-primary-400 px-4 py-3 text-left text-sm font-semibold">
                能力指数
              </th>
              <th className="border border-primary-400 px-4 py-3 text-left text-sm font-semibold">
                傾向指数
              </th>
              <th className="border border-primary-400 px-4 py-3 text-left text-sm font-semibold rounded-r-lg">
                総合指数
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((result, index) => (
              <motion.tr 
                key={result.horseId} 
                className="hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="border border-gray-200 px-4 py-3 text-sm font-bold text-text">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm font-semibold text-text">
                  {result.horseName}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                  {result.baseIndex}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                  {result.abilityIndex}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm text-gray-600">
                  {result.tendencyIndex}
                </td>
                <td className="border border-gray-200 px-4 py-3 text-sm font-bold text-primary-600">
                  <span className="text-lg">{result.totalIndex}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 結果サマリー */}
      <motion.div 
        className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h4 className="text-lg font-semibold text-primary-700 mb-2">結果サマリー</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">1位:</span>
            <span className="ml-2 font-semibold text-text">{sortedResults[0]?.horseName}</span>
            <span className="ml-2 text-primary-600 font-bold">({sortedResults[0]?.totalIndex})</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">2位:</span>
            <span className="ml-2 font-semibold text-text">{sortedResults[1]?.horseName}</span>
            <span className="ml-2 text-primary-600 font-bold">({sortedResults[1]?.totalIndex})</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">3位:</span>
            <span className="ml-2 font-semibold text-text">{sortedResults[2]?.horseName}</span>
            <span className="ml-2 text-primary-600 font-bold">({sortedResults[2]?.totalIndex})</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultsTable; 