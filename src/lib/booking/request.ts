// Builds the WhatsApp handoff message. There is no backend: this text is
// what the customer sends, and the booking is only confirmed once a human
// replies on WhatsApp. Wording here must never imply payment has been
// taken or a court has been confirmed.

import { ADDONS, getCourtName, getSport, WHATSAPP_NUMBER } from './catalog';
import { computeTotals, formatMoney } from './pricing';
import { formatFullDate, slotLabel } from './slots';
import type { BookingSelection } from './types';

export function buildRequestSummary(selection: BookingSelection): string {
  const sport = getSport(selection.sport);
  const court = getCourtName(sport, selection.courtIndex);
  const totals = computeTotals(sport, selection.picks, selection.addonIds);

  const sortedPicks = [...selection.picks].sort((a, b) => a - b);
  const timeLine = sortedPicks.map((start) => slotLabel(start)).join(', ');

  const addonNames = selection.addonIds
    .map((id) => ADDONS.find((a) => a.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  const paymentLine =
    selection.payMode === 'full'
      ? 'Pay in full on arrival'
      : `Pay 25% (${formatMoney(totals.advance)}) to reserve, balance ${formatMoney(
          totals.balance,
        )} at the court`;

  const lines: string[] = [
    "Hi GRAVIK, I'd like to request a booking.",
    '',
    `Sport: ${sport.name}`,
    `Court: ${court}`,
    `Date: ${formatFullDate(selection.day.date)}`,
    `Time: ${timeLine}`,
    `Players: ${selection.players}`,
  ];

  if (addonNames.length > 0) {
    lines.push(`Add-ons: ${addonNames.join(', ')}`);
  }

  lines.push(`Total: ${formatMoney(totals.total)}`);
  lines.push(`Payment: ${paymentLine}`);
  lines.push('');
  lines.push('Please confirm availability. Thanks!');

  return lines.join('\n');
}

export function buildWhatsAppUrl(selection: BookingSelection): string {
  const summary = buildRequestSummary(selection);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(summary)}`;
}
