import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { RobotData } from './RobotWizard';

interface SavedRobot extends RobotData {
  id: number;
  createdAt: string;
}

const RobotList: React.FC = () => {
  const [robots, setRobots] = useState<SavedRobot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // localStorageからロボットデータを読み込み
  useEffect(() => {
    const loadRobots = () => {
      try {
        const savedRobots = JSON.parse(localStorage.getItem('aiRobots') || '[]');
        setRobots(savedRobots);
      } catch (error) {
        console.error('ロボットデータの読み込みに失敗しました:', error);
        toast.error('ロボットデータの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadRobots();
  }, []);

  // ロボット削除
  const handleDeleteRobot = (robotId: number, robotName: string) => {
    if (window.confirm(`「${robotName}」を削除しますか？\nこの操作は取り消せません。`)) {
      try {
        const updatedRobots = robots.filter(robot => robot.id !== robotId);
        localStorage.setItem('aiRobots', JSON.stringify(updatedRobots));
        setRobots(updatedRobots);
        toast.success(`「${robotName}」を削除しました`);
      } catch (error) {
        console.error('ロボットの削除に失敗しました:', error);
        toast.error('ロボットの削除に失敗しました');
      }
    }
  };

  // ロボット使用（後で実装予定）
  const handleUseRobot = (robot: SavedRobot) => {
    console.log('使用するロボット:', robot);
    toast.success(`「${robot.robotName}」を選択しました`);
    // 後で /race-list への遷移を実装
  };

  // 日時フォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 学習的思考の表示名を取得
  const getLearningThoughtTitle = (id: string) => {
    const options = [
      { id: 'jockey', title: '騎手心理思考' },
      { id: 'trainer', title: '調教師心理思考' },
      { id: 'predictor', title: '予想家心理思考' }
    ];
    return options.find(opt => opt.id === id)?.title || id;
  };

  // パラメータの簡略表示
  const getParameterSummary = (robot: SavedRobot) => {
    const summary = [];
    
    // 根幹指数
    summary.push(`根幹: ${robot.rootIndex}`);
    
    // 傾向パラメータ（上位2つ）
    if (robot.tendencyParams.length > 0) {
      const topTendency = robot.tendencyParams
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 2)
        .map(p => p.name)
        .join(', ');
      summary.push(`傾向: ${topTendency}`);
    }
    
    // レース傾向パラメータ（上位2つ）
    if (robot.raceParams.length > 0) {
      const topRace = robot.raceParams
        .slice(0, 2)
        .map(p => p.category)
        .join(', ');
      summary.push(`レース: ${topRace}`);
    }
    
    // 学習的思考
    if (robot.learningThought) {
      summary.push(`思考: ${getLearningThoughtTitle(robot.learningThought)}`);
    }
    
    return summary;
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ロボットデータを読み込み中...</p>
        </div>
      </div>
    );
  }

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
            AIロボット一覧
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            作成したAIロボットを管理しましょう
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-orange mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* 統計情報 */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-primary-50 p-6 rounded-xl inline-block">
            <div className="text-2xl font-bold text-primary-600 mb-2">
              {robots.length}台
            </div>
            <div className="text-sm text-gray-600">
              作成済みAIロボット
            </div>
          </div>
        </motion.div>

        {/* ロボット一覧 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {robots.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                まだAIロボットがありません
              </h3>
              <p className="text-gray-600 mb-6">
                最初のAIロボットを作成してみましょう
              </p>
              <button
                onClick={() => window.location.href = '/create-robot'}
                className="btn-primary text-lg px-8 py-3"
              >
                AIロボットを作成
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {robots.map((robot) => (
                  <motion.div
                    key={robot.id}
                    variants={itemVariants}
                    layout
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="p-6">
                      {/* ロボット名 */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {robot.robotName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          作成日: {formatDate(robot.createdAt)}
                        </p>
                      </div>

                      {/* パラメータ概要 */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          設定パラメータ
                        </h4>
                        <div className="space-y-1">
                          {getParameterSummary(robot).map((param, index) => (
                            <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              {param}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* アクションボタン */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleUseRobot(robot)}
                          className="flex-1 btn-primary text-sm py-2"
                        >
                          <span className="flex items-center justify-center">
                            <span className="mr-1">▶</span>
                            使う
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteRobot(robot.id, robot.robotName)}
                          className="flex-1 btn-secondary text-sm py-2 bg-red-500 hover:bg-red-600 text-white border-red-500"
                        >
                          <span className="flex items-center justify-center">
                            <span className="mr-1">🗑</span>
                            削除
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* 新規作成ボタン */}
        {robots.length > 0 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => window.location.href = '/create-robot'}
              className="btn-primary text-lg px-8 py-3"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">➕</span>
                新しいAIロボットを作成
              </span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RobotList; 