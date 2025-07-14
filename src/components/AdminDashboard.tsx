import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  BarChart3, 
  Brain, 
  Trophy, 
  Users, 
  TrendingUp, 
  Settings,
  Calendar,
  Bot,
  Target
} from 'lucide-react';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  color: string;
  bgGradient: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // ダッシュボードカードの定義
  const dashboardCards: DashboardCard[] = [
    {
      id: 'csv-import',
      title: 'CSVインポート',
      description: 'レース情報や馬のデータを一括インポート',
      icon: FileText,
      route: '/admin/import',
      color: 'text-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      id: 'odds-management',
      title: '想定オッズ管理',
      description: 'レースの想定オッズを設定・管理',
      icon: BarChart3,
      route: '/admin/odds',
      color: 'text-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      id: 'learning-index',
      title: '学習的思考指数管理',
      description: '騎手・調教師・予想家の心理指数を管理',
      icon: Brain,
      route: '/admin/learning-index',
      color: 'text-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      id: 'race-results',
      title: 'レース結果登録',
      description: 'レース結果と成績データを登録',
      icon: Trophy,
      route: '/admin/results',
      color: 'text-orange-600',
      bgGradient: 'from-orange-50 to-orange-100'
    },
    {
      id: 'user-management',
      title: 'ユーザー管理',
      description: 'ユーザーアカウントと権限を管理',
      icon: Users,
      route: '/admin/users',
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100'
    },
    {
      id: 'robot-analysis',
      title: 'ロボット分析',
      description: 'AIロボットの性能と予想精度を分析',
      icon: TrendingUp,
      route: '/admin/analysis',
      color: 'text-pink-600',
      bgGradient: 'from-pink-50 to-pink-100'
    },
    {
      id: 'system-settings',
      title: 'システム設定',
      description: 'アプリケーションの設定とメンテナンス',
      icon: Settings,
      route: '/admin/settings',
      color: 'text-gray-600',
      bgGradient: 'from-gray-50 to-gray-100'
    }
  ];

  // サマリー統計データ（モック）
  const summaryStats = {
    totalRaces: 325,
    registeredRobots: 114,
    oddsConfiguredRaces: 90
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
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
        duration: 0.4
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

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
            ネクストフロンティア 管理ダッシュボード
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            競馬AI指数計算システムの管理ツール
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-orange mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <motion.div 
          className="max-w-7xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* サマリー統計カード */}
          <motion.div variants={itemVariants}>
            <div className="card bg-gradient-to-r from-primary-50 to-accent-orange/10 border-primary-200">
              <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">📊</span>
                システム概要
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {summaryStats.totalRaces.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    合計レース数
                  </div>
                </motion.div>

                <motion.div 
                  className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <Bot className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {summaryStats.registeredRobots.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    登録済みAIロボット数
                  </div>
                </motion.div>

                <motion.div 
                  className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {summaryStats.oddsConfiguredRaces.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    想定オッズ設定済レース数
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* 管理機能カード */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">⚙️</span>
                管理機能
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dashboardCards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className={`group cursor-pointer bg-gradient-to-br ${card.bgGradient} rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-lg`}
                    onClick={() => navigate(card.route)}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`w-16 h-16 ${card.bgGradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <card.icon className={`w-8 h-8 ${card.color}`} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                          {card.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* ホバー時の矢印アイコン */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* クイックアクション */}
          <motion.div variants={itemVariants}>
            <div className="card bg-gradient-to-r from-accent-orange/5 to-primary-50 border-accent-orange/20">
              <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-accent-orange/20 text-accent-orange rounded-full flex items-center justify-center text-sm font-bold mr-3">🚀</span>
                クイックアクション
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <button
                  onClick={() => navigate('/admin/import')}
                  className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
                >
                  <FileText className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700">CSVインポート</span>
                </button>
                
                <button
                  onClick={() => navigate('/admin/odds')}
                  className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
                >
                  <BarChart3 className="w-5 h-5 text-green-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700">オッズ管理</span>
                </button>
                
                <button
                  onClick={() => navigate('/admin/learning-index')}
                  className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
                >
                  <Brain className="w-5 h-5 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700">思考指数</span>
                </button>
                
                <button
                  onClick={() => navigate('/admin/results')}
                  className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
                >
                  <Trophy className="w-5 h-5 text-orange-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700">結果登録</span>
                </button>
                
                <button
                  onClick={() => navigate('/admin/users')}
                  className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
                >
                  <Users className="w-5 h-5 text-indigo-600 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700">ユーザー管理</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard; 