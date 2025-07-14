import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Trophy, 
  Clock, 
  DollarSign,
  ArrowLeft,
  Save,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Race {
  id: string;
  date: string;
  venue: string;
  raceNumber: number;
  distance: number;
  condition: string;
  horseCount: number;
}

interface HorseResult {
  horseNumber: number;
  horseName: string;
  finishOrder: number;
  time: string;
  payout: number;
}

interface RaceResult {
  id: string;
  raceId: string;
  results: HorseResult[];
  createdAt: string;
}

const AdminResults: React.FC = () => {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [horseResults, setHorseResults] = useState<HorseResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedResults, setSavedResults] = useState<RaceResult[]>([]);

  // モックレースデータ
  const mockRaces: Race[] = [
    {
      id: '1',
      date: '2024-01-15',
      venue: '東京競馬場',
      raceNumber: 1,
      distance: 1600,
      condition: '芝・右・良',
      horseCount: 16
    },
    {
      id: '2',
      date: '2024-01-15',
      venue: '東京競馬場',
      raceNumber: 2,
      distance: 2000,
      condition: '芝・右・稍重',
      horseCount: 14
    },
    {
      id: '3',
      date: '2024-01-15',
      venue: '東京競馬場',
      raceNumber: 3,
      distance: 1200,
      condition: 'ダート・左・良',
      horseCount: 12
    }
  ];

  // モック出走馬データ
  const mockHorses = [
    { number: 1, name: 'サクラエンペラー' },
    { number: 2, name: 'トウカイテイオー' },
    { number: 3, name: 'ディープインパクト' },
    { number: 4, name: 'オグリキャップ' },
    { number: 5, name: 'シンボリルドルフ' },
    { number: 6, name: 'メジロマックイーン' },
    { number: 7, name: 'ナリタブライアン' },
    { number: 8, name: 'サイレンススズカ' },
    { number: 9, name: 'エルコンドルパサー' },
    { number: 10, name: 'スペシャルウィーク' },
    { number: 11, name: 'グラスワンダー' },
    { number: 12, name: 'エアグルーヴ' },
    { number: 13, name: 'タイキシャトル' },
    { number: 14, name: 'アドマイヤベガ' },
    { number: 15, name: 'マヤノトップガン' },
    { number: 16, name: 'ヒシアマゾン' }
  ];

  // レース選択時の処理
  const handleRaceSelect = (raceId: string) => {
    const race = mockRaces.find(r => r.id === raceId);
    if (race) {
      setSelectedRace(race);
      // 出走馬の初期データを作成
      const initialResults = mockHorses.slice(0, race.horseCount).map(horse => ({
        horseNumber: horse.number,
        horseName: horse.name,
        finishOrder: 0,
        time: '',
        payout: 0
      }));
      setHorseResults(initialResults);
    }
  };

  // 結果更新処理
  const handleResultUpdate = (index: number, field: keyof HorseResult, value: string | number) => {
    const updatedResults = [...horseResults];
    updatedResults[index] = {
      ...updatedResults[index],
      [field]: value
    };
    setHorseResults(updatedResults);
  };

  // 保存処理
  const handleSave = async () => {
    if (!selectedRace) {
      toast.error('レースを選択してください');
      return;
    }

    // 着順の重複チェック
    const finishOrders = horseResults.map(r => r.finishOrder).filter(o => o > 0);
    const uniqueOrders = new Set(finishOrders);
    if (finishOrders.length !== uniqueOrders.size) {
      toast.error('着順に重複があります');
      return;
    }

    setIsLoading(true);
    
    try {
      // モック保存処理
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newResult: RaceResult = {
        id: Date.now().toString(),
        raceId: selectedRace.id,
        results: horseResults,
        createdAt: new Date().toISOString()
      };
      
      setSavedResults(prev => [newResult, ...prev]);
      toast.success('レース結果を保存しました');
      
      // フォームをリセット
      setSelectedRace(null);
      setHorseResults([]);
    } catch (error) {
      toast.error('保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 保存済み結果の削除
  const handleDeleteResult = (resultId: string) => {
    setSavedResults(prev => prev.filter(r => r.id !== resultId));
    toast.success('結果を削除しました');
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
            <h1 className="text-3xl font-bold text-gray-800">レース結果登録</h1>
          </div>
          <p className="text-gray-600 text-lg">出走馬の着順・タイム・配当を記録します</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左カラム: レース選択と保存済み結果 */}
          <div className="lg:col-span-1 space-y-6">
            {/* レース選択 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                レース選択
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    レースを選択
                  </label>
                  <select
                    value={selectedRace?.id || ''}
                    onChange={(e) => handleRaceSelect(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">レースを選択してください</option>
                    {mockRaces.map(race => (
                      <option key={race.id} value={race.id}>
                        {race.date} {race.venue} R{race.raceNumber} {race.distance}m
                      </option>
                    ))}
                  </select>
                </div>

                {selectedRace && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-blue-50 rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">選択レース情報</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>{selectedRace.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span>{selectedRace.venue} R{selectedRace.raceNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span>{selectedRace.distance}m {selectedRace.condition}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span>出走頭数: {selectedRace.horseCount}頭</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* 保存済み結果 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                保存済み結果
              </h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {savedResults.length === 0 ? (
                  <p className="text-gray-500 text-sm">保存済みの結果はありません</p>
                ) : (
                  savedResults.map(result => {
                    const race = mockRaces.find(r => r.id === result.raceId);
                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gray-50 rounded-xl p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm">
                            <p className="font-semibold text-gray-800">
                              {race?.date} {race?.venue} R{race?.raceNumber}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {new Date(result.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteResult(result.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            削除
                          </button>
                        </div>
                        <div className="text-xs text-gray-600">
                          1着: {result.results.find(r => r.finishOrder === 1)?.horseName || '-'}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>

          {/* 右カラム: 出走馬結果入力 */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                出走馬結果入力
              </h2>

              {!selectedRace ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">左側でレースを選択してください</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* テーブルヘッダー */}
                  <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-xl font-semibold text-sm text-gray-700">
                    <div className="col-span-1">馬番</div>
                    <div className="col-span-3">馬名</div>
                    <div className="col-span-2">着順</div>
                    <div className="col-span-2">タイム</div>
                    <div className="col-span-2">配当</div>
                    <div className="col-span-2">操作</div>
                  </div>

                  {/* 出走馬リスト */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {horseResults.map((horse, index) => (
                      <motion.div
                        key={horse.horseNumber}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="grid grid-cols-12 gap-4 p-3 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200"
                      >
                        <div className="col-span-1 flex items-center">
                          <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {horse.horseNumber}
                          </span>
                        </div>
                        
                        <div className="col-span-3 flex items-center">
                          <span className="font-medium text-gray-800">{horse.horseName}</span>
                        </div>
                        
                        <div className="col-span-2">
                          <select
                            value={horse.finishOrder}
                            onChange={(e) => handleResultUpdate(index, 'finishOrder', parseInt(e.target.value) || 0)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value={0}>-</option>
                            {Array.from({ length: selectedRace.horseCount }, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="1:34.5"
                            value={horse.time}
                            onChange={(e) => handleResultUpdate(index, 'time', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div className="col-span-2">
                          <input
                            type="number"
                            placeholder="0"
                            value={horse.payout || ''}
                            onChange={(e) => handleResultUpdate(index, 'payout', parseInt(e.target.value) || 0)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div className="col-span-2 flex items-center">
                          {horse.finishOrder > 0 && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              入力済み
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* 保存ボタン */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-6 border-t border-gray-200"
                  >
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          保存中...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          レース結果を保存
                        </>
                      )}
                    </button>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResults; 