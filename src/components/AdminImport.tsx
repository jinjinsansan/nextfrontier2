import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { 
  importCSVData, 
  getUploadHistory, 
  checkAdminAuth,
  DATA_TYPES,
  DataType,
  UploadHistory,
  ImportResult 
} from '../lib/supabase';

const AdminImport: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string>('');
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [dataType, setDataType] = useState<DataType>('RACE_INFO');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 管理者認証チェック
  useEffect(() => {
    if (!checkAdminAuth()) {
      toast.error('管理者権限が必要です');
      // 実際のアプリではリダイレクト処理を追加
    }
  }, []);

  // アップロード履歴取得
  useEffect(() => {
    loadUploadHistory();
  }, []);

  const loadUploadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const history = await getUploadHistory();
      setUploadHistory(history);
    } catch (error) {
      toast.error('履歴の取得に失敗しました');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // ファイル選択処理
  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('CSVファイルのみアップロード可能です');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvData(content);
      
      // プレビューデータ生成（1〜3行）
      try {
        const results = Papa.parse(content);
        const preview = results.data.slice(0, 3) as string[][];
        setPreviewData(preview);
      } catch (error) {
        toast.error('CSVファイルの読み込みに失敗しました');
        console.error('CSV解析エラー:', error);
      }
    };
    reader.readAsText(file);
  };

  // ドラッグ&ドロップ処理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // ファイル選択ボタンクリック
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  // ファイル入力変更
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // アップロード実行
  const handleUpload = async () => {
    if (!selectedFile || !csvData) {
      toast.error('ファイルを選択してください');
      return;
    }

    setIsUploading(true);
    try {
      const result: ImportResult = await importCSVData(csvData, dataType, selectedFile.name);
      
      if (result.success) {
        toast.success(result.message);
        // ファイルとデータをリセット
        setSelectedFile(null);
        setCsvData('');
        setPreviewData([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // 履歴を再読み込み
        await loadUploadHistory();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('アップロードに失敗しました');
      console.error('アップロードエラー:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // ステータス表示用のコンポーネント
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusStyle = () => {
      switch (status) {
        case 'success':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'error':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'processing':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const getStatusText = () => {
      switch (status) {
        case 'success':
          return '成功';
        case 'error':
          return 'エラー';
        case 'processing':
          return '処理中';
        default:
          return '不明';
      }
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle()}`}>
        {getStatusText()}
      </span>
    );
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
            CSVデータインポート
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            管理者用データインポートツール
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-orange mx-auto mt-4 rounded-full"></div>
        </motion.div>

        <motion.div 
          className="max-w-6xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ファイルアップロード */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                ファイルアップロード
              </h3>
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-gray-300 hover:border-primary-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl">📄</span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-text">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setCsvData('');
                        setPreviewData([]);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      ファイルを変更
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl">📁</span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-text mb-2">
                        ファイルをドラッグ&ドロップ
                      </p>
                      <p className="text-gray-600 mb-4">または</p>
                      <button
                        onClick={handleFileButtonClick}
                        className="btn-primary px-6 py-3"
                      >
                        ファイルを選択
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      CSVファイルのみ対応
                    </p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </motion.div>

          {/* CSVプレビュー */}
          <AnimatePresence>
            {previewData.length > 0 && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <div className="card">
                  <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                    <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    CSVプレビュー（1〜3行目）
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <tbody>
                        {previewData.map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex === 0 ? 'bg-primary-50' : ''}>
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className={`px-4 py-2 border-b border-gray-200 text-sm ${
                                  rowIndex === 0 ? 'font-semibold text-primary-700' : 'text-gray-700'
                                }`}
                              >
                                {cell || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ※ 1行目はヘッダー行として表示
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* データ種別選択 */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                データ種別選択
              </h3>
              <select
                value={dataType}
                onChange={(e) => setDataType(e.target.value as DataType)}
                className="select-field"
              >
                {Object.entries(DATA_TYPES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* アップロード実行 */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <h3 className="text-xl font-semibold text-text mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                アップロード実行
              </h3>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className={`btn-primary text-lg px-8 py-4 w-full ${
                  !selectedFile || isUploading 
                    ? 'opacity-50 cursor-not-allowed transform-none' 
                    : ''
                }`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    アップロード中...
                  </div>
                ) : (
                  'CSVデータをアップロード'
                )}
              </button>
              {!selectedFile && (
                <p className="text-red-600 text-sm mt-3 font-medium text-center">
                  ファイルを選択してください
                </p>
              )}
            </div>
          </motion.div>

          {/* アップロード履歴 */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-text flex items-center">
                  <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                  アップロード履歴
                </h3>
                <button
                  onClick={loadUploadHistory}
                  disabled={isLoadingHistory}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  {isLoadingHistory ? '更新中...' : '更新'}
                </button>
              </div>
              
              {isLoadingHistory ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">履歴を読み込み中...</p>
                </div>
              ) : uploadHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-primary-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                          日時
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                          データ種別
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                          件数
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                          ステータス
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadHistory.slice(0, 10).map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {new Date(item.created_at).toLocaleString('ja-JP')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.data_type}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {item.record_count.toLocaleString()}件
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={item.status} />
                            {item.error_message && (
                              <p className="text-xs text-red-600 mt-1">
                                {item.error_message}
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl">📊</span>
                  <p className="text-gray-600 mt-2">アップロード履歴がありません</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminImport; 