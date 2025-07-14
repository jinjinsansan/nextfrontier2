import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

const RacePredict: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 bg-gradient-to-r from-primary-600 to-accent-orange bg-clip-text text-transparent">
            AI指数計算
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            レースID: {raceId}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-orange mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* プレースホルダーコンテンツ */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card text-center">
            <div className="text-6xl mb-6">🚧</div>
            <h2 className="text-2xl font-bold text-text mb-4">
              開発中です
            </h2>
            <p className="text-gray-600 mb-8">
              この画面では、レース詳細表示、AIロボット選択、指数計算・表示機能を実装予定です。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-text mb-3">予定機能</h3>
                <ul className="text-left text-gray-600 space-y-2">
                  <li>• レース詳細表示（馬番、馬名など）</li>
                  <li>• AIロボット選択</li>
                  <li>• 各馬の最終的能力指数計算</li>
                  <li>• 結果表示・ランキング</li>
                </ul>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-primary-700 mb-3">現在の進捗</h3>
                <div className="text-left text-primary-600 space-y-2">
                  <p>✅ レース一覧ページ</p>
                  <p>✅ AIロボット作成・管理</p>
                  <p>🔄 指数計算画面（開発中）</p>
                  <p>⏳ 結果表示・分析機能</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/race-list')}
                className="btn-secondary"
              >
                ← レース一覧に戻る
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-primary"
              >
                ホームに戻る
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RacePredict; 