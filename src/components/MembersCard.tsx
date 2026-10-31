import React from 'react';
import { ChevronRight } from 'lucide-react';
import { TRIP_MEMBERS } from '../data/tripData';

interface MembersCardProps {
  onOpenModal: () => void;
}

export const MembersCard: React.FC<MembersCardProps> = ({ onOpenModal }) => {
  return (
    <div
      onClick={onOpenModal}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenModal();
        }
      }}
      className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-[2px_2px_0px_#0f172a] hover:shadow-[3px_3px_0px_#0f172a] transition-all cursor-pointer flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3">
        {/* 4 Perfect Circular Color Blocks with Initials */}
        <div className="flex -space-x-2">
          {TRIP_MEMBERS.map((m) => (
            <div
              key={m.id}
              className="w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-black shadow-xs"
              style={{ backgroundColor: m.color }}
              title={m.name}
            >
              {m.name.slice(0, 1)}
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-slate-900">
              釜山旅遊成員
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFEAA7] border border-slate-900 text-slate-900">
              歐尼 × 3、歐巴 × 1
            </span>
          </div>
          <p className="text-xs text-slate-600 font-bold mt-0.5">
            Jase · Jessie · Jewel · Kay
          </p>
        </div>
      </div>

      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-900 flex items-center justify-center shrink-0">
        <ChevronRight className="w-4 h-4 text-slate-900" />
      </div>
    </div>
  );
};
