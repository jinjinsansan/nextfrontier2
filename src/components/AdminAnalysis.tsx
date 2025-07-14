import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  TrendingUp, 
  Calendar,
  User,
  Target,
  Percent,
  DollarSign,
  BarChart3,
  RefreshCw,
  Download,
  Eye,
  MoreHorizontal,
  Bot
} from 'lucide-react';

// ロボット分析データの型定義
interface RobotAnalysis {
  id: string;
  name: string;
  creator: {
    id: string;
    nickname: string;
    email: string;
  };
  createdAt: string;
  totalPredictions: number;
  correctPredictions: number;
  accuracyRate: number;
  averageIndex: number;
  returnRate: number;
  status: 'active' | 'inactive' | 'suspended';
  lastPredictionDate?: string;
}

// モックデータ
const mockRobotData: RobotAnalysis[] = [
  {
    id: '1',
    name: 'ディープインパクト予想AI',
    creator: {
      id: 'user1',
      nickname: '競馬マスター',
      email: 'master@example.com'
    },
    createdAt: '2024-01-15',
    totalPredictions: 156,
    correctPredictions: 89,
    accuracyRate: 57.1,
    averageIndex: 78.5,
    returnRate: 142.3,
    status: 'active',
    lastPredictionDate: '2024-12-20'
  },
  {
    id: '2',
    name: '血統分析ロボット',
    creator: {
      id: 'user2',
      nickname: '血統研究家',
      email: 'pedigree@example.com'
    },
    createdAt: '2024-02-20',
    totalPredictions: 203,
    correctPredictions: 134,
    accuracyRate: 66.0,
    averageIndex: 82.1,
    returnRate: 168.7,
    status: 'active',
    lastPredictionDate: '2024-12-19'
  },
  {
    id: '3',
    name: '調教師AIアシスタント',
    creator: {
      id: 'user3',
      nickname: '調教師ファン',
      email: 'trainer@example.com'
    },
    createdAt: '2024-03-10',
    totalPredictions: 98,
    correctPredictions: 52,
    accuracyRate: 53.1,
    averageIndex: 71.8,
    returnRate: 98.5,
    status: 'active',
    lastPredictionDate: '2024-12-18'
  },
  {
    id: '4',
    name: '騎手パターン分析',
    creator: {
      id: 'user4',
      nickname: '騎手ウォッチャー',
      email: 'jockey@example.com'
    },
    createdAt: '2024-04-05',
    totalPredictions: 187,
    correctPredictions: 101,
    accuracyRate: 54.0,
    averageIndex: 75.2,
    returnRate: 115.8,
    status: 'inactive',
    lastPredictionDate: '2024-11-30'
  },
  {
    id: '5',
    name: '距離適性AI',
    creator: {
      id: 'user5',
      nickname: '距離研究員',
      email: 'distance@example.com'
    },
    createdAt: '2024-05-12',
    totalPredictions: 134,
    correctPredictions: 87,
    accuracyRate: 64.9,
    averageIndex: 79.6,
    returnRate: 156.2,
    status: 'active',
    lastPredictionDate: '2024-12-20'
  },
  {
    id: '6',
    name: '天候予報ロボット',
    creator: {
      id: 'user6',
      nickname: '天候予報士',
      email: 'weather@example.com'
    },
    createdAt: '2024-06-18',
    totalPredictions: 76,
    correctPredictions: 41,
    accuracyRate: 53.9,
    averageIndex: 68.9,
    returnRate: 92.1,
    status: 'suspended',
    lastPredictionDate: '2024-12-10'
  }
];

const AdminAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [robots, setRobots] = useState<RobotAnalysis[]>(mockRobotData);
  const [filteredRobots, setFilteredRobots] = useState<RobotAnalysis[]>(mockRobotData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<RobotAnalysis | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 検索・フィルタ・ソートの適用
  useEffect(() => {
    let filtered = robots;

    // キーワード検索
    if (searchTerm) {
      filtered = filtered.filter(robot =>
        robot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        robot.creator.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        robot.creator.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // ステータスフィルタ
    if (statusFilter !== 'all') {
      filtered = filtered.filter(robot => robot.status === statusFilter);
    }

    // ソート
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'creator':
          aValue = a.creator.nickname;
          bValue = b.creator.nickname;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'totalPredictions':
          aValue = a.totalPredictions;
          bValue = b.totalPredictions;
          break;
        case 'accuracyRate':
          aValue = a.accuracyRate;
          bValue = b.accuracyRate;
          break;
        case 'averageIndex':
          aValue = a.averageIndex;
          bValue = b.averageIndex;
          break;
        case 'returnRate':
          aValue = a.returnRate;
          bValue = b.returnRate;
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredRobots(filtered);
  }, [robots, searchTerm, statusFilter, sortBy, sortOrder]);

  // データ再読み込み
  const handleRefresh = async () => {
    setIsLoading(true);
    // 実際のアプリではSupabaseからデータを取得
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('データを更新しました');
  };

  // 詳細表示
  const handleShowDetail = (robot: RobotAnalysis) => {
    setSelectedRobot(robot);
    setShowDetailModal(true);
  };

  // ステータス変更
  const handleStatusChange = async (robotId: string, newStatus: string) => {
    try {
      // 実際のアプリではSupabaseでステータスを更新
      setRobots(prev => prev.map(robot =>
        robot.id === robotId ? { ...robot, status: newStatus as any } : robot
      ));
      toast.success('ステータスを更新しました');
    } catch (error) {
      toast.error('ステータスの更新に失敗しました');
    }
  };

  // 統計データ
  const stats = {
    totalRobots: robots.length,
    activeRobots: robots.filter(r => r.status === 'active').length,
    averageAccuracy: Math.round(robots.reduce((sum, r) => sum + r.accuracyRate, 0) / robots.length * 10) / 10,
    averageReturnRate: Math.round(robots.reduce((sum, r) => sum + r.returnRate, 0) / robots.length * 10) / 10
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'アクティブ';
      case 'inactive': return '非アクティブ';
      case 'suspended': return '一時停止';
      default: return '不明';
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin')}
              className="btn-secondary mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text bg-gradient-to-r from-primary-600 to-accent-orange bg-clip-text text-transparent">
                ロボット分析
              </h1>
              <p className="text-gray-600 font-medium">
                AIロボットの性能と予想精度を分析
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="max-w-7xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 統計カード */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div 
                className="card bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-500 rounded-lg mr-4">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">総ロボット数</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.totalRobots}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card bg-gradient-to-r from-green-50 to-green-100 border-green-200"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-green-500 rounded-lg mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">アクティブ</p>
                    <p className="text-2xl font-bold text-green-700">{stats.activeRobots}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500 rounded-lg mr-4">
                    <Percent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">平均的中率</p>
                    <p className="text-2xl font-bold text-purple-700">{stats.averageAccuracy}%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="card bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <div className="p-3 bg-orange-500 rounded-lg mr-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-600 font-medium">平均回収率</p>
                    <p className="text-2xl font-bold text-orange-700">{stats.averageReturnRate}%</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* 検索・フィルタ */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* 検索 */}
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="ロボット名、作成者で検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10 w-full"
                    />
                  </div>
                </div>

                {/* ステータスフィルタ */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="select-field"
                  >
                    <option value="all">全ステータス</option>
                    <option value="active">アクティブ</option>
                    <option value="inactive">非アクティブ</option>
                    <option value="suspended">一時停止</option>
                  </select>
                </div>

                {/* ソート */}
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="select-field"
                  >
                    <option value="createdAt">作成日</option>
                    <option value="name">ロボット名</option>
                    <option value="creator">作成者</option>
                    <option value="totalPredictions">予想回数</option>
                    <option value="accuracyRate">的中率</option>
                    <option value="averageIndex">平均指数</option>
                    <option value="returnRate">回収率</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="btn-secondary px-3"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>

                {/* 更新ボタン */}
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  更新
                </button>
              </div>
            </div>
          </motion.div>

          {/* ロボット一覧テーブル */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ロボット名</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">作成者</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">作成日</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">予想回数</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">的中回数</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">的中率</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">平均指数</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">回収率</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ステータス</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredRobots.map((robot, index) => (
                        <motion.tr
                          key={robot.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">{robot.name}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{robot.creator.nickname}</div>
                              <div className="text-sm text-gray-500">{robot.creator.email}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-700">
                              {new Date(robot.createdAt).toLocaleDateString('ja-JP')}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-700 font-medium">{robot.totalPredictions}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-700 font-medium">{robot.correctPredictions}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className={`font-bold ${robot.accuracyRate >= 60 ? 'text-green-600' : robot.accuracyRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {robot.accuracyRate}%
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-700 font-medium">{robot.averageIndex}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className={`font-bold ${robot.returnRate >= 120 ? 'text-green-600' : robot.returnRate >= 100 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {robot.returnRate}%
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(robot.status)}`}>
                              {getStatusText(robot.status)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleShowDetail(robot)}
                                className="btn-secondary p-2"
                                title="詳細表示"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <div className="relative">
                                <button className="btn-secondary p-2" title="その他">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>

                {filteredRobots.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">ロボットが見つかりません</p>
                      <p className="text-sm">検索条件を変更してください</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 詳細モーダル */}
      <AnimatePresence>
        {showDetailModal && selectedRobot && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">ロボット詳細</h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 基本情報 */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">基本情報</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">ロボット名</label>
                        <p className="font-medium">{selectedRobot.name}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">作成者</label>
                        <p className="font-medium">{selectedRobot.creator.nickname}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">作成日</label>
                        <p className="font-medium">{new Date(selectedRobot.createdAt).toLocaleDateString('ja-JP')}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">ステータス</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRobot.status)}`}>
                          {getStatusText(selectedRobot.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* パフォーマンス */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">パフォーマンス</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">総予想回数</label>
                        <p className="text-2xl font-bold text-blue-600">{selectedRobot.totalPredictions}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">的中回数</label>
                        <p className="text-2xl font-bold text-green-600">{selectedRobot.correctPredictions}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">的中率</label>
                        <p className={`text-2xl font-bold ${selectedRobot.accuracyRate >= 60 ? 'text-green-600' : selectedRobot.accuracyRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {selectedRobot.accuracyRate}%
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">平均指数</label>
                        <p className="text-2xl font-bold text-purple-600">{selectedRobot.averageIndex}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">回収率</label>
                        <p className={`text-2xl font-bold ${selectedRobot.returnRate >= 120 ? 'text-green-600' : selectedRobot.returnRate >= 100 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {selectedRobot.returnRate}%
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">最終予想日</label>
                        <p className="font-medium">
                          {selectedRobot.lastPredictionDate 
                            ? new Date(selectedRobot.lastPredictionDate).toLocaleDateString('ja-JP')
                            : 'なし'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ステータス変更 */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">ステータス変更</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(selectedRobot.id, 'active')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          selectedRobot.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                        }`}
                      >
                        アクティブ
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedRobot.id, 'inactive')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          selectedRobot.status === 'inactive'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        非アクティブ
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedRobot.id, 'suspended')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          selectedRobot.status === 'suspended'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-50'
                        }`}
                      >
                        一時停止
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="btn-secondary"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAnalysis; 