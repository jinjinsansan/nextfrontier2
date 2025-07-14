import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Horse, Race, HorseCategory } from './types';
import OddsInputForm from './components/OddsInputForm';
import CategorySelector from './components/CategorySelector';
import ResultsTable from './components/ResultsTable';
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

// ダミーデータ
const dummyRaces: Race[] = [
  { id: 1, name: '東京優駿（日本ダービー）', date: '2024-05-26' },
  { id: 2, name: '皐月賞', date: '2024-04-14' },
  { id: 3, name: '菊花賞', date: '2024-10-20' },
  { id: 4, name: '天皇賞（春）', date: '2024-05-05' },
  { id: 5, name: '天皇賞（秋）', date: '2024-10-27' }
];

const horseCategories: HorseCategory[] = [
  { id: 1, name: '血統', priority: 0, placeRate: 0.15, efficiency: 0.8 },
  { id: 2, name: '調教師', priority: 0, placeRate: 0.12, efficiency: 0.7 },
  { id: 3, name: '騎手', priority: 0, placeRate: 0.18, efficiency: 0.9 },
  { id: 4, name: '馬場適性', priority: 0, placeRate: 0.14, efficiency: 0.75 },
  { id: 5, name: '距離適性', priority: 0, placeRate: 0.16, efficiency: 0.85 },
  { id: 6, name: '天候適性', priority: 0, placeRate: 0.13, efficiency: 0.65 },
  { id: 7, name: '出走間隔', priority: 0, placeRate: 0.11, efficiency: 0.6 },
  { id: 8, name: '負担重量', priority: 0, placeRate: 0.17, efficiency: 0.8 }
];

const horses: Horse[] = [
  { id: 1, name: 'ディープインパクト', odds: 0, placeRate: 0.25 },
  { id: 2, name: 'サイレンススズカ', odds: 0, placeRate: 0.22 },
  { id: 3, name: 'トウカイテイオー', odds: 0, placeRate: 0.28 },
  { id: 4, name: 'オグリキャップ', odds: 0, placeRate: 0.24 },
  { id: 5, name: 'シンボリルドルフ', odds: 0, placeRate: 0.26 },
  { id: 6, name: 'メジロマックイーン', odds: 0, placeRate: 0.23 },
  { id: 7, name: 'ナリタブライアン', odds: 0, placeRate: 0.27 },
  { id: 8, name: 'セイウンスカイ', odds: 0, placeRate: 0.21 }
];

// 計算関数
const calculateAllResults = (horses: Horse[], baseIndex: number, selectedCategories: HorseCategory[]) => {
  return horses.map(horse => {
    // ダミーの複勝率（実際のデータに置き換える）
    const placeRate = Math.random() * 0.3 + 0.1; // 10%〜40%
    
    // 能力指数（GPT計算式 - 最大50点）
    const abilityIndex = Math.min(50, (horse.odds > 0 ? 1 / horse.odds : 0) * 100);
    
    // 傾向指数（複勝率×優先度係数×複勝効率 - 最大50点）
    const prioritySum = selectedCategories.reduce((sum, cat) => sum + cat.priority, 0);
    const tendencyIndex = Math.min(50, placeRate * (prioritySum / 10) * 100);
    
    // 総合指数（x/200）×能力指数+((200-x)/200)×傾向指数
    const x = baseIndex; // 根幹指数をxとして使用
    const totalIndex = (x / 200) * abilityIndex + ((200 - x) / 200) * tendencyIndex;
    
    return {
      horse,
      abilityIndex: Math.round(abilityIndex * 100) / 100,
      tendencyIndex: Math.round(tendencyIndex * 100) / 100,
      totalIndex: Math.round(totalIndex * 100) / 100,
      placeRate: Math.round(placeRate * 1000) / 10
    };
  }).sort((a, b) => b.totalIndex - a.totalIndex);
};

// ホーム画面コンポーネント
const HomePage: React.FC = () => {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [baseIndexInput, setBaseIndexInput] = useState(50);
  const [selectedCategories, setSelectedCategories] = useState<HorseCategory[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const navigate = useNavigate();

  const handleOddsChange = (horseId: number, odds: number) => {
    // 実際のアプリでは、horsesのstateを管理する必要があります
    console.log(`Horse ${horseId} odds changed to ${odds}`);
  };

  const handleCategorySelect = (category: HorseCategory) => {
    if (selectedCategories.length < 4 && !selectedCategories.find(c => c.id === category.id)) {
      const newCategory = { ...category, priority: selectedCategories.length + 1 };
      setSelectedCategories([...selectedCategories, newCategory]);
    }
  };

  const handleCategoryRemove = (categoryId: number) => {
    const updatedCategories = selectedCategories
      .filter(cat => cat.id !== categoryId)
      .map((cat, index) => ({ ...cat, priority: index + 1 }));
    setSelectedCategories(updatedCategories);
  };

  // 計算実行
  const calculateResults = async () => {
    if (selectedCategories.length === 0) {
      toast.error('傾向指数用のカテゴリを4つ選択してください');
      return;
    }

    setIsCalculating(true);
    
    // 計算のシミュレーション（実際の計算処理）
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const baseIndex = baseIndexInput * 0.5;
    const newResults = calculateAllResults(horses, baseIndex, selectedCategories);
    setResults(newResults);
    
    setIsCalculating(false);
    toast.success('指数計算が完了しました！');
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
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 bg-gradient-to-r from-primary-600 to-accent-orange bg-clip-text text-transparent">
            ネクストフロンティアAI指数計算アプリ
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            競馬ファン向け指数計算ツール
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-orange mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* メインボタン群 */}
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
            <button
              onClick={() => navigate('/admin/import')}
              className="btn-secondary text-lg px-8 py-3"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">⚙️</span>
                管理者用CSVインポート
              </span>
            </button>
            <button
              onClick={() => navigate('/admin/odds')}
              className="btn-secondary text-lg px-8 py-3"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">💰</span>
                想定オッズ管理
              </span>
            </button>
            <button
              onClick={() => navigate('/admin/learning-index')}
              className="btn-secondary text-lg px-8 py-3"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">🧠</span>
                学習的思考指数管理
              </span>
            </button>
            <button
              onClick={() => navigate('/admin/results')}
              className="btn-secondary text-lg px-8 py-3"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">🏆</span>
                レース結果登録
              </span>
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              className="btn-secondary text-lg px-8 py-3"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">👥</span>
                ユーザー管理
              </span>
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="btn-secondary text-lg px-8 py-3"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2">🏠</span>
                管理ダッシュボード
              </span>
            </button>
          </div>
          <p className="text-sm text-gray-600">
            レースを選択してAI指数計算を開始するか、自分専用のAIロボットを作成しましょう
          </p>
        </motion.div>

        <motion.div 
          className="max-w-6xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* レース選択 */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                レース選択
              </h3>
              <select
                value={selectedRace?.id || ''}
                onChange={(e) => {
                  const race = dummyRaces.find(r => r.id === parseInt(e.target.value));
                  setSelectedRace(race || null);
                }}
                className="select-field"
              >
                {dummyRaces.map(race => (
                  <option key={race.id} value={race.id}>
                    {race.name} ({race.date})
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* 根幹指数入力 */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                根幹指数入力
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    根幹指数（0〜100）
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={baseIndexInput}
                    onChange={(e) => setBaseIndexInput(parseInt(e.target.value) || 0)}
                    className="input-field"
                    placeholder="0〜100の値を入力"
                  />
                </div>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-primary-700 mb-1">計算値</p>
                  <p className="text-2xl font-bold text-primary-600">{baseIndexInput * 0.5}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* オッズ入力フォーム */}
          <motion.div variants={itemVariants}>
            <OddsInputForm horses={horses} onOddsChange={handleOddsChange} />
          </motion.div>

          {/* カテゴリ選択 */}
          <motion.div variants={itemVariants}>
            <CategorySelector
              categories={horseCategories}
              selectedCategories={selectedCategories}
              onCategorySelect={handleCategorySelect}
              onCategoryRemove={handleCategoryRemove}
            />
          </motion.div>

          {/* 計算ボタン */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <button
              onClick={calculateResults}
              disabled={selectedCategories.length !== 4 || isCalculating}
              className={`btn-primary text-lg px-12 py-4 ${
                selectedCategories.length !== 4 || isCalculating 
                  ? 'opacity-50 cursor-not-allowed transform-none' 
                  : ''
              }`}
            >
              {isCalculating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  計算中...
                </div>
              ) : (
                '指数計算実行'
              )}
            </button>
            {selectedCategories.length !== 4 && (
              <p className="text-red-600 text-sm mt-3 font-medium">
                カテゴリを4つ選択してください（現在: {selectedCategories.length}個）
              </p>
            )}
          </motion.div>

          {/* 計算結果 */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ResultsTable results={results} />
              </motion.div>
            )}
          </AnimatePresence>
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
