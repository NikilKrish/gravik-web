// Static booking catalog data and constants: slot/session sizing, opening
// hours, the WhatsApp contact number, sports, add-ons, and dayparts.
// Flat pricing only: no peak/off-peak logic anywhere in this module.

import type { Addon, Daypart, Sport, SportId } from './types';

export const SLOT_MINUTES = 60;
export const MAX_SLOTS = 4;
export const OPEN_FROM = 6 * 60;
export const OPEN_TO = 24 * 60;
export const WHATSAPP_NUMBER = '916385515521';

export const SPORTS: Sport[] = [
  {
    id: 'pickleball',
    name: 'Pickleball',
    icon: 'circle-dot',
    base: 750,
    list: 1000,
    courtWord: 'Court',
    courts: ['Court 1', 'Court 2', 'Court 3'],
  },
  {
    id: 'cricket',
    name: 'Cricket Nets',
    icon: 'target',
    base: 500,
    list: 700,
    courtWord: 'Net',
    courts: ['Net 1'],
  },
];

export const DAYPARTS: Daypart[] = [
  { name: 'Morning', icon: 'sunrise', from: 6 * 60, to: 12 * 60 },
  { name: 'Afternoon', icon: 'sun', from: 12 * 60, to: 16 * 60 },
  { name: 'Evening', icon: 'sunset', from: 16 * 60, to: 21 * 60 },
  { name: 'Night', icon: 'moon', from: 21 * 60, to: 24 * 60 },
];

export const ADDONS: Addon[] = [
  {
    id: 'paddles',
    name: 'Paddle rental',
    note: 'Two match-grade paddles',
    price: 150,
    icon: 'swords',
  },
  {
    id: 'balls',
    name: 'Ball set',
    note: 'Three outdoor balls, yours to keep',
    price: 200,
    icon: 'circle',
  },
  {
    id: 'coach',
    name: 'Coach on court',
    note: '30 minutes of drills',
    price: 600,
    icon: 'graduation-cap',
  },
];

export function getSport(id: SportId): Sport {
  const sport = SPORTS.find((s) => s.id === id);
  if (!sport) {
    throw new Error(`Unknown sport id: ${id}`);
  }
  return sport;
}

export function getCourtName(sport: Sport, index: number): string {
  return sport.courts[index] ?? sport.courts[0];
}
