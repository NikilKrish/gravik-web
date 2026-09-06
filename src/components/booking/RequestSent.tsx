// The 'done' step: confirms the WhatsApp message was opened, not that a
// booking is confirmed. Nothing here may claim payment or a secured court —
// a human at GRAVIK still has to confirm on WhatsApp.

import { motion } from 'framer-motion';
import { useMotionEnabled } from '@/lib/motion';
import { bookingEnter } from './BookingMotion';
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
  const enabled = useMotionEnabled();
  const fadeIn = (delay: number) => bookingEnter(enabled, delay);

  return (
    <div className="request-sent">
      <motion.div
        className="request-sent-icon"
        initial={enabled ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={enabled ? { duration: 0.45, ease: 'easeOut' } : { duration: 0 }}
        style={!enabled ? { opacity: 1, transform: 'none' } : undefined}
      >
        <Check size={28} />
      </motion.div>
      <motion.div className="eyebrow request-sent-eyebrow" {...fadeIn(0.12)}>Request sent</motion.div>
      <motion.h1 tabIndex={-1} className="display booking-title request-sent-title" {...fadeIn(0.18)}>
        Almost <span>there.</span>
      </motion.h1>
      <motion.p className="request-sent-body" {...fadeIn(0.24)}>
        Your request is on its way to us on WhatsApp. We'll confirm your court and time there.
      </motion.p>

      <motion.div className="request-sent-card" {...fadeIn(0.32)}>
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
      </motion.div>

      <motion.div className="request-sent-actions" {...fadeIn(0.4)}>
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
      </motion.div>
    </div>
  );
}
