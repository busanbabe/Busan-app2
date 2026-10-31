export type MemberId = 'jessie' | 'jase' | 'jewel' | 'kay';

export interface Member {
  id: MemberId;
  name: string;
  koreanName: string;
  role: string;
  gender: 'female' | 'male';
  tripType: '5D4N' | '3D2N';
  badge: string;
  tagline: string;
  responsibilities: string[];
  favoriteFood: string;
  color: string; // macaron accent color
  bgLight: string;
  avatarSeed: string;
}

export type SpotCategory = 'gourmet' | 'cafe' | 'sightseeing' | 'shopping' | 'activity';

export interface Spot {
  id: string;
  regionId: string;
  name: string;
  koreanName?: string;
  category: SpotCategory;
  categoryLabel: string;
  description: string;
  highlightTip?: string;
  address?: string;
  googleMapUrl: string;
  naverMapUrl?: string;
}

export interface Region {
  id: string;
  code: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  name: string;
  koreanName: string;
  tagline: string;
  spotsCount: number;
  badgeColor: string;
  accentBg: string;
  accentText: string;
  coverImage?: string;
  microClimateTip: string;
  spots: Spot[];
}

export interface DailyWeather {
  date: string; // '2026-12-29'
  displayDate: string; // '12/29 (一)'
  dayLabel: string; // 'Day 1'
  theme: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  weatherCode: number;
  icon: string;
  clothingTip: string;
  precipitation: number;
  windSpeed: number;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number; // in KRW
  currency: 'KRW' | 'TWD';
  payer: MemberId;
  category: 'food' | 'transport' | 'hotel' | 'shopping' | 'ticket' | 'other';
  date: string;
  splitWith: MemberId[]; // all 4 or subset
  note?: string;
}

export interface ItineraryItem {
  id: string;
  time?: string;
  title: string;
  regionId?: string;
  regionName?: string;
  spotId?: string;
  category?: string;
  address?: string;
  googleMapUrl?: string;
  note?: string;
}

export interface BookingInfo {
  flight: {
    airline: string;
    flightNumber: string;
    route: string;
    departureTime: string;
    arrivalTime: string;
    terminal: string;
    gate: string;
    seat: string;
    bookingRef: string;
    passengers: string;
  };
  returnFlight: {
    airline: string;
    flightNumber: string;
    route: string;
    departureTime: string;
    arrivalTime: string;
    terminal: string;
    gate: string;
    bookingRef: string;
  };
  hotel: {
    name: string;
    koreanName: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    address: string;
    koreanAddress: string;
    phone: string;
    confirmationCode: string;
    googleMapUrl: string;
    amenities: string[];
  };
}
