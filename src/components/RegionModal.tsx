import React, { useState } from 'react';
import { X, MapPin, Heart, ExternalLink, Search, Plus, Check } from 'lucide-react';
import { Region, Spot } from '../types';

interface RegionModalProps {
  region: Region | null;
  isOpen: boolean;
  onClose: () => void;
  favoritedSpotIds: string[];
  onToggleFavorite: (spot: Spot) => void;
  onAddSpotToItinerary?: (spot: Spot, regionName: string) => void;
  selectedDateLabel?: string;
}

export const RegionModal: React.FC<RegionModalProps> = ({
  region,
  isOpen,
  onClose,
  favoritedSpotIds,
  onToggleFavorite,
  onAddSpotToItinerary,
  selectedDateLabel = '今日',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  if (!isOpen || !region) return null;

  const filteredSpots = region.spots.filter((spot) => {
    const matchesSearch =
      spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (spot.koreanName && spot.koreanName.includes(searchTerm)) ||
      spot.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || spot.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = (spot: Spot) => {
    if (onAddSpotToItinerary) {
      onAddSpotToItinerary(spot, region.name);
      setJustAddedId(spot.id);
      setTimeout(() => {
        setJustAddedId(null);
      }, 1500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-900 bg-[#D7EAFF] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                {region.code}
              </span>
              <span className="text-xs font-bold text-slate-700">{region.koreanName}</span>
              <span className="text-xs font-bold text-slate-600">· 共 {region.spotsCount} 處</span>
            </div>

            <h2 className="text-xl font-black text-slate-900 mt-1">
              {region.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Region Climate Tip */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 text-xs text-slate-800 font-bold flex items-center justify-between">
          <div>
            氣候穿搭：<span className="font-medium text-slate-700">{region.microClimateTip}</span>
          </div>
          {selectedDateLabel && (
            <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-[#FFEAA7] border border-slate-900 text-slate-900">
              點擊「＋加行程」加入 {selectedDateLabel}
            </span>
          )}
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-3 sm:px-5 bg-white border-b-2 border-slate-100 flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋店家或韓文..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-slate-900 font-medium"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {[
              { id: 'all', label: '全部' },
              { id: 'gourmet', label: '美食' },
              { id: 'cafe', label: '咖啡' },
              { id: 'sightseeing', label: '景點' },
              { id: 'activity', label: '體驗' },
              { id: 'shopping', label: '購物' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Spot List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5">
          {filteredSpots.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-bold">
              沒有找到符合的店家
            </div>
          ) : (
            filteredSpots.map((spot, idx) => {
              const isFavorited = favoritedSpotIds.includes(spot.id);
              const isJustAdded = justAddedId === spot.id;

              return (
                <div
                  key={spot.id}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isFavorited
                      ? 'bg-[#FFF0EE] border-slate-900'
                      : 'bg-white border-slate-200 hover:border-slate-900'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-black text-slate-400">
                        {idx + 1}.
                      </span>
                      <h4 className="text-sm font-black text-slate-900 truncate">
                        {spot.name}
                      </h4>
                      {spot.koreanName && (
                        <span className="text-xs text-slate-400 font-bold truncate">
                          ({spot.koreanName})
                        </span>
                      )}
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                        {spot.categoryLabel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-1 font-medium pl-4">
                      {spot.description}
                    </p>

                    {spot.highlightTip && (
                      <div className="pl-4 text-[11px] text-amber-800 font-bold mt-0.5">
                        重點：{spot.highlightTip}
                      </div>
                    )}
                  </div>

                  {/* Actions: Add to Itinerary, Google Map, Heart Favorite */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Add to Daily Itinerary (+) Button */}
                    <button
                      onClick={() => handleAdd(spot)}
                      disabled={isJustAdded}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1 shadow-xs cursor-pointer ${
                        isJustAdded
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-[#FFEAA7] hover:bg-[#FED330] border-slate-900 text-slate-900'
                      }`}
                      title={`加到 ${selectedDateLabel} 行程`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span className="text-[10px]">已加入!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">加行程</span>
                        </>
                      )}
                    </button>

                    {/* Google Map Link */}
                    <a
                      href={spot.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1.5 rounded-xl text-xs font-black bg-white border border-slate-900 text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 shadow-xs"
                      title="Google Maps 導航"
                    >
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span className="hidden sm:inline">地圖</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    {/* Single heart toggle */}
                    <button
                      onClick={() => onToggleFavorite(spot)}
                      className={`p-1.5 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer ${
                        isFavorited
                          ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-xs'
                          : 'bg-white border-slate-300 text-slate-300 hover:text-rose-400 hover:border-rose-300'
                      }`}
                      aria-label={isFavorited ? '取消收藏' : '加入收藏'}
                      title={isFavorited ? '已收藏（點擊取消）' : '加入收藏'}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform ${
                          isFavorited ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t-2 border-slate-900 bg-white flex items-center justify-between">
          <span className="text-xs text-slate-500 font-bold">
            共 {filteredSpots.length} 個店家
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
