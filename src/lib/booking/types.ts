// Pure type definitions for the booking domain. No React, no DOM.

export type SportId = 'pickleball' | 'cricket';

export interface Sport {
  id: SportId;
  name: string;
  icon: string;
  /** Price actually charged, per hour. */
  base: number;
  /** Reference list price per hour, shown struck through for the savings comparison. */
  list: number;
  courtWord: string;
  courts: string[];
}

export interface Addon {
  id: string;
  name: string;
  note: string;
  price: number;
  icon: string;
}

export interface Daypart {
  name: string;
  icon: string;
  /** Minutes from midnight, inclusive start. */
  from: number;
  /** Minutes from midnight, exclusive end. */
  to: number;
}

export interface RailDay {
  date: Date;
  dow: string;
  dayNum: number;
  month: string;
  isToday: boolean;
  /** Stable YYYY-MM-DD key built from local date parts. */
  key: string;
}

export type PayMode = 'full' | 'advance';

export interface Totals {
  hours: number;
  slotTotal: number;
  listTotal: number;
  addonTotal: number;
  total: number;
  savings: number;
  offPercent: number;
  advance: number;
  balance: number;
}

export interface BookingSelection {
  sport: SportId;
  courtIndex: number;
  day: RailDay;
  /** Selected slot start minutes (from midnight). */
  picks: number[];
  addonIds: string[];
  players: number;
  payMode: PayMode;
}
