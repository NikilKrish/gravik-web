// Time formatting and slot/day-rail generation. Pure functions only.
// There is no availability data: every slot within opening hours is
// selectable. Do not add unavailability, hashing, or past-time blocking here.

import { hasOpened, OPENING_DATE } from '../opening';
import type { Daypart, RailDay } from './types';
import { MAX_SLOTS, OPEN_FROM, OPEN_TO, SLOT_MINUTES } from './catalog';

export const DOW_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Formats a minutes-from-midnight value as a 12-hour, lowercase-meridiem
 * time label, omitting the minutes when they are zero. 1440 (midnight,
 * end of day) renders as '12am', matching 0.
 */
export function formatTime(minutes: number): string {
  const totalMinutes = ((minutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const meridiem = hour24 < 12 ? 'am' : 'pm';
  let hour12 = hour24 % 12;
  if (hour12 === 0) hour12 = 12;
  const minutePart = mins === 0 ? '' : `:${String(mins).padStart(2, '0')}`;
  return `${hour12}${minutePart}${meridiem}`;
}

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Builds `count` consecutive RailDay entries starting today (if the
 * facility has opened) or at OPENING_DATE (if it has not — we must not
 * offer dates before the facility is open).
 */
export function buildDayRail(now: Date = new Date(), count = 10): RailDay[] {
  const start = hasOpened(now)
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
    : new Date(
        OPENING_DATE.getFullYear(),
        OPENING_DATE.getMonth(),
        OPENING_DATE.getDate(),
      );

  const days: RailDay[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    days.push({
      date,
      dow: DOW_NAMES[date.getDay()],
      dayNum: date.getDate(),
      month: MONTH_NAMES[date.getMonth()],
      isToday: isSameCalendarDay(date, now),
      key: localDateKey(date),
    });
  }
  return days;
}

/**
 * Slot start minutes (from midnight) within a daypart, clamped to opening
 * hours and stepped by SLOT_MINUTES. Every slot returned is available —
 * there is no availability filter.
 */
export function daypartSlots(daypart: Daypart): number[] {
  const from = Math.max(daypart.from, OPEN_FROM);
  const to = Math.min(daypart.to, OPEN_TO);
  const slots: number[] = [];
  for (let start = from; start < to; start += SLOT_MINUTES) {
    slots.push(start);
  }
  return slots;
}

/** '6am – 7am' style label for a slot starting at startMinutes. */
export function slotLabel(startMinutes: number): string {
  return `${formatTime(startMinutes)} – ${formatTime(startMinutes + SLOT_MINUTES)}`;
}

/** 'Sat, 12 Sep 2026' style full date label. */
export function formatFullDate(date: Date): string {
  const dow = DOW_NAMES[date.getDay()];
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${dow}, ${day} ${month} ${year}`;
}

/**
 * Toggles a slot's start time in `picks`, enforcing the MAX_SLOTS cap here
 * in the domain layer (rather than leaving it to the UI, since more than
 * one page consumes this module). Always returns a new array — the input
 * is never mutated. Deselecting an already-picked slot always succeeds;
 * selecting a new one is refused once the cap is reached.
 */
export function toggleSlot(picks: number[], startMinutes: number): number[] {
  if (picks.includes(startMinutes)) {
    return picks.filter((p) => p !== startMinutes);
  }
  if (picks.length >= MAX_SLOTS) {
    return picks;
  }
  return [...picks, startMinutes].sort((a, b) => a - b);
}

/** Whether another slot can be added without exceeding MAX_SLOTS. */
export function canAddSlot(picks: number[]): boolean {
  return picks.length < MAX_SLOTS;
}

/**
 * Merges consecutive selected slots (each SLOT_MINUTES long) into
 * contiguous sessions. Input may be unsorted; it is sorted defensively
 * and never mutated. Non-adjacent picks stay as separate sessions.
 */
export function mergeSessions(
  picks: number[],
): Array<{ start: number; end: number; label: string }> {
  if (picks.length === 0) return [];

  const sorted = [...picks].sort((a, b) => a - b);
  const sessions: Array<{ start: number; end: number; label: string }> = [];

  let start = sorted[0];
  let end = start + SLOT_MINUTES;

  for (let i = 1; i < sorted.length; i++) {
    const slotStart = sorted[i];
    if (slotStart === end) {
      end = slotStart + SLOT_MINUTES;
    } else {
      sessions.push({ start, end, label: `${formatTime(start)} – ${formatTime(end)}` });
      start = slotStart;
      end = start + SLOT_MINUTES;
    }
  }
  sessions.push({ start, end, label: `${formatTime(start)} – ${formatTime(end)}` });

  return sessions;
}
