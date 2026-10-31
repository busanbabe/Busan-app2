import React from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import { Region } from '../types';

interface RegionCardProps {
  region: Region;
  onOpenModal: (region: Region) => void;
  favoritedSpotIds: string[];
}

export const RegionCard: React.FC<RegionCardProps> = ({
  region,
  onOpenModal,
  favoritedSpotIds,
}) => {
  const favoritedCount = region.spots.filter((s) => favoritedSpotIds.includes(s.id)).length;

  const colorMap: Record<string, { bg: string; badge: string }> = {
    A: { bg: 'bg-[#D7EAFF]', badge: 'bg-[#74B9FF]' },
    B: { bg: 'bg-[#FFEAA7]', badge: 'bg-[#FED330]' },
    C: { bg: 'bg-[#D1F7EA]', badge: 'bg-[#55EFC4]' },
    D: { bg: 'bg-[#E0DBFF]', badge: 'bg-[#A29BFE]' },
    E: { bg: 'bg-[#FFD2CC]', badge: 'bg-[#FF7675]' },
    F: { bg: 'bg-[#FFE6F2]', badge: 'bg-[#FD79A8]' },
  };

  const style = colorMap[region.code] || colorMap.A;

  return (
    <div
      onClick={() => onOpenModal(region)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenModal(region);
        }
      }}
      className={`group ${style.bg} border-2 border-slate-900 rounded-2xl p-4 sm:p-5 shadow-[2px_2px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-9 h-9 rounded-full border-2 border-slate-900 flex items-center justify-center text-sm font-black text-slate-900 shadow-xs ${style.badge}`}
            >
              {region.code}
            </span>
            <span className="text-xs font-bold text-slate-700">{region.koreanName}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {favoritedCount > 0 && (
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white border border-slate-900 text-rose-600">
                ❤️ {favoritedCount}
              </span>
            )}
            <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-white border border-slate-900 text-slate-900">
              {region.spotsCount} 處
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-slate-900 mt-2.5">
          {region.name}
        </h3>
        <p className="text-xs text-slate-700 font-bold mt-0.5 line-clamp-1">
          {region.tagline}
        </p>

        {/* Spot preview preview pills */}
        <div className="mt-3 pt-2.5 border-t border-slate-900/15 space-y-1">
          {region.spots.slice(0, 3).map((spot, idx) => (
            <div
              key={spot.id}
              className="text-xs font-bold text-slate-800 bg-white/70 px-2 py-1 rounded-lg border border-slate-900/10 flex items-center justify-between"
            >
              <span className="truncate">{idx + 1}. {spot.name}</span>
              <span className="text-[10px] text-slate-500 shrink-0 ml-1">{spot.categoryLabel}</span>
            </div>
          ))}
          {region.spotsCount > 3 && (
            <div className="text-[10px] font-bold text-slate-600 pt-0.5 text-center">
              + 查看其他 {region.spotsCount - 3} 個店家
            </div>
          )}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="mt-3 pt-2 border-t border-slate-900/15 flex items-center justify-between text-xs font-black text-slate-900">
        <span>店家清單</span>
        <div className="w-6 h-6 rounded-full bg-white border border-slate-900 flex items-center justify-center">
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
