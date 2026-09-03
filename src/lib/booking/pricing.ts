// Flat-rate pricing math. No peak/off-peak logic — price is constant
// per sport at every hour.

import type { Sport, Totals } from './types';
import { ADDONS, SLOT_MINUTES } from './catalog';

export function formatMoney(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function computeTotals(
  sport: Sport,
  picks: number[],
  addonIds: string[],
): Totals {
  const hours = (picks.length * SLOT_MINUTES) / 60;
  const slotTotal = sport.base * hours;
  const listTotal = sport.list * hours;

  const addonTotal = addonIds.reduce((sum, id) => {
    const addon = ADDONS.find((a) => a.id === id);
    return addon ? sum + addon.price : sum;
  }, 0);

  const total = slotTotal + addonTotal;
  const savings = listTotal - slotTotal;
  const offPercent = listTotal > 0 ? Math.round((savings / listTotal) * 100) : 0;
  const advance = Math.round(total * 0.25);
  const balance = total - advance;

  return {
    hours,
    slotTotal,
    listTotal,
    addonTotal,
    total,
    savings,
    offPercent,
    advance,
    balance,
  };
}
