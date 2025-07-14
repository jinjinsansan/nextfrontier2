import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { RaceListItem } from '../types';

// 仮レースデータ（RaceList.tsxと同じ）
const dummyRaceList: RaceListItem[] = [
  {
    id: "2025071401",
    name: "中京11R 芝1800m",
    date: "2025-07-14",
    venue: "中京",
    raceNumber: 11,
    course: "芝1800m",
    horses: 16,
    distance: "1800m",
    condition: "芝"
  },
  {
    id: "2025071402",
    name: "福島10R ダート1200m",
    date: "2025-07-14",
    venue: "福島",
    raceNumber: 10,
    course: "ダート1200m",
    horses: 13,
    distance: "1200m",
    condition: "ダート"
  },
  {
    id: "2025071403",
    name: "新潟9R 芝1600m",
    date: "2025-07-14",
    venue: "新潟",
    raceNumber: 9,
    course: "芝1600m",
    horses: 18,
    distance: "1600m",
    condition: "芝"
  },
  {
    id: "2025071501",
    name: "東京12R 芝2000m",
    date: "2025-07-15",
    venue: "東京",
    raceNumber: 12,
    course: "芝2000m",
    horses: 14,
    distance: "2000m",
    condition: "芝"
  },
  {
    id: "2025071502",
    name: "阪神8R ダート1400m",
    date: "2025-07-15",
    venue: "阪神",
    raceNumber: 8,
    course: "ダート1400m",
    horses: 15,
    distance: "1400m",
    condition: "ダート"
  },
  {
    id: "2025071503",
    name: "札幌7R 芝1200m",
    date: "2025-07-15",
    venue: "札幌",
    raceNumber: 7,
    course: "芝1200m",
    horses: 12,
    distance: "1200m",
    condition: "芝"
  },
  {
    id: "2025071601",
    name: "小倉11R 芝2400m",
    date: "2025-07-16",
    venue: "小倉",
    raceNumber: 11,
    course: "芝2400m",
    horses: 16,
    distance: "2400m",
    condition: "芝"
  },
  {
    id: "2025071602",
    name: "函館9R ダート1000m",
    date: "2025-07-16",
    venue: "函館",
    raceNumber: 9,
    course: "ダート1000m",
    horses: 11,
    distance: "1000m",
    condition: "ダート"
  }
];

// 仮馬データ
const generateHorses = (count: number) => {
  const horseNames = [
    'サクラバクシンオー', 'トウカイテイオー', 'ディープインパクト', 'サイレンススズカ',
    'オグリキャップ', 'シンボリルドルフ', 'メジロマックイーン', 'ナリタブライアン',
    'セイウンスカイ', 'エアグルーヴ', 'タイキシャトル', 'スペシャルウィーク',
    'グラスワンダー', 'エルコンドルパサー', 'アドマイヤベガ', 'マヤノトップガン',
    'ヒシアマゾン', 'エアジハード', 'トウカイニセイ', 'マチカネフクキタル'
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    number: index + 1,
    name: horseNames[index] || `仮想馬${index + 1}`,
    odds: Math.random() * 20 + 1, // 1〜21倍のランダムオッズ
    placeRate: Math.random() * 0.3 + 0.1 // 10%〜40%のランダム複勝率
  }));
};

// AIロボットの型定義
interface AIRobot {
  id: string;
  name: string;
  createdAt: string;
  rootIndex: number;
  tendencyParams: string[];
  raceParams: string[];
  learningThought: string;
}

// 計算結果の型定義
interface CalculationResult {
  horseId: number;
  horseNumber: number;
  horseName: string;
  finalIndex: number;
  abilityIndex: number;
  tendencyIndex: number;
  raceTendencyIndex: number;
  learningThoughtIndex: number;
}

const RacePredict: React.FC = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate();
  
  const [selectedRace, setSelectedRace] = useState<RaceListItem | null>(null);
  const [horses, setHorses] = useState<any[]>([]);
  const [robots, setRobots] = useState<AIRobot[]>([]);
  const [selectedRobot, setSelectedRobot] = useState<AIRobot | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CalculationResult[]>([]);

  // レースデータと馬データの初期化
  useEffect(() => {
    if (raceId) {
      const race = dummyRaceList.find(r => r.id === raceId);
      if (race) {
        setSelectedRace(race);
        setHorses(generateHorses(race.horses));
      } else {
        toast.error('レースが見つかりませんでした');
        navigate('/race-list');
      }
    }
  }, [raceId, navigate]);

  // AIロボットの読み込み
  useEffect(() => {
    const savedRobots = localStorage.getItem('aiRobots');
    if (savedRobots) {
      try {
        const parsedRobots = JSON.parse(savedRobots);
        setRobots(parsedRobots);
      } catch (error) {
        console.error('AIロボットの読み込みに失敗しました:', error);
      }
    }
  }, []);

  // 最終的能力指数の計算
  const calculateFinalIndex = (horse: any, robot: AIRobot): CalculationResult => {
    // 各構成要素の計算
    const abilityIndex = Math.min(50, (1 / horse.odds) * 100); // 能力指数（オッズベース）
    const tendencyIndex = Math.min(50, horse.placeRate * 100); // 傾向指数（複勝率ベース）
    const raceTendencyIndex = Math.min(50, Math.random() * 50 + 25); // レース傾向指数（ランダム）
    const learningThoughtIndex = Math.min(50, Math.random() * 50 + 25); // 学習的思考指数（ランダム）

    // 最終指数の計算
    const rootIndex = robot.rootIndex;
    const finalIndex = (rootIndex / 200) * abilityIndex + 
                      ((200 - rootIndex) / 200) * (tendencyIndex + raceTendencyIndex + learningThoughtIndex);

    return {
      horseId: horse.id,
      horseNumber: horse.number,
      horseName: horse.name,
      finalIndex: Math.round(finalIndex * 100) / 100,
      abilityIndex: Math.round(abilityIndex * 100) / 100,
      tendencyIndex: Math.round(tendencyIndex * 100) / 100,
      raceTendencyIndex: Math.round(raceTendencyIndex * 100) / 100,
      learningThoughtIndex: Math.round(learningThoughtIndex * 100) / 100
    };
  };

  // 指数計算実行
  const handleCalculate = async () => {
    if (!selectedRobot) {
      toast.error('AIロボットを選択してください');
      return;
    }

    setIsCalculating(true);
    
    // 計算のシミュレーション
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newResults = horses.map(horse => calculateFinalIndex(horse, selectedRobot));
    const sortedResults = newResults.sort((a, b) => b.finalIndex - a.finalIndex);
    
    setResults(sortedResults);
    setIsCalculating(false);
    toast.success('指数が算出されました！');
  };

  if (!selectedRace) {
    return (
      <div className="min-h-screen bg-background font-sans flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/race-list')}
              className="btn-secondary"
            >
              ← レース一覧に戻る
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-text bg-gradient-to-r from-primary-600 to-accent-orange bg-clip-text text-transparent">
              AI指数計算
            </h1>
            <div className="w-20"></div> {/* スペーサー */}
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-orange mx-auto rounded-full"></div>
        </motion.div>

        {/* レース情報 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card">
            <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
              <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">🏇</span>
              レース情報
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="text-gray-500 text-sm">レース名:</span>
                <p className="font-semibold text-text">{selectedRace.name}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">開催日:</span>
                <p className="font-semibold text-text">{selectedRace.date}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">距離:</span>
                <p className="font-semibold text-text">{selectedRace.distance}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">頭数:</span>
                <p className="font-semibold text-text">{selectedRace.horses}頭</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AIロボット選択 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="card">
            <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
              <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">🤖</span>
              AIロボット選択
            </h3>
            
            {robots.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">🤖</div>
                <p className="text-gray-600 mb-4">AIロボットが作成されていません</p>
                <button
                  onClick={() => navigate('/create-robot')}
                  className="btn-primary"
                >
                  AIロボットを作成
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {robots.map((robot) => (
                  <div
                    key={robot.id}
                    className={`card cursor-pointer transition-all duration-300 ${
                      selectedRobot?.id === robot.id 
                        ? 'ring-2 ring-primary-500 bg-primary-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedRobot(robot)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-text">{robot.name}</h4>
                      {selectedRobot?.id === robot.id && (
                        <span className="text-primary-600 text-sm">✓ 選択中</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      作成日: {new Date(robot.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      根幹指数: {robot.rootIndex}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* 計算ボタン */}
        {selectedRobot && (
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className={`btn-primary text-lg px-12 py-4 ${
                isCalculating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isCalculating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  指数計算中...
                </div>
              ) : (
                '指数を計算する'
              )}
            </button>
          </motion.div>
        )}

        {/* 計算結果 */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="card">
                <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
                  <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">📊</span>
                  計算結果
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">順位</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">馬番</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">馬名</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">最終指数</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">能力指数</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">傾向指数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <motion.tr
                          key={result.horseId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <span className={`inline-block w-8 h-8 rounded-full text-center text-sm font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-50 text-gray-600'
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-text">{result.horseNumber}</td>
                          <td className="py-3 px-4 font-semibold text-text">{result.horseName}</td>
                          <td className="py-3 px-4">
                            <span className="text-2xl font-bold text-primary-600">
                              {result.finalIndex}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{result.abilityIndex}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{result.tendencyIndex}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RacePredict; 