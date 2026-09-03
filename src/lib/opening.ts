// 6 September 2026, local time, at 00:00. Constructed via the numeric
// constructor (not an ISO string) so it is unambiguous in local time and
// does not shift with the reader's timezone.
export const OPENING_DATE = new Date(2026, 8, 6);

export const OPENING_LABEL = '6 Sept 2026';

export function hasOpened(now: Date = new Date()): boolean {
  return now >= OPENING_DATE;
}
