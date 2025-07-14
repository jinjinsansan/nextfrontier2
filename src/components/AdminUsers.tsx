import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Pause, 
  Play, 
  Trash2, 
  Calendar,
  Mail,
  User,
  Bot,
  Clock,
  ArrowLeft,
  X,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
  lastLoginAt: string;
  robotCount: number;
  status: 'active' | 'suspended' | 'deleted';
  avatar?: string;
}

interface UserDetail {
  id: string;
  email: string;
  nickname: string;
  createdAt: string;
  lastLoginAt: string;
  robotCount: number;
  status: 'active' | 'suspended' | 'deleted';
  avatar?: string;
  totalPredictions: number;
  successRate: number;
  favoriteVenue: string;
  membershipLevel: 'free' | 'premium' | 'pro';
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'lastLoginAt' | 'robotCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'deleted'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // モックユーザーデータ
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'user1@example.com',
      nickname: '競馬ファン太郎',
      createdAt: '2024-01-15T10:30:00Z',
      lastLoginAt: '2024-01-20T14:20:00Z',
      robotCount: 3,
      status: 'active'
    },
    {
      id: '2',
      email: 'user2@example.com',
      nickname: 'ダービー予想師',
      createdAt: '2024-01-10T09:15:00Z',
      lastLoginAt: '2024-01-19T16:45:00Z',
      robotCount: 5,
      status: 'active'
    },
    {
      id: '3',
      email: 'user3@example.com',
      nickname: '馬券研究家',
      createdAt: '2024-01-05T11:00:00Z',
      lastLoginAt: '2023-12-20T10:30:00Z',
      robotCount: 2,
      status: 'suspended'
    },
    {
      id: '4',
      email: 'user4@example.com',
      nickname: 'レース分析マン',
      createdAt: '2023-12-28T15:20:00Z',
      lastLoginAt: '2024-01-18T13:10:00Z',
      robotCount: 8,
      status: 'active'
    },
    {
      id: '5',
      email: 'user5@example.com',
      nickname: '血統研究員',
      createdAt: '2023-12-15T08:45:00Z',
      lastLoginAt: '2023-11-25T12:00:00Z',
      robotCount: 1,
      status: 'suspended'
    },
    {
      id: '6',
      email: 'user6@example.com',
      nickname: 'オッズ予想家',
      createdAt: '2023-12-10T14:30:00Z',
      lastLoginAt: '2024-01-21T09:15:00Z',
      robotCount: 12,
      status: 'active'
    }
  ];

  // 初期データ読み込み
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        // モックAPI呼び出し
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        toast.error('ユーザーデータの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // フィルタリングとソート
  useEffect(() => {
    let filtered = [...users];

    // 検索フィルタ
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // ステータスフィルタ
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // ソート
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'lastLoginAt':
          aValue = new Date(a.lastLoginAt).getTime();
          bValue = new Date(b.lastLoginAt).getTime();
          break;
        case 'robotCount':
          aValue = a.robotCount;
          bValue = b.robotCount;
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, sortBy, sortOrder, statusFilter]);

  // ユーザー詳細取得
  const handleViewDetails = async (userId: string) => {
    try {
      // モック詳細データ
      const mockDetail: UserDetail = {
        id: userId,
        email: mockUsers.find(u => u.id === userId)?.email || '',
        nickname: mockUsers.find(u => u.id === userId)?.nickname || '',
        createdAt: mockUsers.find(u => u.id === userId)?.createdAt || '',
        lastLoginAt: mockUsers.find(u => u.id === userId)?.lastLoginAt || '',
        robotCount: mockUsers.find(u => u.id === userId)?.robotCount || 0,
        status: mockUsers.find(u => u.id === userId)?.status || 'active',
        totalPredictions: Math.floor(Math.random() * 1000) + 50,
        successRate: Math.random() * 30 + 10,
        favoriteVenue: ['東京競馬場', '阪神競馬場', '京都競馬場', '中山競馬場'][Math.floor(Math.random() * 4)],
        membershipLevel: ['free', 'premium', 'pro'][Math.floor(Math.random() * 3)] as 'free' | 'premium' | 'pro'
      };
      
      setSelectedUser(mockDetail);
    } catch (error) {
      toast.error('ユーザー詳細の取得に失敗しました');
    }
  };

  // ステータス変更
  const handleStatusChange = async (userId: string, newStatus: 'active' | 'suspended') => {
    try {
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      ));
      
      const statusText = newStatus === 'active' ? '再有効化' : '一時停止';
      toast.success(`ユーザーを${statusText}しました`);
    } catch (error) {
      toast.error('ステータス変更に失敗しました');
    }
  };

  // ユーザー削除
  const handleDeleteUser = async (userId: string) => {
    try {
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, status: 'deleted' } : user
      ));
      setShowDeleteConfirm(null);
      toast.success('ユーザーを削除しました');
    } catch (error) {
      toast.error('ユーザー削除に失敗しました');
    }
  };

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ステータス表示
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { text: 'アクティブ', color: 'bg-green-100 text-green-800' },
      suspended: { text: '一時停止', color: 'bg-yellow-100 text-yellow-800' },
      deleted: { text: '削除済み', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <h1 className="text-3xl font-bold text-gray-800">ユーザー管理</h1>
          </div>
          <p className="text-gray-600 text-lg">登録ユーザーの管理と分析</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              {/* 検索・フィルタ */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* 検索 */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="ニックネームまたはメールで検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* ソート */}
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="createdAt">登録日</option>
                      <option value="lastLoginAt">最終ログイン</option>
                      <option value="robotCount">ロボット数</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>

                {/* ステータスフィルタ */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'すべて', color: 'bg-gray-100 text-gray-800' },
                    { value: 'active', label: 'アクティブ', color: 'bg-green-100 text-green-800' },
                    { value: 'suspended', label: '一時停止', color: 'bg-yellow-100 text-yellow-800' },
                    { value: 'deleted', label: '削除済み', color: 'bg-red-100 text-red-800' }
                  ].map(filter => (
                    <button
                      key={filter.value}
                      onClick={() => setStatusFilter(filter.value as any)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        statusFilter === filter.value
                          ? filter.color
                          : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ユーザー一覧 */}
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">ユーザーデータを読み込み中...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">該当するユーザーが見つかりません</p>
                    </div>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.nickname.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">{user.nickname}</h3>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                                                          <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Bot className="w-4 h-4" />
                              <span>{user.robotCount}個</span>
                            </div>
                              <div className="text-xs text-gray-500">
                                最終ログイン: {formatDate(user.lastLoginAt)}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {getStatusBadge(user.status)}
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleViewDetails(user.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="詳細表示"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                
                                {user.status === 'active' ? (
                                  <button
                                    onClick={() => handleStatusChange(user.id, 'suspended')}
                                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                    title="一時停止"
                                  >
                                    <Pause className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleStatusChange(user.id, 'active')}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="再有効化"
                                  >
                                    <Play className="w-4 h-4" />
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => setShowDeleteConfirm(user.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="削除"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* サイドバー: 統計情報 */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                統計情報
              </h2>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                  <div className="text-sm text-gray-600">総ユーザー数</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">アクティブユーザー</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600">
                    {users.filter(u => u.status === 'suspended').length}
                  </div>
                  <div className="text-sm text-gray-600">一時停止中</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Bot className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {users.reduce((sum, user) => sum + user.robotCount, 0)}
                  </div>
                  <div className="text-sm text-gray-600">総ロボット数</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ユーザー詳細サイドパネル */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedUser(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">ユーザー詳細</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 基本情報 */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                      {selectedUser.nickname.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{selectedUser.nickname}</h3>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      {getStatusBadge(selectedUser.status)}
                    </div>
                  </div>

                  {/* 統計情報 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">{selectedUser.robotCount}</div>
                      <div className="text-sm text-gray-600">作成ロボット数</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">{selectedUser.totalPredictions}</div>
                      <div className="text-sm text-gray-600">総予想回数</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-600">{selectedUser.successRate.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">的中率</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="text-lg font-bold text-purple-600">{selectedUser.favoriteVenue}</div>
                      <div className="text-sm text-gray-600">お気に入り競馬場</div>
                    </div>
                  </div>

                  {/* 詳細情報 */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>登録日: {formatDate(selectedUser.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>最終ログイン: {formatDate(selectedUser.lastLoginAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>メンバーシップ: {selectedUser.membershipLevel}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 削除確認ダイアログ */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-800">ユーザー削除の確認</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  このユーザーを削除しますか？この操作は取り消すことができません。
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => handleDeleteUser(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    削除
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminUsers; 