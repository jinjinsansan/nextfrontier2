import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RaceListItem } from '../types';

// 仮データ
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

const RaceList: React.FC = () => {
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDistance, setSelectedDistance] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  // フィルタリングされたレース一覧
  const filteredRaces = useMemo(() => {
    return dummyRaceList.filter(race => {
      const venueMatch = !selectedVenue || race.venue === selectedVenue;
      const dateMatch = !selectedDate || race.date === selectedDate;
      const distanceMatch = !selectedDistance || race.distance === selectedDistance;
      const searchMatch = !searchTerm || 
        race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        race.venue.toLowerCase().includes(searchTerm.toLowerCase());

      return venueMatch && dateMatch && distanceMatch && searchMatch;
    });
  }, [selectedVenue, selectedDate, selectedDistance, searchTerm]);

  // ユニークな値を取得
  const venues = Array.from(new Set(dummyRaceList.map(race => race.venue)));
  const dates = Array.from(new Set(dummyRaceList.map(race => race.date)));
  const distances = Array.from(new Set(dummyRaceList.map(race => race.distance)));

  const handleRaceClick = (raceId: string) => {
    navigate(`/race/${raceId}/predict`);
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
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 bg-gradient-to-r from-primary-600 to-accent-orange bg-clip-text text-transparent">
            レース一覧
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            予想対象レースを選択してください
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-orange mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* フィルタ・検索 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card">
            <h3 className="text-xl font-semibold text-text mb-6 flex items-center">
              <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">🔍</span>
              レース検索・フィルタ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* 検索バー */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  キーワード検索
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="レース名や競馬場で検索..."
                  className="input-field"
                />
              </div>

              {/* 競馬場フィルタ */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  競馬場
                </label>
                <select
                  value={selectedVenue}
                  onChange={(e) => setSelectedVenue(e.target.value)}
                  className="select-field"
                >
                  <option value="">すべて</option>
                  {venues.map(venue => (
                    <option key={venue} value={venue}>{venue}</option>
                  ))}
                </select>
              </div>

              {/* 開催日フィルタ */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  開催日
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="select-field"
                >
                  <option value="">すべて</option>
                  {dates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 距離フィルタ */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 lg:col-span-6">
                距離
              </label>
              <button
                onClick={() => setSelectedDistance('')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDistance === '' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                すべて
              </button>
              {distances.map(distance => (
                <button
                  key={distance}
                  onClick={() => setSelectedDistance(distance)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDistance === distance 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {distance}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* レース一覧 */}
        <motion.div 
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-text">
              レース一覧 ({filteredRaces.length}件)
            </h3>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              ← ホームに戻る
            </button>
          </div>

          {filteredRaces.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-gray-400 text-6xl mb-4">🏇</div>
              <p className="text-gray-600 text-lg">条件に一致するレースが見つかりませんでした</p>
              <button
                onClick={() => {
                  setSelectedVenue('');
                  setSelectedDate('');
                  setSelectedDistance('');
                  setSearchTerm('');
                }}
                className="btn-primary mt-4"
              >
                フィルタをリセット
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredRaces.map((race, index) => (
                  <motion.div
                    key={race.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.1 }}
                    className="card cursor-pointer hover:shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleRaceClick(race.id)}
                  >
                    {/* レースヘッダー */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-text mb-1">
                          {race.venue} {race.raceNumber}R
                        </h4>
                        <p className="text-sm text-gray-600">
                          {race.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">
                          {race.horses}頭
                        </span>
                      </div>
                    </div>

                    {/* レース詳細 */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">距離:</span>
                          <span className="ml-2 font-semibold text-text">{race.distance}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">条件:</span>
                          <span className="ml-2 font-semibold text-text">{race.condition}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          {race.course}
                        </p>
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="w-full btn-primary text-sm py-2">
                        <span className="flex items-center justify-center">
                          <span className="mr-2">📊</span>
                          AI指数計算
                        </span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RaceList; 