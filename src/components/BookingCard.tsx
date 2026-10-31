import React, { useState } from 'react';
import { Plane, Building, MapPin, Copy, Check, ExternalLink, Clock, Phone, KeyRound } from 'lucide-react';
import { BookingInfo } from '../types';

interface BookingCardProps {
  booking: BookingInfo;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const [activeFlightTab, setActiveFlightTab] = useState<'depart' | 'return'>('depart');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyKoreanAddress = () => {
    navigator.clipboard.writeText(booking.hotel.koreanAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const flight = activeFlightTab === 'depart' ? booking.flight : booking.returnFlight;

  return (
    <div className="space-y-4">
      {/* Flight Boarding Pass */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] overflow-hidden">
        {/* Top Header Block */}
        <div className="bg-[#FF7675] p-4 text-white flex items-center justify-between border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center font-black">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider block text-white/90">
                機票登機證
              </span>
              <span className="text-sm font-black text-slate-900">{flight.airline}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/20 p-1 rounded-xl">
            <button
              onClick={() => setActiveFlightTab('depart')}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                activeFlightTab === 'depart'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              去程
            </button>
            <button
              onClick={() => setActiveFlightTab('return')}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                activeFlightTab === 'return'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              回程
            </button>
          </div>
        </div>

        {/* Airport Route */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                {activeFlightTab === 'depart' ? 'TPE' : 'PUS'}
              </span>
              <span className="text-xs text-slate-500 font-bold block">
                {activeFlightTab === 'depart' ? '台北桃園' : '釜山金海'}
              </span>
            </div>

            <div className="flex flex-col items-center px-4">
              <span className="text-xs font-black text-slate-900 font-mono">
                {flight.flightNumber}
              </span>
              <div className="w-20 sm:w-28 flex items-center gap-1 my-1">
                <div className="h-0.5 flex-1 bg-slate-300" />
                <Plane className="w-3.5 h-3.5 text-slate-900 transform rotate-90" />
                <div className="h-0.5 flex-1 bg-slate-300" />
              </div>
              <span className="text-[10px] text-slate-400 font-bold">約 2h 15m</span>
            </div>

            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight">
                {activeFlightTab === 'depart' ? 'PUS' : 'TPE'}
              </span>
              <span className="text-xs text-slate-500 font-bold block">
                {activeFlightTab === 'depart' ? '釜山金海' : '台北桃園'}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FDFBF7] p-3 rounded-2xl border-2 border-slate-900 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">起飛</span>
              <span className="font-black text-slate-900 font-mono">{flight.departureTime}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">抵達</span>
              <span className="font-black text-slate-900 font-mono">{flight.arrivalTime}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">登機門/航廈</span>
              <span className="font-black text-slate-900">{flight.gate} / {flight.terminal}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">訂位代號</span>
              <span className="font-black text-rose-600 font-mono">{flight.bookingRef}</span>
            </div>
          </div>

          {activeFlightTab === 'depart' && (
            <div className="text-[11px] text-slate-700 font-bold bg-[#FFEAA7] p-2.5 rounded-xl border border-slate-900">
              成員：{booking.flight.passengers}
            </div>
          )}
        </div>
      </div>

      {/* Hotel Reservation Card */}
      <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-[2px_2px_0px_#0f172a] overflow-hidden">
        {/* Top Header Block */}
        <div className="bg-[#FED330] p-4 text-slate-900 flex items-center justify-between border-b-2 border-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider block text-slate-800">
                飯店住宿資訊
              </span>
              <span className="text-sm font-black">{booking.hotel.name}</span>
            </div>
          </div>

          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-900 text-white">
            4 晚連住
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {booking.hotel.name}
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                {booking.hotel.koreanName} · {booking.hotel.roomType}
              </p>
            </div>
          </div>

          {/* Check-in / Out Grid */}
          <div className="grid grid-cols-2 gap-2 bg-[#FDFBF7] p-3 rounded-2xl border-2 border-slate-900 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">入住 Check-in</span>
              <span className="font-black text-slate-900">{booking.hotel.checkIn}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">退房 Check-out</span>
              <span className="font-black text-slate-900">{booking.hotel.checkOut}</span>
            </div>
          </div>

          {/* Korean Address Box with 1-Click Copy */}
          <div className="p-3.5 bg-[#D7EAFF] rounded-2xl border-2 border-slate-900 flex items-start justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-black text-slate-600 block">
                搭計程車直接給司機看（韓文地址）：
              </span>
              <span className="text-sm font-black text-slate-900 block mt-0.5">
                {booking.hotel.koreanAddress}
              </span>
              <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                {booking.hotel.address}
              </span>
            </div>

            <button
              onClick={copyKoreanAddress}
              className="px-3 py-1.5 rounded-xl bg-white border-2 border-slate-900 text-slate-900 font-black text-xs hover:bg-slate-50 transition-colors shrink-0 shadow-xs flex items-center gap-1"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>已複製</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>複製</span>
                </>
              )}
            </button>
          </div>

          {/* Phone & Google Maps Button */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-bold text-slate-600">
              電話：<strong className="text-slate-900">{booking.hotel.phone}</strong>
            </span>

            <a
              href={booking.hotel.googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Google Maps 導航</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
