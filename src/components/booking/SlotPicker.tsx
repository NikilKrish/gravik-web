// Left-hand booking picker: sport, date, court, and time-slot selection.
// No availability data exists — every slot in range is selectable; the
// only constraint enforced here is the MAX_SLOTS cap from the domain layer.

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Stagger, StaggerItem } from '@/components/motion';
import { motionDuration, useMotionEnabled } from '@/lib/motion';
import { bookingEnter, SectionHeading, SelectionGroup } from './BookingMotion';
import { CircleDot, Target, Sunrise, Sun, Sunset, Moon, type LucideIcon } from 'lucide-react';
import { formatMoney } from '../../lib/booking/pricing';
import { canAddSlot, daypartSlots, formatFullDate, formatTime, mergeSessions } from '../../lib/booking/slots';
import { DAYPARTS, MAX_SLOTS, SLOT_MINUTES, SPORTS } from '../../lib/booking/catalog';
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

const SportSection = memo(function SportSection({ sport, enabled, onChange }: { sport: Sport; enabled: boolean; onChange: (id: SportId) => void }) {
  return <motion.section className="booking-section" {...bookingEnter(enabled, 0)}>
    <SectionHeading title="Sport" value={sport.name} />
    <SelectionGroup className="sport-picker" active={sport.id} kind="sport">
      {SPORTS.map((item) => {
        const Icon = SPORT_ICONS[item.icon];
        return <button key={item.id} type="button" className="sport-pick" data-selection={item.id} aria-pressed={item.id === sport.id} onClick={() => onChange(item.id)}>
          {Icon ? <Icon className="sport-pick-icon" /> : null}
          <div><div className="sport-pick-name">{item.name}</div><div className="sport-pick-from">from {formatMoney(item.base)}</div></div>
        </button>;
      })}
    </SelectionGroup>
  </motion.section>;
});

const DateSection = memo(function DateSection({ rail, dayIndex, enabled, onChange }: { rail: RailDay[]; dayIndex: number; enabled: boolean; onChange: (index: number) => void }) {
  return <motion.section className="booking-section" {...bookingEnter(enabled, 0.08)}>
    <SectionHeading title="Date" value={rail[dayIndex] ? `${rail[dayIndex].dayNum} ${rail[dayIndex].month}` : undefined} caption="Slots open 14 days ahead" />
    <SelectionGroup className="date-rail" active={dayIndex} kind="date">
      {rail.map((day, index) => <button key={day.key} type="button" className="date-pick" data-selection={index} aria-pressed={index === dayIndex} aria-label={formatFullDate(day.date)} onClick={() => onChange(index)}>
        <span className="date-pick-dow">{day.dow}</span><span className="date-pick-num">{day.dayNum}</span>{day.isToday ? <span className="date-pick-today">Today</span> : null}
      </button>)}
    </SelectionGroup>
  </motion.section>;
});

const CourtSection = memo(function CourtSection({ sport, courtIndex, enabled, onChange }: { sport: Sport; courtIndex: number; enabled: boolean; onChange: (index: number) => void }) {
  return <motion.section className="booking-section" {...bookingEnter(enabled, 0.16)}>
    <SectionHeading title={sport.courtWord} value={sport.courts[courtIndex]} />
    <SelectionGroup className="court-picker" active={courtIndex} kind="court">
      {sport.courts.map((courtName, index) => <button key={courtName} type="button" className="court-pick" data-selection={index} aria-pressed={index === courtIndex} onClick={() => onChange(index)}>{courtName}</button>)}
    </SelectionGroup>
  </motion.section>;
});

const SlotButton = memo(function SlotButton({ start, price, selected, disabled, sessionLabel, connection, bridgeWidth, enabled, onToggle }: {
  start: number;
  price: number;
  selected: boolean;
  disabled: boolean;
  sessionLabel?: string;
  connection?: 'start' | 'end' | 'middle';
  bridgeWidth?: number;
  enabled: boolean;
  onToggle: (start: number) => void;
}) {
  return <button type="button" className="slot-pick" data-selection={start} data-session={sessionLabel}
    data-connected={connection} data-bridge={bridgeWidth ? 'next' : undefined} aria-pressed={selected} disabled={disabled}
    onClick={() => onToggle(start)}>
    {bridgeWidth ? <motion.span className="slot-session-bridge" aria-hidden="true" style={{ width: bridgeWidth }} initial={enabled ? { scaleX: 0 } : false} animate={{ scaleX: 1 }} transition={enabled ? { duration: motionDuration.fast } : { duration: 0 }} /> : null}
    {connection ? <span className="slot-session-link" aria-hidden="true">{connection === 'start' ? '↦' : connection === 'end' ? '↤' : '↔'}</span> : null}
    <span className="slot-pick-time">{formatTime(start)}</span>
    <span className="slot-pick-price">{formatMoney(price)}</span>
  </button>;
});

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
  const enabled = useMotionEnabled();
  const [latestPick, setLatestPick] = useState<number>();
  const handleSlotToggle = useCallback((value: number) => {
    setLatestPick(value);
    onSlotToggle(value);
  }, [onSlotToggle]);
  const activePick = latestPick !== undefined && picks.includes(latestPick) ? latestPick : picks.at(-1);
  const sessions = mergeSessions(picks);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [bridges, setBridges] = useState<Record<number, number>>({});
  useEffect(() => {
    const root = pickerRef.current;
    if (!root) return;
    if (!sessions.some((session) => session.end - session.start > SLOT_MINUTES)) {
      setBridges((previous) => Object.keys(previous).length ? {} : previous);
      return;
    }
    const measure = () => {
      const cells = new Map([...root.querySelectorAll<HTMLElement>('.slot-pick')]
        .map((cell) => [Number(cell.dataset.selection), cell]));
      const next: Record<number, number> = {};
      for (const session of sessions) {
        for (const start of picks) {
          // The domain session authorizes the connection. Geometry only decides
          // whether to draw its bridge or retain a row/daypart continuation cap.
          if (start < session.start || start + SLOT_MINUTES >= session.end) continue;
          const cell = cells.get(start);
          const following = cells.get(start + SLOT_MINUTES);
          if (!cell || !following || cell.parentElement !== following.parentElement) continue;
          const box = cell.getBoundingClientRect();
          const other = following.getBoundingClientRect();
          if (Math.abs(box.top - other.top) < 1 && other.left >= box.right) {
            next[start] = other.left - box.right + 4;
          }
        }
      }
      setBridges((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    let frame = requestAnimationFrame(measure);
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [picks, sport.id]);
  return (
    <div ref={pickerRef}>
      <SportSection sport={sport} enabled={enabled} onChange={onSportChange} />
      <DateSection rail={rail} dayIndex={dayIndex} enabled={enabled} onChange={onDayChange} />
      <CourtSection sport={sport} courtIndex={courtIndex} enabled={enabled} onChange={onCourtChange} />

      <section className="booking-section">
        <SectionHeading title="Time" value={picks.length ? `${picks.length} hr${picks.length === 1 ? '' : 's'} selected` : undefined} />

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

        <SelectionGroup active={activePick} kind="slot">
        <Stagger className="booking-dayparts" interval={0.06}>
        {DAYPARTS.map((daypart) => {
          const slots = daypartSlots(daypart);
          const Icon = DAYPART_ICONS[daypart.icon];
          return (
            <StaggerItem className="daypart" key={daypart.name}>
              <div className="daypart-head">
                {Icon ? <Icon className="daypart-icon" /> : null}
                <span className="daypart-name">{daypart.name}</span>
                <span className="daypart-count">{slots.length} slots</span>
              </div>
              <div className="slot-grid">
                {slots.map((start) => {
                  const selected = picks.includes(start);
                  const disabled = !selected && !canAdd;
                  // Membership comes from the domain's merged sessions, including
                  // sessions spanning a daypart or a responsive grid row.
                  const session = selected ? sessions.find((item) => start >= item.start && start < item.end) : undefined;
                  const connected = session && session.end - session.start > SLOT_MINUTES;
                  const connection = !connected ? undefined : start === session.start ? 'start' : start + SLOT_MINUTES === session.end ? 'end' : 'middle';
                  return <SlotButton key={start} start={start} price={sport.base} selected={selected} disabled={disabled}
                    sessionLabel={connected ? session.label : undefined} connection={connection}
                    bridgeWidth={connected ? bridges[start] : undefined} enabled={enabled}
                    onToggle={handleSlotToggle} />;
                })}
              </div>
            </StaggerItem>
          );
        })}
        </Stagger>
        </SelectionGroup>
      </section>
    </div>
  );
}
