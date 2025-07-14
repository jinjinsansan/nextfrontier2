import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HorseCategory } from '../types';

interface CategorySelectorProps {
  categories: HorseCategory[];
  selectedCategories: HorseCategory[];
  onCategorySelect: (category: HorseCategory) => void;
  onCategoryRemove: (categoryId: number) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategories,
  onCategorySelect,
  onCategoryRemove
}) => {
  const availableCategories = categories.filter(
    cat => !selectedCategories.find(selected => selected.id === cat.id)
  );

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
        <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
        傾向指数用カテゴリ選択（優先順位付きで4つ選択）
      </h3>
      
      {/* 選択済みカテゴリ */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-text mb-4">選択済みカテゴリ（優先順位順）</h4>
        <div className="flex flex-wrap gap-3">
          <AnimatePresence>
            {selectedCategories.map((category, index) => (
              <motion.div
                key={category.id}
                className="flex items-center bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <span className="font-bold mr-2 text-white bg-white bg-opacity-20 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                <span>{category.name}</span>
                <button
                  onClick={() => onCategoryRemove(category.id)}
                  className="ml-3 text-white hover:text-red-200 transition-colors duration-200"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {selectedCategories.length === 0 && (
          <p className="text-gray-500 text-sm font-medium">カテゴリを選択してください</p>
        )}
      </div>

      {/* 選択可能なカテゴリ */}
      {availableCategories.length > 0 && selectedCategories.length < 4 && (
        <div>
          <h4 className="text-lg font-semibold text-text mb-4">選択可能なカテゴリ</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableCategories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => onCategorySelect(category)}
                className="btn-secondary text-sm py-3 px-4 hover:bg-primary-100 hover:text-primary-700 transition-all duration-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {selectedCategories.length >= 4 && (
        <motion.div
          className="bg-accent-green bg-opacity-10 border border-accent-green rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-accent-green text-sm font-semibold text-center">
            ✓ 4つのカテゴリが選択されました
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategorySelector; 