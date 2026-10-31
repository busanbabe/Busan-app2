import React from 'react';
import { X, Phone, Compass, ShieldCheck } from 'lucide-react';

interface EmergencyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyGuideModal: React.FC<EmergencyGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const hotlines = [
    { title: '112 警察報警', number: '112', desc: '遺失物品、治安急難求助', color: 'bg-[#FFD2CC]' },
    { title: '119 救護車/火警', number: '119', desc: '身體急病、緊急送醫', color: 'bg-[#FFEAA7]' },
    { title: '1330 觀光多語翻譯', number: '1330', desc: '按 2 轉中文免費用途翻譯', color: 'bg-[#D7EAFF]' },
    { title: '駐釜山辦事處救助', number: '+82 10-4537-7961', desc: '台灣旅客急難救助專線', color: 'bg-[#D1F7EA]' },
  ];

  const phrases = [
    { zh: '請問這個多少錢？', kr: '이거 얼마예요?' },
    { zh: '請給我這個。', kr: '이거 주세요.' },
    { zh: '請結帳，謝謝。', kr: '계산해 주세요.' },
    { zh: '請帶我去這個地址（出示手機）。', kr: '이 주소로 가주세요.' },
    { zh: '可以幫我們拍照嗎？', kr: '사진 좀 찍어주세요.' },
    { zh: '請不要太辣，謝謝。', kr: '덜 맵게 해주세요.' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b-2 border-slate-900 bg-[#FFEAA7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black">
              SOS
            </span>
            <h2 className="text-lg font-black text-slate-900">SOS · 釜山旅遊小幫手</h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-900 flex items-center justify-center text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Hotline Quick Blocks styled like reference image 3 */}
          <div className="grid grid-cols-2 gap-2.5">
            {hotlines.map((h, i) => (
              <a
                key={i}
                href={`tel:${h.number.replace(/\s+/g, '')}`}
                className={`p-3 rounded-2xl border-2 border-slate-900 ${h.color} shadow-xs flex flex-col justify-between block`}
              >
                <div>
                  <div className="text-xs font-black text-slate-900">{h.title}</div>
                  <div className="text-lg font-black text-slate-900 font-mono mt-0.5">{h.number}</div>
                </div>
                <div className="mt-2 pt-1 border-t border-slate-900/10 flex items-center justify-between text-[10px] font-black text-slate-800">
                  <span>{h.desc}</span>
                  <span className="px-1.5 py-0.5 bg-slate-900 text-white rounded">撥打</span>
                </div>
              </a>
            ))}
          </div>

          {/* Korean Survival Phrases Card */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-900 block">給當地人看的句子：</span>
            <div className="space-y-2">
              {phrases.map((p, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl border-2 border-slate-900 bg-[#FDFBF7] flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="text-slate-500 font-bold block">{p.zh}</span>
                    <span className="text-sm font-black text-slate-900 mt-0.5 block">{p.kr}</span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 rounded bg-[#D7EAFF] border border-slate-900 text-slate-900 shrink-0">
                    出示
                  </span>
                </div>
              ))}
            </div>
          </div>
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
