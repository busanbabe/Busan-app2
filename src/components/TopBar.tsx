import React from 'react';
import { Heart } from 'lucide-react';

interface TopBarProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  favoritesCount,
  onOpenFavorites,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b-2 border-slate-900">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[#FF7675] border-2 border-slate-900 text-white flex items-center justify-center text-xs font-black shadow-xs">
            안
          </span>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
              釜山按鈕 2027 Happy New Year
            </h1>
          </div>
        </div>

        {/* Action button: Favorites - Cute macaron button, no black color block */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenFavorites}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-slate-900 bg-[#FFEAA7] hover:bg-[#FED330] border-2 border-slate-900 rounded-xl transition-all shadow-[1.5px_1.5px_0px_#0f172a] cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>收藏</span>
            <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-[#FF7675] text-white tabular-nums border border-slate-900">
              {favoritesCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
