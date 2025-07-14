import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import RobotWizard from './components/RobotWizard';
import RobotList from './components/RobotList';
import RaceList from './components/RaceList';
import RacePredict from './components/RacePredict';
import AdminImport from './components/AdminImport';
import AdminOdds from './components/AdminOdds';
import AdminLearningIndex from './components/AdminLearningIndex';
import AdminDashboard from './components/AdminDashboard';
import AdminResults from './components/AdminResults';
import AdminUsers from './components/AdminUsers';
import AdminAnalysis from './components/AdminAnalysis';
import AdminSettings from './components/AdminSettings';

// ホーム画面コンポーネント
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            fontFamily: '"Noto Sans JP", sans-serif',
          },
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <motion.div 
          className="text-center mb-12 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 管理ダッシュボードボタン（右上） */}
          <div className="absolute top-0 right-0">
            <button
              onClick={() => navigate('/admin')}
              className="btn-secondary text-sm px-4 py-2"
            >
              <span className="flex items-center justify-center">
                <span className="mr-1">⚙️</span>
                管理ダッシュボード
              </span>
            </button>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 bg-gradient-to-r from-primary-600 to-accent-orange bg-clip-text text-transparent">
            ネクストフロンティアAI指数計算アプリ
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            競馬ファン向け指数計算ツール
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-orange mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* メインボタン群（ユーザー向けのみ） */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <button
              onClick={() => navigate('/race-list')}
              className="btn-primary text-lg px-8 py-3"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">🏇</span>
                レース一覧
              </span>
            </button>
            <button
              onClick={() => navigate('/create-robot')}
              className="btn-secondary text-lg px-8 py-3"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">🤖</span>
                AIロボットを作成
              </span>
            </button>
            <button
              onClick={() => navigate('/my-robots')}
              className="btn-secondary text-lg px-8 py-3"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">📋</span>
                マイロボット一覧
              </span>
            </button>
          </div>
        </motion.div>

        {/* アプリの説明セクション */}
        <motion.div 
          className="max-w-4xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 機能紹介カード */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">🚀</span>
                アプリの特徴
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-accent-orange-50 rounded-lg">
                  <div className="text-3xl mb-2">🏇</div>
                  <h4 className="font-semibold text-text mb-2">レース分析</h4>
                  <p className="text-sm text-gray-600">最新のレース情報とAI指数計算で競馬予想をサポート</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-secondary-50 to-accent-pink-50 rounded-lg">
                  <div className="text-3xl mb-2">🤖</div>
                  <h4 className="font-semibold text-text mb-2">AIロボット</h4>
                  <p className="text-sm text-gray-600">自分専用のAIロボットを作成して予想精度を向上</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-accent-orange-50 to-accent-yellow-50 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <h4 className="font-semibold text-text mb-2">指数計算</h4>
                  <p className="text-sm text-gray-600">能力指数と傾向指数を組み合わせた総合評価</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 使い方ガイド */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">📖</span>
                使い方ガイド
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-text mb-1">レース一覧から開始</h4>
                    <p className="text-sm text-gray-600">「レース一覧」ボタンから最新のレース情報を確認できます</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-text mb-1">AIロボットを作成</h4>
                    <p className="text-sm text-gray-600">「AIロボットを作成」ボタンから自分専用の予想ロボットを作成できます</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-text mb-1">マイロボットで管理</h4>
                    <p className="text-sm text-gray-600">「マイロボット一覧」で作成したロボットの管理と分析ができます</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// メインAppコンポーネント
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/race-list" element={<RaceList />} />
        <Route path="/race/:raceId/predict" element={<RacePredict />} />
        <Route path="/create-robot" element={<RobotWizard />} />
        <Route path="/my-robots" element={<RobotList />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/import" element={<AdminImport />} />
        <Route path="/admin/odds" element={<AdminOdds />} />
        <Route path="/admin/learning-index" element={<AdminLearningIndex />} />
        <Route path="/admin/results" element={<AdminResults />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/analysis" element={<AdminAnalysis />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
