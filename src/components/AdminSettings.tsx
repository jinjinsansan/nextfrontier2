import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Settings, 
  Database,
  Palette,
  Sun,
  Moon,
  Monitor,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

// システム設定の型定義
interface SystemSettings {
  siteName: string;
  maintenanceMode: boolean;
  betaFeatures: boolean;
  defaultIndexCorrection: number;
  colorTheme: 'light' | 'dark' | 'system';
  lastCsvSync: string;
}

// デフォルト設定
const defaultSettings: SystemSettings = {
  siteName: 'ネクストフロンティア',
  maintenanceMode: false,
  betaFeatures: true,
  defaultIndexCorrection: 50,
  colorTheme: 'system',
  lastCsvSync: '2024-12-20T10:30:00Z'
};

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [originalSettings, setOriginalSettings] = useState<SystemSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // 設定変更の検出
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, originalSettings]);

  // 設定の読み込み（実際のアプリではSupabaseから取得）
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      // モック：実際のアプリではSupabaseから設定を取得
      await new Promise(resolve => setTimeout(resolve, 500));
      setSettings(defaultSettings);
      setOriginalSettings(defaultSettings);
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  // 設定の保存
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 実際のアプリではSupabaseに保存
      console.log('設定を保存:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOriginalSettings(settings);
      setHasChanges(false);
      toast.success('設定を保存しました');
    } catch (error) {
      toast.error('設定の保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  // 設定のリセット
  const handleReset = () => {
    setSettings(defaultSettings);
    toast.success('設定をデフォルトに戻しました');
  };

  // CSV同期
  const handleCsvSync = async () => {
    try {
      // 実際のアプリではCSV同期処理を実行
      console.log('CSV同期を実行');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newLastSync = new Date().toISOString();
      setSettings(prev => ({ ...prev, lastCsvSync: newLastSync }));
      toast.success('CSV同期が完了しました');
    } catch (error) {
      toast.error('CSV同期に失敗しました');
    }
  };

  // 設定値の更新
  const updateSetting = <K extends keyof SystemSettings>(
    key: K, 
    value: SystemSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">設定を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
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
                システム設定
              </h1>
              <p className="text-gray-600 font-medium">
                アプリケーションの設定とメンテナンス
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="max-w-6xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* アプリ全体設定 */}
          <motion.div variants={itemVariants}>
            <motion.div 
              className="card"
              variants={cardVariants}
              whileHover="hover"
            >
              <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  <Settings className="w-4 h-4" />
                </span>
                アプリ全体設定
              </h3>
              
              <div className="space-y-6">
                {/* サイト名 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    サイト名
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                    className="input-field"
                    placeholder="サイト名を入力"
                  />
                </div>

                {/* メンテナンスモード */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-orange-600 mr-3" />
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        メンテナンスモード
                      </label>
                      <p className="text-xs text-gray-500">
                        メンテナンス中は一般ユーザーのアクセスを制限
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('maintenanceMode', !settings.maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.maintenanceMode ? 'bg-orange-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* β機能 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-600 mr-3" />
                    <div>
                      <label className="text-sm font-semibold text-gray-700">
                        β機能の有効化
                      </label>
                      <p className="text-xs text-gray-500">
                        実験的な機能を有効にする
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('betaFeatures', !settings.betaFeatures)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.betaFeatures ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.betaFeatures ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* デフォルト指数補正値 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    デフォルト指数補正値: {settings.defaultIndexCorrection}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.defaultIndexCorrection}
                      onChange={(e) => updateSetting('defaultIndexCorrection', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
                      {settings.defaultIndexCorrection}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    AI指数計算時のデフォルト補正値（0-100）
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* データ更新スケジューラ */}
          <motion.div variants={itemVariants}>
            <motion.div 
              className="card"
              variants={cardVariants}
              whileHover="hover"
            >
              <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  <Database className="w-4 h-4" />
                </span>
                データ更新スケジューラ
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        最終CSV同期日時
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(settings.lastCsvSync).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-xs text-green-600 font-medium">同期済み</span>
                  </div>
                </div>

                <button
                  onClick={handleCsvSync}
                  className="btn-primary w-full"
                >
                  <Database className="w-4 h-4 mr-2" />
                  今すぐ同期
                </button>

                <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Info className="w-4 h-4 text-blue-600 mr-2" />
                  <p className="text-xs text-blue-700">
                    自動同期は毎日午前2時に実行されます
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* UIテーマ変更 */}
          <motion.div variants={itemVariants}>
            <motion.div 
              className="card"
              variants={cardVariants}
              whileHover="hover"
            >
              <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                  <Palette className="w-4 h-4" />
                </span>
                UIテーマ設定
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    カラーテーマ
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => updateSetting('colorTheme', 'light')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.colorTheme === 'light'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Sun className="w-6 h-6 text-yellow-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">ライト</p>
                      <p className="text-xs text-gray-500">明るいテーマ</p>
                    </button>

                    <button
                      onClick={() => updateSetting('colorTheme', 'dark')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.colorTheme === 'dark'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Moon className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">ダーク</p>
                      <p className="text-xs text-gray-500">暗いテーマ</p>
                    </button>

                    <button
                      onClick={() => updateSetting('colorTheme', 'system')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.colorTheme === 'system'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Monitor className="w-6 h-6 text-gray-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">システム</p>
                      <p className="text-xs text-gray-500">システム設定に従う</p>
                    </button>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                  <p className="text-xs text-yellow-700">
                    テーマ変更は次回のページ読み込み時に反映されます
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* 操作ボタン */}
          <motion.div variants={itemVariants}>
            <div className="card">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  リセット
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || isSaving}
                  className={`btn-primary ${
                    !hasChanges || isSaving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      保存
                    </>
                  )}
                </button>
              </div>

              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center">
                    <Info className="w-4 h-4 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-700">
                      設定が変更されています。保存してください。
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings; 