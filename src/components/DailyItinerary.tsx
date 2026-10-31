import React, { useState } from 'react';
import {
  Plus,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  MapPin,
  ExternalLink,
  Compass,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { DAILY_WEATHER_DATA, TRIP_REGIONS } from '../data/tripData';
import { Region, ItineraryItem } from '../types';

interface DailyItineraryProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onOpenRegionModal: (region: Region) => void;
  onGoToRegionsTab: () => void;
  customItineraries: Record<string, ItineraryItem[]>;
  onUpdateItinerary: (date: string, items: ItineraryItem[]) => void;
}

export const DailyItinerary: React.FC<DailyItineraryProps> = ({
  selectedDate,
  onSelectDate,
  onOpenRegionModal,
  onGoToRegionsTab,
  customItineraries,
  onUpdateItinerary,
}) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [customNote, setCustomNote] = useState('');

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const items = customItineraries[selectedDate] || [];

  const daysInfo = [
    { date: '2026-12-29', dayNumber: 'Day 1', label: '12/29 (一)' },
    { date: '2026-12-30', dayNumber: 'Day 2', label: '12/30 (二)' },
    { date: '2026-12-31', dayNumber: 'Day 3', label: '12/31 (三)' },
    { date: '2027-01-01', dayNumber: 'Day 4', label: '1/1 (四)' },
    { date: '2027-01-02', dayNumber: 'Day 5', label: '1/2 (五)' },
  ];

  const currentDayInfo = daysInfo.find((d) => d.date === selectedDate) || daysInfo[0];

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customTitle.trim()) return;

    const newItem: ItineraryItem = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      time: customTime.trim() || undefined,
      note: customNote.trim() || undefined,
    };

    onUpdateItinerary(selectedDate, [...items, newItem]);
    setCustomTitle('');
    setCustomTime('');
    setCustomNote('');
    setShowCustomForm(false);
    setShowAddMenu(false);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    onUpdateItinerary(selectedDate, updated);
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    onUpdateItinerary(selectedDate, reordered);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    onUpdateItinerary(selectedDate, reordered);
    setDraggedIndex(null);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-4">
      {/* Header & Date Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFEAA7] border border-slate-900 text-slate-900">
            每日行程建議
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            {currentDayInfo.dayNumber} · {currentDayInfo.label}
          </h2>
        </div>

        {/* Date Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {daysInfo.map((d) => (
            <button
              key={d.date}
              onClick={() => onSelectDate(d.date)}
              className={`px-3 py-1 text-xs font-black rounded-xl transition-all shrink-0 cursor-pointer ${
                d.date === selectedDate
                  ? 'bg-[#FF7675] text-white border-2 border-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Action Row: Small Add Button (+) */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500">
          {items.length === 0 ? '尚未加入任何行程' : `共 ${items.length} 個行程項目（可上下長按排序）`}
        </span>

        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFEAA7] hover:bg-[#FED330] border-2 border-slate-900 text-slate-900 text-xs font-black shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新增行程</span>
        </button>
      </div>

      {/* Add Options Menu (Dropdown/Popover) */}
      {showAddMenu && (
        <div className="p-3.5 rounded-2xl bg-[#FDFBF7] border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] space-y-2.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900">選擇新增方式：</span>
            <button
              onClick={() => setShowAddMenu(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Jump to Regions to pick spots */}
            <button
              onClick={() => {
                setShowAddMenu(false);
                onGoToRegionsTab();
              }}
              className="p-3 rounded-xl bg-white border border-slate-900 hover:bg-[#FFEAA7] text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span>至「地區」選景點</span>
                </div>
                <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                  從 6 大分區 59 個店家一鍵加入
                </div>
              </div>
              <Plus className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </button>

            {/* Manual custom input */}
            <button
              onClick={() => setShowCustomForm(true)}
              className="p-3 rounded-xl bg-white border border-slate-900 hover:bg-[#D7EAFF] text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5 text-sky-500" />
                  <span>自行輸入行程</span>
                </div>
                <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                  自訂時間、飯店退房或自由逛街
                </div>
              </div>
              <Plus className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            </button>
          </div>

          {/* Inline Custom Form */}
          {showCustomForm && (
            <form onSubmit={handleAddItem} className="pt-2 border-t border-slate-200 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="時間 (如 14:00)"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold bg-white focus:outline-hidden focus:border-slate-900"
                />
                <input
                  type="text"
                  required
                  placeholder="行程名稱 (必填)"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="col-span-2 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white focus:outline-hidden focus:border-slate-900"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="備註說明 (選填)"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:outline-hidden focus:border-slate-900"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  確認新增
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Itinerary Items List - Reorderable */}
      <div className="space-y-2.5">
        {items.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 space-y-2">
            <p className="text-xs font-bold text-slate-500">
              目前 {currentDayInfo.label} 尚未新增任何行程小卡
            </p>
            <p className="text-[11px] text-slate-400">
              點選上方「＋ 新增行程」或切換到下方「地區」點選景點加入！
            </p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                draggedIndex === idx
                  ? 'opacity-40 border-dashed border-slate-900 bg-slate-100'
                  : 'bg-[#FDFBF7] border-slate-900 shadow-[1.5px_1.5px_0px_#0f172a]'
              }`}
            >
              {/* Left Handle & Time & Title */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* Drag Handle Icon for Desktop & Mobile */}
                <div
                  className="p-1 rounded text-slate-400 hover:text-slate-800 cursor-grab active:cursor-grabbing shrink-0"
                  title="長按上下拖曳排序"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Time Badge */}
                {item.time ? (
                  <span className="px-2 py-0.5 rounded-md bg-[#FFEAA7] border border-slate-900 text-xs font-black font-mono shrink-0">
                    {item.time}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-400 shrink-0">
                    待定
                  </span>
                )}

                {/* Title & Tag */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                      {item.title}
                    </span>
                    {item.regionName && (
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 shrink-0">
                        {item.regionName}
                      </span>
                    )}
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Controls: Up / Down Reorder + Map + Delete */}
              <div className="flex items-center gap-1 shrink-0">
                {/* 1-Tap Up arrow */}
                <button
                  onClick={() => handleMoveItem(idx, 'up')}
                  disabled={idx === 0}
                  className="w-6 h-6 rounded-md bg-white border border-slate-300 hover:border-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-700 cursor-pointer"
                  title="向上移動"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>

                {/* 1-Tap Down arrow */}
                <button
                  onClick={() => handleMoveItem(idx, 'down')}
                  disabled={idx === items.length - 1}
                  className="w-6 h-6 rounded-md bg-white border border-slate-300 hover:border-slate-800 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-slate-700 cursor-pointer"
                  title="向下移動"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Google Maps link if available */}
                {item.googleMapUrl && (
                  <a
                    href={item.googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded-md bg-white border border-slate-300 hover:border-slate-800 flex items-center justify-center text-slate-700"
                    title="開啟 Google 地圖"
                  >
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  </a>
                )}

                {/* Delete button */}
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="w-6 h-6 rounded-md bg-white border border-slate-300 hover:bg-rose-50 hover:border-rose-400 text-slate-400 hover:text-rose-600 flex items-center justify-center cursor-pointer transition-colors"
                  title="刪除項目"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Linked Regions Shortcuts at bottom */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-black text-slate-500 shrink-0">探索分區加入：</span>
        {TRIP_REGIONS.map((reg) => (
          <button
            key={reg.id}
            onClick={() => onOpenRegionModal(reg)}
            className="px-2.5 py-1 rounded-xl bg-white border border-slate-900 text-xs font-black hover:bg-slate-50 text-slate-900 flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>{reg.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
