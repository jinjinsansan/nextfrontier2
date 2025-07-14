import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { 
  LearningIndex, 
  ThinkingType, 
  THINKING_TYPE_LABELS,
  saveLearningIndex,
  getSavedLearningIndexes,
  updateLearningIndex,
  deleteLearningIndex,
  checkAdminAuth
} from '../lib/supabase';

const AdminLearningIndex: React.FC = () => {
  const navigate = useNavigate();
  const [thinkingType, setThinkingType] = useState<ThinkingType>('jockey');
  const [name, setName] = useState('');
  const [score, setScore] = useState<number>(0);
  const [placeRate, setPlaceRate] = useState<number>(0);
  const [savedIndexes, setSavedIndexes] = useState<LearningIndex[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [showCsvPreview, setShowCsvPreview] = useState(false);

  // 管理者認証チェック
  useEffect(() => {
    if (!checkAdminAuth()) {
      toast.error('管理者権限が必要です');
      // 実際のアプリではリダイレクト処理
    }
  }, []);

  // 保存済みデータ読み込み
  useEffect(() => {
    loadSavedIndexes();
  }, []);

  const loadSavedIndexes = async () => {
    try {
      const data = await getSavedLearningIndexes();
      setSavedIndexes(data);
    } catch (error) {
      toast.error('データの読み込みに失敗しました');
    }
  };

  // 複勝率からスコア自動換算
  const calculateScoreFromPlaceRate = (placeRate: number): number => {
    return Math.min(10, Math.max(0, placeRate * 10));
  };

  // スコア入力時の自動計算（調教師の場合）
  useEffect(() => {
    if (thinkingType === 'trainer' && placeRate > 0) {
      setScore(calculateScoreFromPlaceRate(placeRate));
    }
  }, [placeRate, thinkingType]);

  // 保存処理
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('名前を入力してください');
      return;
    }

    if (score < 0 || score > 10) {
      toast.error('スコアは0〜10の範囲で入力してください');
      return;
    }

    setIsLoading(true);

    try {
      const result = await saveLearningIndex({
        thinkingType,
        name: name.trim(),
        score
      });

      if (result.success) {
        toast.success(result.message);
        // フォームリセット
        setName('');
        setScore(0);
        setPlaceRate(0);
        // データ再読み込み
        await loadSavedIndexes();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 編集開始
  const handleEdit = (index: LearningIndex) => {
    setEditingId(index.id);
    setThinkingType(index.thinkingType);
    setName(index.name);
    setScore(index.score);
    if (index.thinkingType === 'trainer') {
      setPlaceRate(index.score / 10);
    }
  };

  // 編集キャンセル
  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setScore(0);
    setPlaceRate(0);
  };

  // 更新処理
  const handleUpdate = async () => {
    if (!editingId) return;

    if (!name.trim()) {
      toast.error('名前を入力してください');
      return;
    }

    if (score < 0 || score > 10) {
      toast.error('スコアは0〜10の範囲で入力してください');
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateLearningIndex(editingId, {
        thinkingType,
        name: name.trim(),
        score
      });

      if (result.success) {
        toast.success(result.message);
        handleCancelEdit();
        await loadSavedIndexes();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 削除処理
  const handleDelete = async (id: string) => {
    if (!window.confirm('この指数を削除しますか？')) return;

    setIsLoading(true);

    try {
      const result = await deleteLearningIndex(id);

      if (result.success) {
        toast.success(result.message);
        await loadSavedIndexes();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('削除に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // CSVファイル処理
  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      parseCsvFile(file);
    } else {
      toast.error('CSVファイルを選択してください');
    }
  };

  const parseCsvFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvPreview(results.data.slice(0, 3)); // 最初の3行をプレビュー
        setShowCsvPreview(true);
      },
      error: (error) => {
        toast.error('CSVファイルの解析に失敗しました');
      }
    });
  };

  const handleCsvImport = async () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        setIsLoading(true);
        let successCount = 0;
        let errorCount = 0;

        for (const row of results.data as any[]) {
          try {
            const name = row.name || row.名前 || row.Name;
            const score = parseFloat(row.score || row.スコア || row.Score || '0');
            
            if (name && !isNaN(score) && score >= 0 && score <= 10) {
              const result = await saveLearningIndex({
                thinkingType,
                name: name.trim(),
                score
              });
              
              if (result.success) {
                successCount++;
              } else {
                errorCount++;
              }
            } else {
              errorCount++;
            }
          } catch (error) {
            errorCount++;
          }
        }

        setIsLoading(false);
        
        if (successCount > 0) {
          toast.success(`${successCount}件のデータをインポートしました`);
          await loadSavedIndexes();
        }
        
        if (errorCount > 0) {
          toast.error(`${errorCount}件のデータでエラーが発生しました`);
        }

        // CSV関連の状態をリセット
        setCsvFile(null);
        setCsvPreview([]);
        setShowCsvPreview(false);
      }
    });
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
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4 bg-gradient-to-r from-primary-600 to-accent-orange bg-clip-text text-transparent">
            学習的思考指数入力（管理者用）
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            騎手・調教師・予想家の心理思考指数を管理
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-orange mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <motion.div 
          className="max-w-6xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* モード選択 */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                思考タイプ選択
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(THINKING_TYPE_LABELS).map(([key, label]) => (
                  <label key={key} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                    <input
                      type="radio"
                      name="thinkingType"
                      value={key}
                      checked={thinkingType === key}
                      onChange={(e) => setThinkingType(e.target.value as ThinkingType)}
                      className="mr-3 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="font-medium text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 入力エリア */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                指数入力
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {thinkingType === 'jockey' ? '騎手名' : 
                     thinkingType === 'trainer' ? '調教師名' : '予想家名'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder={`${THINKING_TYPE_LABELS[thinkingType as keyof typeof THINKING_TYPE_LABELS]}の名前を入力`}
                  />
                </div>
                
                {thinkingType === 'trainer' ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      複勝率（過去1年）
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={placeRate}
                        onChange={(e) => setPlaceRate(parseFloat(e.target.value) || 0)}
                        className="input-field flex-1"
                        placeholder="0.00〜1.00"
                      />
                      <span className="text-sm text-gray-500">→</span>
                      <div className="bg-primary-50 px-3 py-2 rounded-lg">
                        <span className="text-sm font-medium text-primary-700">
                          スコア: {score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      スコア（0〜10）
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={score}
                      onChange={(e) => setScore(parseFloat(e.target.value) || 0)}
                      className="input-field"
                      placeholder="0.0〜10.0"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={editingId ? handleUpdate : handleSave}
                  disabled={isLoading || !name.trim()}
                  className={`btn-primary px-8 py-3 ${
                    isLoading || !name.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      処理中...
                    </div>
                  ) : editingId ? (
                    '更新'
                  ) : (
                    '保存'
                  )}
                </button>
                {editingId && (
                  <button
                    onClick={handleCancelEdit}
                    className="btn-secondary ml-4 px-8 py-3"
                  >
                    キャンセル
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* CSVインポート */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                CSVインポート（任意）
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CSVファイル選択
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileChange}
                    className="file-input"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    形式: 名前,スコア（例: 武豊,8.5）
                  </p>
                </div>
                
                {showCsvPreview && csvPreview.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">プレビュー（最初の3行）</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            {Object.keys(csvPreview[0]).map((key) => (
                              <th key={key} className="text-left py-2 px-3 font-medium text-gray-700">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.map((row, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              {Object.values(row).map((value: any, colIndex) => (
                                <td key={colIndex} className="py-2 px-3 text-gray-600">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      onClick={handleCsvImport}
                      disabled={isLoading}
                      className="btn-primary mt-4 px-6 py-2"
                    >
                      {isLoading ? 'インポート中...' : 'インポート実行'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* 保存済み一覧 */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                保存済み学習的思考指数
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">思考タイプ</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">名前</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">スコア</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">更新日</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedIndexes.map((index) => (
                      <tr key={index.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-700">
                          {THINKING_TYPE_LABELS[index.thinkingType as keyof typeof THINKING_TYPE_LABELS]}
                        </td>
                        <td className="py-3 px-4 text-gray-700 font-medium">
                          {index.name}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {index.score.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {new Date(index.updatedAt).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(index)}
                              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                            >
                              編集
                            </button>
                            <button
                              onClick={() => handleDelete(index.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              削除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {savedIndexes.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    保存済みのデータがありません
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLearningIndex; 