import React from 'react';
import { Home, MapPin, Receipt, Building, Sparkles } from 'lucide-react';

export type TabId = 'home' | 'regions' | 'expenses' | 'bookings' | 'info';

interface BottomNavProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  favoritesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
}) => {
  const tabs = [
    { id: 'home' as TabId, label: '首頁', icon: Home, color: '#FF7675' },
    { id: 'regions' as TabId, label: '地區', icon: MapPin, color: '#74B9FF' },
    { id: 'expenses' as TabId, label: '記帳', icon: Receipt, color: '#55EFC4' },
    { id: 'bookings' as TabId, label: '住宿', icon: Building, color: '#FFEAA7' },
    { id: 'info' as TabId, label: '其他資訊', icon: Sparkles, color: '#A29BFE' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
      <div className="max-w-xl mx-auto px-2 h-16 sm:h-18 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all relative ${
                isActive ? 'scale-105' : 'opacity-65 hover:opacity-100'
              }`}
            >
              {/* Curved block background on active tab */}
              <div
                className={`w-11 h-9 rounded-2xl flex items-center justify-center transition-all ${
                  isActive ? 'shadow-xs border-2 border-slate-900' : 'bg-transparent'
                }`}
                style={{
                  backgroundColor: isActive ? tab.color : 'transparent',
                }}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-slate-900 stroke-[2.5]' : 'text-slate-600'
                  }`}
                />
              </div>

              <span
                className={`text-[11px] font-bold mt-0.5 tracking-tight ${
                  isActive ? 'text-slate-900 font-extrabold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>

              {/* Badge for favorites on other info tab */}
              {tab.id === 'info' && favoritesCount > 0 && (
                <span className="absolute top-1 right-3 w-4 h-4 bg-[#FF7675] text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                  {favoritesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
