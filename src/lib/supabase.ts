// Supabase連携用ライブラリ
// 注意: 実際のSupabase設定は環境変数で管理してください

export interface UploadHistory {
  id: string;
  created_at: string;
  data_type: string;
  record_count: number;
  status: 'success' | 'error' | 'processing';
  error_message?: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  recordCount?: number;
}

// データ種別の定義
export const DATA_TYPES = {
  RACE_INFO: 'レース情報',
  HORSE_RESULTS: '出走馬成績',
  PEDIGREE: '血統情報',
  JOCKEY_RESULTS: '騎手成績',
  TRAINER_RESULTS: '調教師成績',
  OWNER_RESULTS: '馬主成績'
} as const;

export type DataType = keyof typeof DATA_TYPES;

// CSVインポート実行
export const importCSVData = async (
  csvData: string,
  dataType: DataType,
  fileName: string
): Promise<ImportResult> => {
  try {
    // 実際のSupabase APIエンドポイントに送信
    // ここではダミーの実装
    console.log('CSVインポート実行:', {
      dataType,
      fileName,
      recordCount: csvData.split('\n').length - 1 // ヘッダー除く
    });

    // シミュレーション用の遅延
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 成功時のレスポンス
    return {
      success: true,
      message: `${DATA_TYPES[dataType]}のインポートが完了しました`,
      recordCount: csvData.split('\n').length - 1
    };
  } catch (error) {
    console.error('CSVインポートエラー:', error);
    return {
      success: false,
      message: `インポートに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`
    };
  }
};

// アップロード履歴取得
export const getUploadHistory = async (): Promise<UploadHistory[]> => {
  try {
    // 実際のSupabaseから履歴を取得
    // ここではダミーデータを返す
    const dummyHistory: UploadHistory[] = [
      {
        id: '1',
        created_at: '2024-01-15T10:30:00Z',
        data_type: DATA_TYPES.RACE_INFO,
        record_count: 150,
        status: 'success'
      },
      {
        id: '2',
        created_at: '2024-01-14T15:45:00Z',
        data_type: DATA_TYPES.HORSE_RESULTS,
        record_count: 1200,
        status: 'success'
      },
      {
        id: '3',
        created_at: '2024-01-13T09:20:00Z',
        data_type: DATA_TYPES.PEDIGREE,
        record_count: 800,
        status: 'error',
        error_message: 'データ形式エラー'
      },
      {
        id: '4',
        created_at: '2024-01-12T14:10:00Z',
        data_type: DATA_TYPES.JOCKEY_RESULTS,
        record_count: 300,
        status: 'success'
      },
      {
        id: '5',
        created_at: '2024-01-11T11:05:00Z',
        data_type: DATA_TYPES.TRAINER_RESULTS,
        record_count: 200,
        status: 'success'
      }
    ];

    // 日時順でソート（新しい順）
    return dummyHistory.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('履歴取得エラー:', error);
    return [];
  }
};

// 管理者認証チェック（ダミー実装）
export const checkAdminAuth = (): boolean => {
  // 実際の認証ロジックをここに実装
  // 今は常にtrueを返す
  return true;
};

// 想定オッズ関連のインターフェース
export interface SavedRaceOdds {
  id: string;
  raceId: number;
  raceName: string;
  horses: Array<{
    horseId: number;
    horseNumber: number;
    horseName: string;
    odds: number;
    abilityIndex: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

// レース一覧取得
export const getRaces = async (): Promise<Array<{ id: number; name: string; date: string }>> => {
  try {
    // 実際のSupabaseからレース情報を取得
    // ここではダミーデータを返す
    const dummyRaces = [
      { id: 1, name: '東京優駿（日本ダービー）', date: '2024-05-26' },
      { id: 2, name: '皐月賞', date: '2024-04-14' },
      { id: 3, name: '菊花賞', date: '2024-10-20' },
      { id: 4, name: '天皇賞（春）', date: '2024-05-05' },
      { id: 5, name: '天皇賞（秋）', date: '2024-10-27' },
      { id: 6, name: '有馬記念', date: '2024-12-22' },
      { id: 7, name: '宝塚記念', date: '2024-06-23' },
      { id: 8, name: 'ジャパンカップ', date: '2024-11-24' }
    ];
    
    return dummyRaces;
  } catch (error) {
    console.error('レース取得エラー:', error);
    return [];
  }
};

// 出走馬情報取得
export const getRaceHorses = async (raceId: number): Promise<Array<{ id: number; number: number; name: string }>> => {
  try {
    // 実際のSupabaseから出走馬情報を取得
    // ここではダミーデータを返す
    const dummyHorses = [
      { id: 1, number: 1, name: 'ディープインパクト' },
      { id: 2, number: 2, name: 'サイレンススズカ' },
      { id: 3, number: 3, name: 'トウカイテイオー' },
      { id: 4, number: 4, name: 'オグリキャップ' },
      { id: 5, number: 5, name: 'シンボリルドルフ' },
      { id: 6, number: 6, name: 'メジロマックイーン' },
      { id: 7, number: 7, name: 'ナリタブライアン' },
      { id: 8, number: 8, name: 'セイウンスカイ' },
      { id: 9, number: 9, name: 'エアグルーヴ' },
      { id: 10, number: 10, name: 'スペシャルウィーク' },
      { id: 11, number: 11, name: 'グラスワンダー' },
      { id: 12, number: 12, name: 'エルコンドルパサー' }
    ];
    
    return dummyHorses;
  } catch (error) {
    console.error('出走馬取得エラー:', error);
    return [];
  }
};

// 想定オッズ保存
export const saveRaceOdds = async (raceOdds: {
  raceId: number;
  raceName: string;
  horses: Array<{
    horseId: number;
    horseNumber: number;
    horseName: string;
    odds: number;
    abilityIndex: number;
  }>;
}): Promise<{ success: boolean; message: string }> => {
  try {
    // 実際のSupabaseに保存
    console.log('想定オッズ保存:', raceOdds);
    
    // シミュレーション用の遅延
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `${raceOdds.raceName}の想定オッズを保存しました`
    };
  } catch (error) {
    console.error('想定オッズ保存エラー:', error);
    return {
      success: false,
      message: `保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`
    };
  }
};

// 保存済み想定オッズ取得
export const getSavedRaceOdds = async (): Promise<SavedRaceOdds[]> => {
  try {
    // 実際のSupabaseから保存済みデータを取得
    // ここではダミーデータを返す
    const dummySavedOdds: SavedRaceOdds[] = [
      {
        id: '1',
        raceId: 1,
        raceName: '東京優駿（日本ダービー）',
        horses: [
          { horseId: 1, horseNumber: 1, horseName: 'ディープインパクト', odds: 2.5, abilityIndex: 40.0 },
          { horseId: 2, horseNumber: 2, horseName: 'サイレンススズカ', odds: 3.2, abilityIndex: 31.25 },
          { horseId: 3, horseNumber: 3, horseName: 'トウカイテイオー', odds: 4.1, abilityIndex: 24.39 }
        ],
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        raceId: 2,
        raceName: '皐月賞',
        horses: [
          { horseId: 4, horseNumber: 1, horseName: 'オグリキャップ', odds: 2.8, abilityIndex: 35.71 },
          { horseId: 5, horseNumber: 2, horseName: 'シンボリルドルフ', odds: 3.5, abilityIndex: 28.57 },
          { horseId: 6, horseNumber: 3, horseName: 'メジロマックイーン', odds: 4.8, abilityIndex: 20.83 }
        ],
        createdAt: '2024-01-14T15:45:00Z',
        updatedAt: '2024-01-14T15:45:00Z'
      }
    ];
    
    return dummySavedOdds;
  } catch (error) {
    console.error('保存済みオッズ取得エラー:', error);
    return [];
  }
}; 

// 学習的思考指数関連のインターフェース
export interface LearningIndex {
  id: string;
  thinkingType: 'jockey' | 'trainer' | 'analyst';
  name: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

// 思考タイプの定義
export const THINKING_TYPES = {
  JOCKEY: 'jockey',
  TRAINER: 'trainer', 
  ANALYST: 'analyst'
} as const;

export const THINKING_TYPE_LABELS = {
  jockey: '騎手心理思考',
  trainer: '調教師心理思考',
  analyst: '予想家心理思考'
} as const;

export type ThinkingType = 'jockey' | 'trainer' | 'analyst';

// 学習的思考指数保存
export const saveLearningIndex = async (learningIndex: {
  thinkingType: ThinkingType;
  name: string;
  score: number;
}): Promise<{ success: boolean; message: string }> => {
  try {
    // 実際のSupabaseに保存
    console.log('学習的思考指数保存:', learningIndex);
    
    // シミュレーション用の遅延
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `${THINKING_TYPE_LABELS[learningIndex.thinkingType as keyof typeof THINKING_TYPE_LABELS]}の指数を保存しました`
    };
  } catch (error) {
    console.error('学習的思考指数保存エラー:', error);
    return {
      success: false,
      message: `保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`
    };
  }
};

// 保存済み学習的思考指数取得
export const getSavedLearningIndexes = async (): Promise<LearningIndex[]> => {
  try {
    // 実際のSupabaseから保存済みデータを取得
    // ここではダミーデータを返す
    const dummyLearningIndexes: LearningIndex[] = [
      {
        id: '1',
        thinkingType: 'jockey',
        name: '武豊',
        score: 8.5,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        thinkingType: 'jockey',
        name: '福永祐一',
        score: 7.8,
        createdAt: '2024-01-14T15:45:00Z',
        updatedAt: '2024-01-14T15:45:00Z'
      },
      {
        id: '3',
        thinkingType: 'trainer',
        name: '藤沢和雄',
        score: 9.2,
        createdAt: '2024-01-13T09:20:00Z',
        updatedAt: '2024-01-13T09:20:00Z'
      },
      {
        id: '4',
        thinkingType: 'trainer',
        name: '池江泰寿',
        score: 8.7,
        createdAt: '2024-01-12T14:10:00Z',
        updatedAt: '2024-01-12T14:10:00Z'
      },
      {
        id: '5',
        thinkingType: 'analyst',
        name: '競馬評論家A',
        score: 7.5,
        createdAt: '2024-01-11T11:05:00Z',
        updatedAt: '2024-01-11T11:05:00Z'
      },
      {
        id: '6',
        thinkingType: 'analyst',
        name: '競馬評論家B',
        score: 8.1,
        createdAt: '2024-01-10T16:30:00Z',
        updatedAt: '2024-01-10T16:30:00Z'
      }
    ];
    
    return dummyLearningIndexes;
  } catch (error) {
    console.error('保存済み学習的思考指数取得エラー:', error);
    return [];
  }
};

// 学習的思考指数更新
export const updateLearningIndex = async (
  id: string,
  learningIndex: {
    thinkingType: ThinkingType;
    name: string;
    score: number;
  }
): Promise<{ success: boolean; message: string }> => {
  try {
    // 実際のSupabaseで更新
    console.log('学習的思考指数更新:', { id, ...learningIndex });
    
    // シミュレーション用の遅延
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `${THINKING_TYPE_LABELS[learningIndex.thinkingType as keyof typeof THINKING_TYPE_LABELS]}の指数を更新しました`
    };
  } catch (error) {
    console.error('学習的思考指数更新エラー:', error);
    return {
      success: false,
      message: `更新に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`
    };
  }
};

// 学習的思考指数削除
export const deleteLearningIndex = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    // 実際のSupabaseで削除
    console.log('学習的思考指数削除:', id);
    
    // シミュレーション用の遅延
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: '学習的思考指数を削除しました'
    };
  } catch (error) {
    console.error('学習的思考指数削除エラー:', error);
    return {
      success: false,
      message: `削除に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`
    };
  }
}; 