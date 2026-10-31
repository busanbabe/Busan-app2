import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, RefreshCw, Thermometer } from 'lucide-react';
import { DAILY_WEATHER_DATA } from '../data/tripData';
import { DailyWeather } from '../types';

interface WeatherWidgetProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  selectedRegionName?: string;
  regionClimateTip?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  selectedDate,
  onSelectDate,
  selectedRegionName,
  regionClimateTip,
}) => {
  const [liveWeather, setLiveWeather] = useState<{
    temp: number;
    feelsLike: number;
    condition: string;
    windSpeed: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLiveWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=35.1796&longitude=129.0756&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FSeoul'
      );
      if (res.ok) {
        const data = await res.json();
        const cur = data.current;
        let cond = '晴朗';
        if (cur.weather_code >= 1 && cur.weather_code <= 3) cond = '多雲';
        else if (cur.weather_code >= 51) cond = '小雨';

        setLiveWeather({
          temp: Math.round(cur.temperature_2m),
          feelsLike: Math.round(cur.apparent_temperature),
          condition: cond,
          windSpeed: Math.round(cur.wind_speed_10m),
        });
      }
    } catch {
      setLiveWeather({ temp: 11, feelsLike: 9, condition: '乾冷晴', windSpeed: 14 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
  }, []);

  const currentDaily: DailyWeather =
    DAILY_WEATHER_DATA.find((d) => d.date === selectedDate) || DAILY_WEATHER_DATA[0];

  // Colors for date cards
  const cardColors = [
    { bg: 'bg-[#FFEAA7]', activeBg: 'bg-[#FED330]', border: 'border-amber-400' },
    { bg: 'bg-[#FFD2CC]', activeBg: 'bg-[#FF7675]', border: 'border-rose-400' },
    { bg: 'bg-[#E0DBFF]', activeBg: 'bg-[#A29BFE]', border: 'border-indigo-400' },
    { bg: 'bg-[#D1F7EA]', activeBg: 'bg-[#55EFC4]', border: 'border-emerald-400' },
    { bg: 'bg-[#D7EAFF]', activeBg: 'bg-[#74B9FF]', border: 'border-sky-400' },
  ];

  return (
    <div className="space-y-3">
      {/* Top micro summary row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#FFEAA7] border border-slate-900 text-slate-900">
            釜山即時氣象
          </span>
          <span className="text-xs font-bold text-slate-600">
            {liveWeather
              ? `目前 ${liveWeather.temp}°C · 體感 ${liveWeather.feelsLike}°C (${liveWeather.condition})`
              : '連線中...'}
          </span>
        </div>

        <button
          onClick={fetchLiveWeather}
          disabled={loading}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
          title="重新整理氣溫"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">即時更新</span>
        </button>
      </div>

      {/* Single Horizontal Scrollable Row for Dates & Weather */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-none pt-0.5 px-0.5">
        {DAILY_WEATHER_DATA.map((item, idx) => {
          const isSelected = item.date === selectedDate;
          const color = cardColors[idx % cardColors.length];

          return (
            <button
              key={item.date}
              onClick={() => onSelectDate(item.date)}
              className={`shrink-0 w-32 sm:w-36 p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between text-left cursor-pointer ${
                isSelected
                  ? `${color.activeBg} border-slate-900 shadow-[2px_2px_0px_#0f172a] -translate-y-0.5 text-slate-900 ring-2 ring-slate-900/20`
                  : 'bg-white border-slate-300 hover:border-slate-800 text-slate-800'
              }`}
            >
              {/* Top: Weather Icon + Condition */}
              <div className="flex items-center justify-between gap-1 w-full pb-1">
                <div className="flex items-center gap-1">
                  {item.weatherCode === 0 ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                  ) : item.weatherCode >= 50 ? (
                    <CloudRain className="w-4 h-4 text-sky-500" />
                  ) : (
                    <Cloud className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="text-[11px] font-black">{item.condition}</span>
                </div>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-black/10">
                  {item.dayLabel}
                </span>
              </div>

              {/* Center: TEMPERATURE IS THE LARGEST ELEMENT (一目了然幾度到幾度) */}
              <div className="py-2 text-center w-full">
                <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 leading-none">
                  {item.tempMin}°~{item.tempMax}°
                  <span className="text-sm font-bold ml-0.5">C</span>
                </div>
              </div>

              {/* Bottom: DATE & DAY OF WEEK UNDER THE TEMPERATURE */}
              <div className="pt-1.5 border-t border-black/10 text-center w-full">
                <div className="text-xs font-black tracking-tight text-slate-900">
                  {item.displayDate}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Clothing Advice Bar */}
      <div className="bg-white rounded-2xl p-3.5 border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#FFEAA7] border border-slate-900 flex items-center justify-center shrink-0">
            <Thermometer className="w-3.5 h-3.5 text-slate-900" />
          </div>
          <span className="font-bold text-slate-900">
            {currentDaily.displayDate} 穿搭建議：
            <span className="font-medium text-slate-700 ml-1">{currentDaily.clothingTip}</span>
          </span>
        </div>

        {selectedRegionName && regionClimateTip && (
          <div className="flex items-center gap-1.5 text-slate-600 font-medium pl-9 sm:pl-0">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
              {selectedRegionName}
            </span>
            <span className="line-clamp-1">{regionClimateTip}</span>
          </div>
        )}
      </div>
    </div>
  );
};
