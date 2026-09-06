// Right-hand session summary: merged sessions, running totals, and the
// continue CTA. No add-ons/players/review UI here — that lands next task.

import { ArrowRight, ShieldCheck, X } from 'lucide-react';
import { AnimatedNumber } from '@/components/motion';
import { BookingRow, BookingRows } from './BookingMotion';
import { formatMoney } from '../../lib/booking/pricing';
import { formatFullDate, mergeSessions, toggleSlot } from '../../lib/booking/slots';
import type { RailDay, Sport, Totals } from '../../lib/booking/types';

interface SummaryRailProps {
  sport: Sport;
  courtName: string;
  day: RailDay;
  picks: number[];
  totals: Totals;
  onPicksChange: (picks: number[]) => void;
  onContinue: () => void;
}

export function SummaryRail({
  sport,
  courtName,
  day,
  picks,
  totals,
  onPicksChange,
  onContinue,
}: SummaryRailProps) {
  const sessions = mergeSessions(picks);
  const hasPicks = picks.length > 0;

  const removeSession = (session: { start: number; end: number }) => {
    let next = picks;
    for (const start of picks) {
      if (start >= session.start && start < session.end) {
        next = toggleSlot(next, start);
      }
    }
    onPicksChange(next);
  };

  return (
    <aside className="summary-rail" aria-label="Your session">
      <h2 className="summary-heading">Your session</h2>
      <h3 className="display summary-sport">{sport.name}</h3>
      <div className="summary-context">
        {courtName} · {formatFullDate(day.date)}
      </div>

        <div className="summary-sessions">
          <BookingRows>{sessions.map((session) => (
            <BookingRow className="summary-session" key={session.start}>
              <span className="summary-session-label">{session.label}</span>
              <button
                type="button"
                className="summary-session-remove"
                aria-label={`Remove ${session.label} session`}
                onClick={() => removeSession(session)}
              >
                <X size={14} />
              </button>
            </BookingRow>
          ))}
          {!hasPicks ? <BookingRow className="summary-empty" key="empty">
            Nothing picked yet. Tap a time — consecutive slots merge into one session.
          </BookingRow> : null}
          </BookingRows>
        </div>

      {hasPicks ? (
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
          <div className="summary-row total">
            <span>Total</span>
            <AnimatedNumber value={totals.total} format={formatMoney} />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="button clay summary-cta"
        disabled={!hasPicks}
        onClick={onContinue}
      >
        Continue to review <ArrowRight size={14} />
      </button>

      <div className="summary-reassure">
        <ShieldCheck size={16} />
        <span>We'll confirm your slot on WhatsApp.</span>
      </div>
    </aside>
  );
}
