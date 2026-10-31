import React, { useState, useEffect } from 'react';
import { Globe, Clock } from 'lucide-react';
import { FlipUnit } from './FlipUnit';

export const CountdownCard: React.FC = () => {
  // Korea Standard Time (UTC+9) targets
  const stage1Target = new Date('2026-12-31T18:00:00+09:00').getTime();
  const stage2Target = new Date('2027-01-01T00:00:00+09:00').getTime();

  const [now, setNow] = useState(Date.now());
  const [timeZoneMode, setTimeZoneMode] = useState<'KST' | 'AUTO'>('KST');

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine stage automatically based on current time
  const isStage1 = now < stage1Target;
  const isStage2 = now >= stage1Target && now < stage2Target;

  const targetTime = isStage1 ? stage1Target : stage2Target;
  const title = isStage1 ? '成員集合倒數' : isStage2 ? '2027 釜山跨年倒數' : '2027 Happy New Year!';

  const diff = Math.max(0, targetTime - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Live Korean Local Time formatted
  const kstTimeStr = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(now));

  return (
    <div
      id="countdown"
      className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-3.5"
    >
      {/* Header Info: Title is strictly 「成員集合倒數」 or 「2027 釜山跨年倒數」 */}
      <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2.5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-[11px] font-bold text-slate-500 mt-0.5">
            {isStage1 ? '倒數至 12/31 18:00 晚餐大合體' : isStage2 ? '倒數至 1/1 00:00 廣安里跨年' : '元旦快樂'}
          </p>
        </div>

        {/* Korea Local Time Connection Status */}
        <div className="text-right">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D7EAFF] border border-slate-900 text-slate-900 text-[10px] font-black">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>韓國時間 KST (UTC+9)</span>
          </div>
          <div className="text-[11px] font-mono font-bold text-slate-600 mt-1">
            {kstTimeStr}
          </div>
        </div>
      </div>

      {/* Flip Clock Tiles: Numbers enlarged to fill cards comfortably */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 py-0.5">
        <FlipUnit value={days} label="DAY" />
        <FlipUnit value={hours} label="HR" />
        <FlipUnit value={minutes} label="MIN" />
        <FlipUnit value={seconds} label="SEC" />
      </div>

      {/* Timezone Note */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-0.5 px-0.5">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>抵達韓國釜山後，App 自動連線當地時區精準倒數</span>
        </span>
      </div>
    </div>
  );
};
