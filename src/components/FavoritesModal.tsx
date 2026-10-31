import React from 'react';
import { X, Heart, MapPin, ExternalLink, Trash2 } from 'lucide-react';
import { Spot } from '../types';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Spot[];
  onToggleFavorite: (spot: Spot) => void;
  onClearAll: () => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onToggleFavorite,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-slate-900 bg-[#FFD2CC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
              <Heart className="w-4 h-4 fill-white" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900">我的口袋收藏店家</h2>
              <span className="text-xs font-bold text-slate-700">共 {favorites.length} 處</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {favorites.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-rose-600 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清空</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-slate-900 flex items-center justify-center text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-2.5">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-bold">
              目前尚無收藏項目（在各地區點擊🤍可加入）
            </div>
          ) : (
            favorites.map((spot) => (
              <div
                key={spot.id}
                className="p-3.5 rounded-2xl border-2 border-slate-900 bg-[#FDFBF7] flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900 truncate">{spot.name}</h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                      {spot.categoryLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{spot.description}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href={spot.googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-slate-900 bg-white text-slate-900 hover:bg-slate-100 flex items-center gap-1 text-xs font-bold"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>導航</span>
                  </a>

                  <button
                    onClick={() => onToggleFavorite(spot)}
                    className="p-1.5 rounded-lg bg-rose-100 text-rose-600 border border-rose-300"
                    title="移除"
                  >
                    <Heart className="w-4 h-4 fill-rose-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t-2 border-slate-900 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-black text-xs"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
