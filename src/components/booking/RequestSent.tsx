// The 'done' step: confirms the WhatsApp message was opened, not that a
// booking is confirmed. Nothing here may claim payment or a secured court —
// a human at GRAVIK still has to confirm on WhatsApp.

import { Check } from 'lucide-react';
import { Link } from 'wouter';
import { ADDONS } from '../../lib/booking/catalog';
import { formatMoney } from '../../lib/booking/pricing';
import { mergeSessions } from '../../lib/booking/slots';
import type { BookingSelection, RailDay, Sport, Totals } from '../../lib/booking/types';
import { BookingFields } from './BookingFields';

interface RequestSentProps {
  sport: Sport;
  courtName: string;
  day: RailDay;
  picks: number[];
  players: number;
  addonIds: string[];
  totals: Totals;
  selection: BookingSelection;
  onReopenWhatsApp: (selection: BookingSelection) => void;
}

export function RequestSent({
  sport,
  courtName,
  day,
  picks,
  players,
  addonIds,
  totals,
  selection,
  onReopenWhatsApp,
}: RequestSentProps) {
  const sessions = mergeSessions(picks);
  const selectedAddons = addonIds
    .map((id) => ADDONS.find((a) => a.id === id))
    .filter((a): a is (typeof ADDONS)[number] => Boolean(a));

  return (
    <div className="request-sent">
      <div className="request-sent-icon">
        <Check size={28} strokeWidth={2.25} />
      </div>
      <div className="eyebrow request-sent-eyebrow">Request sent</div>
      <h1 className="display booking-title request-sent-title">
        Almost <span>there.</span>
      </h1>
      <p className="request-sent-body">
        Your request is on its way to us on WhatsApp. We'll confirm your court and time there.
      </p>

      <div className="request-sent-card">
        <div className="request-sent-chip">Awaiting confirmation</div>
        <BookingFields sport={sport} day={day} courtName={courtName} players={players} />

        <div className="summary-sessions">
          {sessions.map((session) => (
            <div className="summary-session" key={session.start}>
              <span className="summary-session-label">{session.label}</span>
            </div>
          ))}
        </div>

        {selectedAddons.length > 0 ? (
          <div className="summary-totals request-sent-addons">
            {selectedAddons.map((addon) => (
              <div className="summary-row" key={addon.id}>
                <span>{addon.name}</span>
                <span>{formatMoney(addon.price)}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="summary-totals">
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatMoney(totals.total)}</span>
          </div>
        </div>
      </div>

      <div className="request-sent-actions">
        <button
          type="button"
          className="button bone"
          onClick={() => onReopenWhatsApp(selection)}
        >
          Open WhatsApp again
        </button>
        <Link href="/" className="button">
          Back home
        </Link>
      </div>
    </div>
  );
}
