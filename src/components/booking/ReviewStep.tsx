// Review step: booking summary, add-ons, payment preference, and player
// count, plus a "Bill" rail with the WhatsApp handoff CTA. There is no
// backend — the CTA opens WhatsApp with a pre-filled request; nothing here
// may imply payment has been taken or a court has been secured.

import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, Circle, Minus, Plus, Swords, type LucideIcon } from 'lucide-react';
import { ADDONS } from '../../lib/booking/catalog';
import { formatMoney } from '../../lib/booking/pricing';
import { mergeSessions } from '../../lib/booking/slots';
import type { PayMode, RailDay, Sport, Totals } from '../../lib/booking/types';
import { BookingFields } from './BookingFields';
import { ReviewBill } from './ReviewBill';

const ADDON_ICONS: Record<string, LucideIcon> = {
  swords: Swords,
  circle: Circle,
  'graduation-cap': GraduationCap,
};

const MIN_PLAYERS = 1;
const MAX_PLAYERS = 8;

interface ReviewStepProps {
  sport: Sport;
  courtName: string;
  day: RailDay;
  picks: number[];
  addonIds: string[];
  players: number;
  payMode: PayMode;
  totals: Totals;
  onAddonToggle: (id: string) => void;
  onPayModeChange: (mode: PayMode) => void;
  onPlayersChange: (players: number) => void;
  onSend: () => void;
}

export function ReviewStep({
  sport,
  courtName,
  day,
  picks,
  addonIds,
  players,
  payMode,
  totals,
  onAddonToggle,
  onPayModeChange,
  onPlayersChange,
  onSend,
}: ReviewStepProps) {
  const sessions = mergeSessions(picks);
  const reduce = useReducedMotion();
  const fadeIn = (delay: number) => (reduce ? {} : {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
  });

  return (
    <>
      <motion.h1 className="display booking-title review-title" {...fadeIn(0)}>
        Review your <span>request.</span>
      </motion.h1>

      <div className="booking-layout">
        <div>
          <motion.section className="booking-section" {...fadeIn(0.06)}>
            <div className="booking-section-head">
              <h2 className="booking-section-title">Booking summary</h2>
            </div>
            <div className="review-card">
              <BookingFields sport={sport} day={day} courtName={courtName} players={players} />
              <div className="summary-sessions">
                {sessions.map((session) => {
                  const hours = (session.end - session.start) / 60;
                  return (
                    <div className="summary-session" key={session.start}>
                      <span className="summary-session-label">{session.label}</span>
                      <span className="review-session-duration">
                        {hours} hr{hours === 1 ? '' : 's'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>

          <motion.section className="booking-section" {...fadeIn(0.13)}>
            <div className="booking-section-head">
              <h2 className="booking-section-title">Add-ons</h2>
            </div>
            <div className="addon-grid">
              {ADDONS.map((addon) => {
                const Icon = ADDON_ICONS[addon.icon];
                const selected = addonIds.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    className="addon-pick"
                    aria-pressed={selected}
                    onClick={() => onAddonToggle(addon.id)}
                  >
                    <span className="addon-pick-icon-wrap">
                      {Icon ? <Icon className="addon-pick-icon" strokeWidth={1.75} /> : null}
                    </span>
                    <span className="addon-pick-body">
                      <span className="addon-pick-name">{addon.name}</span>
                      <span className="addon-pick-note">{addon.note}</span>
                    </span>
                    <span className="addon-pick-price">{formatMoney(addon.price)}</span>
                  </button>
                );
              })}
            </div>
          </motion.section>

          <motion.section className="booking-section" {...fadeIn(0.2)}>
            <div className="booking-section-head">
              <h2 className="booking-section-title">Payment preference</h2>
            </div>
            <div className="review-note">Nothing is charged now — we'll confirm on WhatsApp.</div>
            <div className="payment-grid">
              <button
                type="button"
                className="payment-pick"
                aria-pressed={payMode === 'full'}
                onClick={() => onPayModeChange('full')}
              >
                <span className="payment-pick-name">Pay in full</span>
                <span className="payment-pick-amount">{formatMoney(totals.total)}</span>
                <span className="payment-pick-note">Settle the full amount when you arrive.</span>
              </button>
              <button
                type="button"
                className="payment-pick"
                aria-pressed={payMode === 'advance'}
                onClick={() => onPayModeChange('advance')}
              >
                <span className="payment-pick-name">Pay 25% to reserve</span>
                <span className="payment-pick-amount">{formatMoney(totals.advance)}</span>
                <span className="payment-pick-note">
                  Balance {formatMoney(totals.balance)} at the court.
                </span>
              </button>
            </div>
          </motion.section>

          <motion.section className="booking-section" {...fadeIn(0.27)}>
            <div className="booking-section-head">
              <h2 className="booking-section-title">Who's playing</h2>
            </div>
            <div className="stepper">
              <button
                type="button"
                className="stepper-btn"
                aria-label="Decrease players"
                disabled={players <= MIN_PLAYERS}
                onClick={() => onPlayersChange(Math.max(MIN_PLAYERS, players - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="stepper-value">{players}</span>
              <button
                type="button"
                className="stepper-btn"
                aria-label="Increase players"
                disabled={players >= MAX_PLAYERS}
                onClick={() => onPlayersChange(Math.min(MAX_PLAYERS, players + 1))}
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="review-note">Player count helps us set up the court.</div>
          </motion.section>
        </div>

        <motion.div {...fadeIn(0.1)}>
          <ReviewBill totals={totals} addonIds={addonIds} onSend={onSend} />
        </motion.div>
      </div>
    </>
  );
}
