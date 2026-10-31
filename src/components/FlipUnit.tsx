import React, { useEffect, useState } from 'react';

interface FlipUnitProps {
  value: number;
  label: string; // 'DAY' | 'HR' | 'MIN' | 'SEC'
}

export const FlipUnit: React.FC<FlipUnitProps> = ({ value, label }) => {
  const formatted = String(value).padStart(2, '0');
  const [prevFormatted, setPrevFormatted] = useState(formatted);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (formatted !== prevFormatted) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevFormatted(formatted);
        setIsFlipping(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [formatted, prevFormatted]);

  return (
    <div className="relative flex-1 min-w-[72px] sm:min-w-[110px] aspect-[3.2/4] sm:aspect-[3/4] select-none">
      {/* The Flip Clock Card Tile matching IMG_4314 */}
      <div
        className="w-full h-full rounded-2xl sm:rounded-3xl border-2 sm:border-[2.5px] border-[#1E1C1B] relative overflow-hidden flex items-center justify-center shadow-[2px_3px_0px_#1E1C1B]"
        style={{
          backgroundColor: '#BA7E74',
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.05) 0px,
            rgba(0, 0, 0, 0.05) 6px,
            transparent 6px,
            transparent 12px
          )`,
        }}
      >
        {/* Upper half subtle highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 pointer-events-none" />

        {/* Center horizontal divider groove */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#1E1C1B]/80 -translate-y-1/2 z-10 pointer-events-none" />

        {/* Left and Right Hinge Notch Clips */}
        <div className="absolute top-1/2 left-0 w-1.5 sm:w-2.5 h-3.5 sm:h-5 bg-[#1E1C1B] -translate-y-1/2 rounded-r-xs z-20 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-1.5 sm:w-2.5 h-3.5 sm:h-5 bg-[#1E1C1B] -translate-y-1/2 rounded-l-xs z-20 pointer-events-none" />

        {/* Big Bold Numbers in Center - Enlarged to almost full height while keeping comfortable margins */}
        <div className="relative z-0 w-full h-full flex items-center justify-center">
          <span
            className={`text-4xl sm:text-6xl md:text-7xl font-black text-[#1E1C1B] font-mono tracking-tighter leading-none tabular-nums transition-transform duration-300 ${
              isFlipping ? 'scale-95 opacity-85' : 'scale-100'
            }`}
          >
            {formatted}
          </span>
        </div>

        {/* Bottom-left Label: DAY, HR, MIN, SEC */}
        <div className="absolute bottom-1.5 left-2 sm:bottom-2.5 sm:left-3 z-10">
          <span className="text-[10px] sm:text-xs font-black tracking-wider text-[#1E1C1B] uppercase font-sans">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};
