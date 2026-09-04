// Left-hand booking picker: sport, date, court, and time-slot selection.
// No availability data exists — every slot in range is selectable; the
// only constraint enforced here is the MAX_SLOTS cap from the domain layer.

import { motion, useReducedMotion } from 'framer-motion';
import { CircleDot, Target, Sunrise, Sun, Sunset, Moon, type LucideIcon } from 'lucide-react';
import { formatMoney } from '../../lib/booking/pricing';
import { canAddSlot, daypartSlots, formatFullDate, formatTime } from '../../lib/booking/slots';
import { DAYPARTS, MAX_SLOTS, SPORTS } from '../../lib/booking/catalog';
import type { RailDay, Sport, SportId } from '../../lib/booking/types';

const SPORT_ICONS: Record<string, LucideIcon> = {
  'circle-dot': CircleDot,
  target: Target,
};

const DAYPART_ICONS: Record<string, LucideIcon> = {
  sunrise: Sunrise,
  sun: Sun,
  sunset: Sunset,
  moon: Moon,
};

interface SlotPickerProps {
  sport: Sport;
  rail: RailDay[];
  dayIndex: number;
  courtIndex: number;
  picks: number[];
  onSportChange: (id: SportId) => void;
  onDayChange: (index: number) => void;
  onCourtChange: (index: number) => void;
  onSlotToggle: (startMinutes: number) => void;
}

export function SlotPicker({
  sport,
  rail,
  dayIndex,
  courtIndex,
  picks,
  onSportChange,
  onDayChange,
  onCourtChange,
  onSlotToggle,
}: SlotPickerProps) {
  const canAdd = canAddSlot(picks);
  const reduce = useReducedMotion();
  const fadeIn = (delay: number) => (reduce ? {} : {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay },
  });

  return (
    <div>
      <motion.section className="booking-section" {...fadeIn(0)}>
        <div className="booking-section-head">
          <h2 className="booking-section-title">Sport</h2>
        </div>
        <div className="sport-picker">
          {SPORTS.map((s) => {
            const Icon = SPORT_ICONS[s.icon];
            const selected = s.id === sport.id;
            return (
              <button
                key={s.id}
                type="button"
                className="sport-pick"
                aria-pressed={selected}
                onClick={() => onSportChange(s.id)}
              >
                {Icon ? <Icon className="sport-pick-icon" strokeWidth={1.75} /> : null}
                <div>
                  <div className="sport-pick-name">{s.name}</div>
                  <div className="sport-pick-from">from {formatMoney(s.base)}</div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.section className="booking-section" {...fadeIn(0.08)}>
        <div className="booking-section-head">
          <h2 className="booking-section-title">Date</h2>
          <span className="booking-section-caption">Slots open 14 days ahead</span>
        </div>
        <div className="date-rail">
          {rail.map((day, index) => {
            const selected = index === dayIndex;
            return (
              <button
                key={day.key}
                type="button"
                className="date-pick"
                aria-pressed={selected}
                aria-label={formatFullDate(day.date)}
                onClick={() => onDayChange(index)}
              >
                <span className="date-pick-dow">{day.dow}</span>
                <span className="date-pick-num">{day.dayNum}</span>
                {day.isToday ? <span className="date-pick-today">Today</span> : null}
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.section className="booking-section" {...fadeIn(0.16)}>
        <div className="booking-section-head">
          <h2 className="booking-section-title">{sport.courtWord}</h2>
        </div>
        <div className="court-picker">
          {sport.courts.map((courtName, index) => {
            const selected = index === courtIndex;
            return (
              <button
                key={courtName}
                type="button"
                className="court-pick"
                aria-pressed={selected}
                onClick={() => onCourtChange(index)}
              >
                {courtName}
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.section className="booking-section" {...fadeIn(0.24)}>
        <div className="booking-section-head">
          <h2 className="booking-section-title">Time</h2>
        </div>

        <div className="slot-legend">
          <span className="slot-legend-item">
            <span className="slot-legend-swatch" /> Open
          </span>
          <span className="slot-legend-item">
            <span className="slot-legend-swatch is-selected" /> Selected
          </span>
        </div>

        {!canAdd ? (
          <div className="slot-cap-hint">Maximum {MAX_SLOTS} hours per booking.</div>
        ) : null}

        {DAYPARTS.map((daypart) => {
          const slots = daypartSlots(daypart);
          const Icon = DAYPART_ICONS[daypart.icon];
          return (
            <div className="daypart" key={daypart.name}>
              <div className="daypart-head">
                {Icon ? <Icon className="daypart-icon" strokeWidth={1.75} /> : null}
                <span className="daypart-name">{daypart.name}</span>
                <span className="daypart-count">{slots.length} slots</span>
              </div>
              <div className="slot-grid">
                {slots.map((start) => {
                  const selected = picks.includes(start);
                  const disabled = !selected && !canAdd;
                  return (
                    <button
                      key={start}
                      type="button"
                      className="slot-pick"
                      aria-pressed={selected}
                      disabled={disabled}
                      onClick={() => onSlotToggle(start)}
                    >
                      <span className="slot-pick-time">{formatTime(start)}</span>
                      <span className="slot-pick-price">{formatMoney(sport.base)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </motion.section>
    </div>
  );
}
