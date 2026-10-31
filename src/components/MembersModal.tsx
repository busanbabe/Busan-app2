import React from 'react';
import { X, Clock, Utensils, CheckCircle2 } from 'lucide-react';
import { TRIP_MEMBERS } from '../data/tripData';
import { Member } from '../types';

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MembersModal: React.FC<MembersModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b-2 border-slate-900 bg-[#FFEAA7] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                成員名單
              </span>
              <span className="text-xs font-bold text-slate-800">歐尼 × 3、歐巴 × 1</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">4 位出遊成員詳細角色</h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Members List */}
        <div className="p-5 overflow-y-auto space-y-3">
          {TRIP_MEMBERS.map((member: Member) => (
            <div
              key={member.id}
              className="bg-[#FDFBF7] rounded-2xl p-4 border-2 border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                {/* Perfect Color Circle */}
                <div
                  className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center text-base font-black shrink-0 shadow-xs"
                  style={{ backgroundColor: member.color }}
                >
                  {member.name.slice(0, 1)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">{member.name}</h3>
                    <span className="text-xs text-slate-500 font-bold">({member.koreanName})</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white border border-slate-900 text-slate-900">
                      {member.badge}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{member.role}</p>
                </div>
              </div>

              {/* Tag & Trip Duration */}
              <div className="text-right sm:border-l sm:border-slate-300 sm:pl-4 space-y-1">
                <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                  {member.tripType === '5D4N' ? '五天四夜 (12/29-1/2)' : '三天兩夜 (12/31-1/2)'}
                </span>
                <div className="text-[11px] text-slate-600 font-medium">
                  愛吃：<span className="font-bold text-slate-800">{member.favoriteFood}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Quick Notice */}
          <div className="p-3 bg-[#D1F7EA] border-2 border-slate-900 rounded-2xl text-xs font-bold text-slate-900">
            ★ 12/31 18:00 晚餐大合體：Jase & Jessie (12/29 先到) 與 Jewel & Kay (12/31 飛抵) 四人會合！
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-slate-900 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
