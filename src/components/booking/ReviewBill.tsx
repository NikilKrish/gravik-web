// The "Bill" rail on the review step: subtotal, savings, add-on lines,
// total, and the WhatsApp handoff CTA. window.open must fire synchronously
// in the click handler passed as onSend, or popup blockers intercept it.

import { MessageCircle } from 'lucide-react';
import { AnimatedNumber } from '@/components/motion';
import { BookingRow, BookingRows } from './BookingMotion';
import { ADDONS } from '../../lib/booking/catalog';
import { formatMoney } from '../../lib/booking/pricing';
import type { Totals } from '../../lib/booking/types';

interface ReviewBillProps {
  totals: Totals;
  addonIds: string[];
  onSend: () => void;
}

export function ReviewBill({ totals, addonIds, onSend }: ReviewBillProps) {
  const selectedAddons = addonIds
    .map((id) => ADDONS.find((a) => a.id === id))
    .filter((a): a is (typeof ADDONS)[number] => Boolean(a));

  return (
    <aside className="summary-rail" aria-label="Bill">
      <h2 className="summary-heading">Bill</h2>

      <div className="summary-totals">
        <div className="summary-row">
          <span>Subtotal</span>
          <AnimatedNumber value={totals.slotTotal} format={formatMoney} />
        </div>
        {totals.savings > 0 ? (
          <div className="summary-row savings">
            <span>
              You save {formatMoney(totals.savings)} ({totals.offPercent}% off)
            </span>
          </div>
        ) : null}
        <BookingRows>{selectedAddons.map((addon) => (
          <BookingRow className="summary-row" key={addon.id}>
            <span>{addon.name}</span>
            <span>{formatMoney(addon.price)}</span>
          </BookingRow>
        ))}</BookingRows>
        <div className="summary-row total">
          <span>Total</span>
          <AnimatedNumber value={totals.total} format={formatMoney} />
        </div>
      </div>

      <button type="button" className="button clay summary-cta" onClick={onSend}>
        <MessageCircle size={14} /> Send request on WhatsApp
      </button>

      <div className="review-note review-note-center">
        Opens WhatsApp with your request filled in.
      </div>
    </aside>
  );
}
