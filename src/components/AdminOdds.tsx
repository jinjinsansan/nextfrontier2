import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
  getRaces, 
  getRaceHorses, 
  saveRaceOdds, 
  getSavedRaceOdds,
  checkAdminAuth,
  SavedRaceOdds 
} from '../lib/supabase';
import { 
  HorseOdds, 
  calculateAllAbilityIndices, 
  validateOdds,
  calculateAverageOdds,
  calculateOddsVariance 
} from '../utils/oddsCalculator';

const AdminOdds: React.FC = () => {
  const navigate = useNavigate();
  const [races, setRaces] = useState<Array<{ id: number; name: string; date: string }>>([]);
  const [selectedRaceId, setSelectedRaceId] = useState<number | null>(null);
  const [selectedRaceName, setSelectedRaceName] = useState<string>('');
  const [horses, setHorses] = useState<HorseOdds[]>([]);
  const [isLoadingHorses, setIsLoadingHorses] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedOdds, setSavedOdds] = useState<SavedRaceOdds[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // 管理者認証チェック
  useEffect(() => {
    if (!checkAdminAuth()) {
      toast.error('管理者権限が必要です');
      // 実際のアプリではリダイレクト処理を追加
    }
  }, []);

  // レース一覧取得
  useEffect(() => {
    loadRaces();
    loadSavedOdds();
  }, []);

  // 出走馬情報取得
  useEffect(() => {
    if (selectedRaceId) {
      loadRaceHorses(selectedRaceId);
    }
  }, [selectedRaceId, races]);

  const loadRaces = async () => {
    try {
      const racesData = await getRaces();
      setRaces(racesData);
    } catch (error) {
      toast.error('レース情報の取得に失敗しました');
    }
  };

  const loadRaceHorses = async (raceId: number) => {
    setIsLoadingHorses(true);
    try {
      const horsesData = await getRaceHorses(raceId);
      const raceName = races.find(r => r.id === raceId)?.name || '';
      setSelectedRaceName(raceName);
      
      // 初期オッズを0に設定
      const initialHorses: HorseOdds[] = horsesData.map(horse => ({
        horseId: horse.id,
        horseNumber: horse.number,
        horseName: horse.name,
        odds: 0
      }));
      
      setHorses(initialHorses);
    } catch (error) {
      toast.error('出走馬情報の取得に失敗しました');
    } finally {
      setIsLoadingHorses(false);
    }
  };

  const loadSavedOdds = async () => {
    setIsLoadingSaved(true);
    try {
      const savedData = await getSavedRaceOdds();
      setSavedOdds(savedData);
    } catch (error) {
      toast.error('保存済みオッズの取得に失敗しました');
    } finally {
      setIsLoadingSaved(false);
    }
  };

  // オッズ入力処理
  const handleOddsChange = (horseId: number, odds: number) => {
    const updatedHorses = horses.map(horse =>
      horse.horseId === horseId ? { ...horse, odds } : horse
    );
    
    // 能力指数を再計算
    const horsesWithIndices = calculateAllAbilityIndices(updatedHorses);
    setHorses(horsesWithIndices);
  };

  // 保存処理
  const handleSave = async () => {
    if (!selectedRaceId || !selectedRaceName) {
      toast.error('レースを選択してください');
      return;
    }

    const horsesWithOdds = horses.filter(h => h.odds > 0);
    if (horsesWithOdds.length === 0) {
      toast.error('オッズを入力してください');
      return;
    }

    // オッズの妥当性チェック
    const invalidOdds = horsesWithOdds.filter(h => !validateOdds(h.odds));
    if (invalidOdds.length > 0) {
      toast.error('オッズは1.0〜1000.0の範囲で入力してください');
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveRaceOdds({
        raceId: selectedRaceId,
        raceName: selectedRaceName,
        horses: horsesWithOdds.map(h => ({
          horseId: h.horseId,
          horseNumber: h.horseNumber,
          horseName: h.horseName,
          odds: h.odds,
          abilityIndex: h.abilityIndex || 0
        }))
      });

      if (result.success) {
        toast.success(result.message);
        // 保存済み一覧を再読み込み
        await loadSavedOdds();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('保存に失敗しました');
      console.error('保存エラー:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 保存済みデータを編集用に読み込み
  const loadSavedDataForEdit = (savedData: SavedRaceOdds) => {
    setSelectedRaceId(savedData.raceId);
    setSelectedRaceName(savedData.raceName);
    
    // 保存済みのオッズで出走馬リストを更新
    const updatedHorses = horses.map(horse => {
      const savedHorse = savedData.horses.find(h => h.horseId === horse.horseId);
      return savedHorse ? {
        ...horse,
        odds: savedHorse.odds,
        abilityIndex: savedHorse.abilityIndex
      } : horse;
    });
    
    setHorses(updatedHorses);
  };

  // 統計情報計算
  const averageOdds = calculateAverageOdds(horses);
  const oddsVariance = calculateOddsVariance(horses);
  const horsesWithOdds = horses.filter(h => h.odds > 0).length;

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
          duration: 4000,
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
          <div className="flex justify-center mb-4">
            <button
              onClick={() => navigate('/admin')}
              className="btn-secondary text-sm px-4 py-2 flex items-center"
            >
              <span className="mr-2">←</span>
              ダッシュボードに戻る
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 bg-gradient-to-r from-primary-600 to-accent-orange bg-clip-text text-transparent">
            想定オッズ入力
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            管理者用想定オッズ管理ツール
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-orange mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <motion.div 
          className="max-w-7xl mx-auto space-y-8"
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
                value={selectedRaceId || ''}
                onChange={(e) => setSelectedRaceId(parseInt(e.target.value) || null)}
                className="select-field"
              >
                <option value="">レースを選択してください</option>
                {races.map(race => (
                  <option key={race.id} value={race.id}>
                    {race.name} ({race.date})
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* 出走馬リスト */}
          <AnimatePresence>
            {selectedRaceId && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <div className="card">
                  <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
                    <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    出走馬リスト - {selectedRaceName}
                  </h3>
                  
                  {isLoadingHorses ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="text-gray-600 mt-2">出走馬情報を読み込み中...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                          <tr className="bg-primary-50">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                              馬番
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                              馬名
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                              想定オッズ
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                              能力指数
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {horses.map((horse, index) => (
                            <tr key={horse.horseId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                                {horse.horseNumber}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {horse.horseName}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="1000"
                                  value={horse.odds || ''}
                                  onChange={(e) => handleOddsChange(horse.horseId, parseFloat(e.target.value) || 0)}
                                  className="input-field w-24 text-center"
                                  placeholder="0.0"
                                />
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold text-primary-600">
                                {horse.abilityIndex ? `${horse.abilityIndex.toFixed(2)}` : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 統計情報 */}
                  {horses.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-primary-700 mb-1">入力済み馬数</p>
                        <p className="text-2xl font-bold text-primary-600">{horsesWithOdds}頭</p>
                      </div>
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-primary-700 mb-1">平均オッズ</p>
                        <p className="text-2xl font-bold text-primary-600">{averageOdds.toFixed(2)}</p>
                      </div>
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-primary-700 mb-1">オッズ分散</p>
                        <p className="text-2xl font-bold text-primary-600">{oddsVariance.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 保存ボタン */}
          <AnimatePresence>
            {selectedRaceId && horses.length > 0 && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <div className="card">
                  <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                    保存処理
                  </h3>
                  <button
                    onClick={handleSave}
                    disabled={isSaving || horsesWithOdds === 0}
                    className={`btn-primary text-lg px-8 py-4 w-full ${
                      isSaving || horsesWithOdds === 0
                        ? 'opacity-50 cursor-not-allowed transform-none' 
                        : ''
                    }`}
                  >
                    {isSaving ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        保存中...
                      </div>
                    ) : (
                      '想定オッズを保存'
                    )}
                  </button>
                  {horsesWithOdds === 0 && (
                    <p className="text-red-600 text-sm mt-3 font-medium text-center">
                      オッズを入力してください
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 保存済み一覧 */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text flex items-center">
                  <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                  保存済み想定オッズ一覧
                </h3>
                <button
                  onClick={loadSavedOdds}
                  disabled={isLoadingSaved}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  {isLoadingSaved ? '更新中...' : '更新'}
                </button>
              </div>
              
              {isLoadingSaved ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">保存済みデータを読み込み中...</p>
                </div>
              ) : savedOdds.length > 0 ? (
                <div className="space-y-4">
                  {savedOdds.slice(0, 10).map((savedData) => (
                    <div key={savedData.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-text">{savedData.raceName}</h4>
                          <p className="text-sm text-gray-600">
                            保存日時: {new Date(savedData.updatedAt).toLocaleString('ja-JP')}
                          </p>
                        </div>
                        <button
                          onClick={() => loadSavedDataForEdit(savedData)}
                          className="btn-secondary text-sm px-4 py-2"
                        >
                          編集
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {savedData.horses.slice(0, 6).map((horse) => (
                          <div key={horse.horseId} className="text-sm">
                            <span className="font-medium">{horse.horseNumber}.</span>
                            <span className="ml-1">{horse.horseName}</span>
                            <span className="ml-2 text-primary-600">({horse.odds})</span>
                          </div>
                        ))}
                        {savedData.horses.length > 6 && (
                          <div className="text-sm text-gray-500">
                            他{savedData.horses.length - 6}頭...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl">📊</span>
                  <p className="text-gray-600 mt-2">保存済みの想定オッズがありません</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminOdds; 