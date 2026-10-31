import React, { useState, useEffect } from 'react';
import {
  Heart,
  Phone,
  Sparkles,
  HelpCircle,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { TopBar } from './components/TopBar';
import { BottomNav, TabId } from './components/BottomNav';
import { MembersCard } from './components/MembersCard';
import { MembersModal } from './components/MembersModal';
import { CountdownCard } from './components/CountdownCard';
import { WeatherWidget } from './components/WeatherWidget';
import { RegionCard } from './components/RegionCard';
import { RegionModal } from './components/RegionModal';
import { FavoritesModal } from './components/FavoritesModal';
import { BookingCard } from './components/BookingCard';
import { ExpenseTracker } from './components/ExpenseTracker';
import { DailyItinerary } from './components/DailyItinerary';
import { EmergencyGuideModal } from './components/EmergencyGuideModal';
import {
  TRIP_REGIONS,
  INITIAL_BOOKING,
  INITIAL_EXPENSES,
  DAILY_WEATHER_DATA,
} from './data/tripData';
import { Region, Spot, ExpenseItem, ItineraryItem } from './types';

export default function App() {
  // Active Tab from bottom bar: 'home' | 'regions' | 'expenses' | 'bookings' | 'info'
  const [activeTab, setActiveTab] = useState<TabId>('home');

  // Modals
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Date selection for weather & daily itinerary
  const [selectedDate, setSelectedDate] = useState<string>('2026-12-31');
  const [activeRegionForWeather, setActiveRegionForWeather] = useState<Region>(TRIP_REGIONS[3]); // Gwangalli

  // Toast notification for adding items to itinerary
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom Daily Itineraries state persisted in localStorage
  const [customItineraries, setCustomItineraries] = useState<Record<string, ItineraryItem[]>>(() => {
    try {
      const saved = localStorage.getItem('busan_2027_custom_itinerary');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Starts empty so users can build their own schedule from scratch
    return {
      '2026-12-29': [],
      '2026-12-30': [],
      '2026-12-31': [],
      '2027-01-01': [],
      '2027-01-02': [],
    };
  });

  // Favorites state persisted in localStorage
  const [favoritedSpotIds, setFavoritedSpotIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('busan_2027_favorites');
      return saved ? JSON.parse(saved) : ['c-5', 'd-4', 'd-9', 'e-1', 'f-1'];
    } catch {
      return ['c-5', 'd-4', 'd-9', 'e-1', 'f-1'];
    }
  });

  // Expense tracker items persisted in localStorage
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem('busan_2027_expenses');
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  // Exchange rate: 1 TWD = 42.5 KRW
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('busan_2027_ex_rate');
      return saved ? parseFloat(saved) : 42.5;
    } catch {
      return 42.5;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('busan_2027_custom_itinerary', JSON.stringify(customItineraries));
    } catch {
      // ignore
    }
  }, [customItineraries]);

  useEffect(() => {
    try {
      localStorage.setItem('busan_2027_favorites', JSON.stringify(favoritedSpotIds));
    } catch {
      // ignore
    }
  }, [favoritedSpotIds]);

  useEffect(() => {
    try {
      localStorage.setItem('busan_2027_expenses', JSON.stringify(expenses));
    } catch {
      // ignore
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem('busan_2027_ex_rate', exchangeRate.toString());
    } catch {
      // ignore
    }
  }, [exchangeRate]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleUpdateItinerary = (date: string, items: ItineraryItem[]) => {
    setCustomItineraries((prev) => ({
      ...prev,
      [date]: items,
    }));
  };

  const handleAddSpotToItinerary = (spot: Spot, regionName: string) => {
    const newItem: ItineraryItem = {
      id: `spot-${spot.id}-${Date.now()}`,
      title: spot.name,
      regionName,
      spotId: spot.id,
      category: spot.categoryLabel,
      googleMapUrl: spot.googleMapUrl,
      note: spot.description,
    };

    setCustomItineraries((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newItem],
    }));

    const dateObj = DAILY_WEATHER_DATA.find((d) => d.date === selectedDate);
    const dateLabel = dateObj ? dateObj.displayDate : selectedDate;
    showToast(`已成功將「${spot.name}」加入 ${dateLabel} 行程！`);
  };

  const handleToggleFavorite = (spot: Spot) => {
    setFavoritedSpotIds((prev) => {
      if (prev.includes(spot.id)) {
        return prev.filter((id) => id !== spot.id);
      } else {
        return [...prev, spot.id];
      }
    });
  };

  const handleClearAllFavorites = () => {
    setFavoritedSpotIds([]);
  };

  const allSpots = TRIP_REGIONS.flatMap((r) => r.spots);
  const favoritedSpots = allSpots.filter((s) => favoritedSpotIds.includes(s.id));

  const currentDateObj = DAILY_WEATHER_DATA.find((d) => d.date === selectedDate);
  const currentDateLabel = currentDateObj ? currentDateObj.displayDate : selectedDate;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 font-sans pb-24 selection:bg-[#FFEAA7]">
      {/* Top Bar Navigation */}
      <TopBar
        favoritesCount={favoritedSpotIds.length}
        onOpenFavorites={() => setIsFavoritesModalOpen(true)}
      />

      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-xl border-2 border-white/20 animate-in slide-in-from-top-4 duration-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#55EFC4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content View Switcher */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {/* ================= TAB 1: 首頁 (HOME) ================= */}
        {activeTab === 'home' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Top Quick Overview Banner */}
            <div className="bg-[#FFEAA7] border-2 border-slate-900 rounded-3xl p-5 shadow-[2px_2px_0px_#0f172a] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 tracking-wide uppercase">
                  五天四夜手帳
                </span>
                <span className="text-xs font-black text-slate-800">2026/12/29 - 2027/1/2</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                釜山按鈕 2027 Happy New Year
              </h2>
              <p className="text-xs text-slate-700 font-bold">
                4人同行跨年盛典 · 歐尼 × 3、歐巴 × 1
              </p>
            </div>

            {/* Member Overview Card - 釜山旅遊成員 */}
            <MembersCard onOpenModal={() => setIsMembersModalOpen(true)} />

            {/* Flip Clock Countdown: Enlarge to fill card comfortably & Korea KST time tracking */}
            <CountdownCard />

            {/* Date & Weather Horizontal Scrollable Row: Temperature largest, date under temp */}
            <WeatherWidget
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedRegionName={activeRegionForWeather.name}
              regionClimateTip={activeRegionForWeather.microClimateTip}
            />

            {/* Daily Itinerary: User-customizable schedule with + button, jump to regions, and reordering */}
            <DailyItinerary
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onOpenRegionModal={(reg) => {
                setSelectedRegion(reg);
                setActiveRegionForWeather(reg);
              }}
              onGoToRegionsTab={() => setActiveTab('regions')}
              customItineraries={customItineraries}
              onUpdateItinerary={handleUpdateItinerary}
            />
          </div>
        )}

        {/* ================= TAB 2: 地區 (REGIONS) ================= */}
        {activeTab === 'regions' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Context Notice for adding spots to itinerary */}
            <div className="p-4 rounded-3xl bg-[#FFEAA7] border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">
                    目前排定行程日期：<span className="text-rose-600 font-black">{currentDateLabel}</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-700">
                    點擊店家卡片內的「＋加行程」，即可直接存入每日行程表！
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('home')}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-black flex items-center gap-1 hover:bg-slate-800 shrink-0 cursor-pointer"
              >
                <span>看行程</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div>
                <h2 className="text-xl font-black text-slate-900">六大精華地標分區</h2>
                <p className="text-xs text-slate-500 font-bold">收錄 59 間完整景點、燒肉、咖啡與體驗</p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-slate-900 text-white">
                共 6 區
              </span>
            </div>

            {/* 6 Regions Grid in Clean Color Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {TRIP_REGIONS.map((region) => (
                <RegionCard
                  key={region.id}
                  region={region}
                  favoritedSpotIds={favoritedSpotIds}
                  onOpenModal={(reg) => {
                    setSelectedRegion(reg);
                    setActiveRegionForWeather(reg);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: 記帳 (EXPENSES) ================= */}
        {activeTab === 'expenses' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div>
                <h2 className="text-xl font-black text-slate-900">長按拖曳記帳</h2>
                <p className="text-xs text-slate-500 font-bold">隨時新增修改 · 拖拉小卡排一起 · 匯率試算</p>
              </div>
            </div>

            <ExpenseTracker
              expenses={expenses}
              onUpdateExpenses={setExpenses}
              exchangeRate={exchangeRate}
              onUpdateExchangeRate={setExchangeRate}
            />
          </div>
        )}

        {/* ================= TAB 4: 住宿 (BOOKINGS) ================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div>
                <h2 className="text-xl font-black text-slate-900">住宿與機票憑證</h2>
                <p className="text-xs text-slate-500 font-bold">登機證與飯店地址（可直接給計程車司機看）</p>
              </div>
            </div>

            <BookingCard booking={INITIAL_BOOKING} />
          </div>
        )}

        {/* ================= TAB 5: 其他資訊 (INFO) ================= */}
        {activeTab === 'info' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
              <div>
                <h2 className="text-xl font-black text-slate-900">其他資訊與小幫手</h2>
                <p className="text-xs text-slate-500 font-bold">緊急救助、實用韓語、收藏店家與煙火</p>
              </div>
            </div>

            {/* Quick Action Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* SOS Emergency Modal Trigger */}
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="p-4 rounded-3xl bg-[#FFD2CC] border-2 border-slate-900 text-left shadow-[2px_2px_0px_#0f172a] hover:bg-[#FF7675] hover:text-white transition-all flex flex-col justify-between cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white border border-slate-900 flex items-center justify-center text-slate-900">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-black">SOS 救急專線</div>
                  <div className="text-[11px] font-bold opacity-80 mt-0.5">112 / 119 / 1330 翻譯</div>
                </div>
              </button>

              {/* Favorites Modal Trigger */}
              <button
                onClick={() => setIsFavoritesModalOpen(true)}
                className="p-4 rounded-3xl bg-[#FFEAA7] border-2 border-slate-900 text-left shadow-[2px_2px_0px_#0f172a] hover:bg-[#FED330] transition-all flex flex-col justify-between text-slate-900 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white border border-slate-900 flex items-center justify-center text-rose-500">
                  <Heart className="w-4 h-4 fill-rose-500" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-black">我的口袋名單</div>
                  <div className="text-[11px] font-bold text-slate-700 mt-0.5">已收藏 {favoritedSpotIds.length} 個店家</div>
                </div>
              </button>

              {/* Members Modal Trigger */}
              <button
                onClick={() => setIsMembersModalOpen(true)}
                className="p-4 rounded-3xl bg-[#D7EAFF] border-2 border-slate-900 text-left shadow-[2px_2px_0px_#0f172a] hover:bg-[#74B9FF] hover:text-white transition-all flex flex-col justify-between text-slate-900 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white border border-slate-900 flex items-center justify-center text-slate-900">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-black">4人成員檔案</div>
                  <div className="text-[11px] font-bold opacity-80 mt-0.5">歐尼 × 3、歐巴 × 1</div>
                </div>
              </button>

              {/* View Itinerary on Homepage */}
              <button
                onClick={() => {
                  setActiveTab('home');
                }}
                className="p-4 rounded-3xl bg-[#D1F7EA] border-2 border-slate-900 text-left shadow-[2px_2px_0px_#0f172a] hover:bg-[#55EFC4] transition-all flex flex-col justify-between text-slate-900 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-white border border-slate-900 flex items-center justify-center text-amber-500">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="mt-3">
                  <div className="text-sm font-black">每日排程小幫手</div>
                  <div className="text-[11px] font-bold text-slate-700 mt-0.5">回首頁查看五天四夜行程</div>
                </div>
              </button>
            </div>

            {/* Quick Survival Phrases */}
            <div className="bg-white rounded-3xl p-4 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-2">
              <span className="text-xs font-black text-slate-900 block">常用韓語快速出示：</span>
              <div className="space-y-1.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-600">請問這個多少錢？</span>
                  <span className="font-black text-slate-900">이거 얼마예요?</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-600">請帶我去這個地址</span>
                  <span className="font-black text-slate-900">이 주소로 가주세요.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-600">請結帳，謝謝</span>
                  <span className="font-black text-slate-900">계산해 주세요.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation Bar (5 Tabs) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        favoritesCount={favoritedSpotIds.length}
      />

      {/* Modals & Popups */}
      <MembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
      />

      <RegionModal
        region={selectedRegion}
        isOpen={Boolean(selectedRegion)}
        onClose={() => setSelectedRegion(null)}
        favoritedSpotIds={favoritedSpotIds}
        onToggleFavorite={handleToggleFavorite}
        onAddSpotToItinerary={handleAddSpotToItinerary}
        selectedDateLabel={currentDateLabel}
      />

      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favorites={favoritedSpots}
        onToggleFavorite={handleToggleFavorite}
        onClearAll={handleClearAllFavorites}
      />

      <EmergencyGuideModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}
