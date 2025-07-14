import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  id: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          {/* ステップ番号 */}
          <motion.div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step.id <= currentStep
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-500'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {step.id}
          </motion.div>

          {/* ステップタイトル */}
          <div className="ml-3">
            <div
              className={`text-sm font-medium ${
                step.id <= currentStep ? 'text-primary-600' : 'text-gray-500'
              }`}
            >
              {step.title}
            </div>
          </div>

          {/* 接続線 */}
          {index < steps.length - 1 && (
            <div className="w-16 h-0.5 mx-4 bg-gray-200 relative">
              {step.id < currentStep && (
                <motion.div
                  className="absolute top-0 left-0 h-full bg-primary-600"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator; 