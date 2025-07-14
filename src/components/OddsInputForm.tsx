import React from 'react';
import { motion } from 'framer-motion';
import { Horse } from '../types';

interface OddsInputFormProps {
  horses: Horse[];
  onOddsChange: (horseId: number, odds: number) => void;
}

const OddsInputForm: React.FC<OddsInputFormProps> = ({ horses, onOddsChange }) => {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
        <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
        想定オッズ入力
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary-50">
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-primary-700 rounded-l-lg">
                馬名
              </th>
              <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-primary-700 rounded-r-lg">
                想定オッズ
              </th>
            </tr>
          </thead>
          <tbody>
            {horses.map((horse, index) => (
              <motion.tr 
                key={horse.id} 
                className="hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="border border-gray-200 px-4 py-3 text-sm font-medium text-text">
                  {horse.name}
                </td>
                <td className="border border-gray-200 px-4 py-3">
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="100.0"
                    value={horse.odds}
                    onChange={(e) => onOddsChange(horse.id, parseFloat(e.target.value) || 1.0)}
                    className="input-field text-center"
                    placeholder="オッズを入力"
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default OddsInputForm; 