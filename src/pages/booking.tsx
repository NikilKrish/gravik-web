// Booking page container: owns all selection state and composes the
// slots, review, and done steps.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearch } from 'wouter';
import { motion } from 'framer-motion';
import { AnimatedNumber } from '@/components/motion';
import { useMotionEnabled } from '@/lib/motion';
import { bookingEnter } from '@/components/booking/BookingMotion';
import { ArrowLeft } from 'lucide-react';
import { ReviewStep } from '../components/booking/ReviewStep';
import { RequestSent } from '../components/booking/RequestSent';
import { SlotPicker } from '../components/booking/SlotPicker';
import { SummaryRail } from '../components/booking/SummaryRail';
import { getCourtName, getSport } from '../lib/booking/catalog';
import { computeTotals, formatMoney } from '../lib/booking/pricing';
import { buildWhatsAppUrl } from '../lib/booking/request';
import { buildDayRail, toggleSlot } from '../lib/booking/slots';
import type { BookingSelection, PayMode, SportId } from '../lib/booking/types';

type Step = 'slots' | 'review' | 'done';

function resolveSport(search: string): SportId {
  const raw = new URLSearchParams(search).get('sport');
  return raw === 'pickleball' || raw === 'cricket' ? raw : 'pickleball';
}

export default function Booking() {
  const search = useSearch();
  const initialSport = useMemo(() => resolveSport(search), [search]);
  const enabled = useMotionEnabled();
  const mainRef = useRef<HTMLElement>(null);

  const [sport, setSport] = useState<SportId>(initialSport);
  const [courtIndex, setCourtIndex] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [players, setPlayers] = useState(4);
  const [payMode, setPayMode] = useState<PayMode>('full');
  const [step, setStep] = useState<Step>('slots');

  const rail = useMemo(() => buildDayRail(new Date(), 14), []);
  const sportData = getSport(sport);
  const day = rail[dayIndex] ?? rail[0];
  const courtName = getCourtName(sportData, courtIndex);
  const totals = computeTotals(sportData, picks, addonIds);
  // Sport/day/court changes clear `picks` (see the handlers below), which can
  // strand the user on 'review' or 'done' with nothing selected if they
  // change sport, day, or court from a nav elsewhere. Fall back to 'slots'
  // whenever there's nothing to review, so the step state stays consistent.
  const effectiveStep: Step = step !== 'slots' && picks.length === 0 ? 'slots' : step;

  useLayoutEffect(() => {
    mainRef.current?.querySelector('h1')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [effectiveStep]);

  // A reduced-motion or hidden-page transition consumes any mounted micro
  // entrances permanently. Newly keyed values can animate after restoration,
  // while existing or interrupted content cannot restart its CSS timeline.
  useEffect(() => {
    const root = mainRef.current;
    if (enabled || !root) return;
    const selector = '.animated-number-digit, .booking-section-value > span, .booking-animated-row';
    const consume = () => root.querySelectorAll<HTMLElement>(selector)
      .forEach((element) => { element.dataset.motionConsumed = ''; });
    consume();
    const observer = new MutationObserver(consume);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [enabled]);

  const selection: BookingSelection = {
    sport,
    courtIndex,
    day,
    picks,
    addonIds,
    players,
    payMode,
  };

  useEffect(() => {
    document.title = `Book a Court | ${sportData.name} | GRAVIK`;
  }, [sportData.name]);

  const handleSportChange = useCallback((id: SportId) => {
    if (id === sport) return;
    setSport(id);
    setCourtIndex(0);
    setPicks([]);
    setAddonIds([]);
  }, [sport]);

  const handleDayChange = useCallback((index: number) => {
    if (index === dayIndex) return;
    setDayIndex(index);
    setPicks([]);
  }, [dayIndex]);

  const handleCourtChange = useCallback((index: number) => {
    if (index === courtIndex) return;
    setCourtIndex(index);
    setPicks([]);
  }, [courtIndex]);

  const handleSlotToggle = useCallback((startMinutes: number) => {
    setPicks((prev) => toggleSlot(prev, startMinutes));
  }, []);

  const handleAddonToggle = (id: string) => {
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  // Opens the WhatsApp handoff. window.open must run synchronously inside
  // the click handler — awaiting anything first lets popup blockers
  // intercept it, since the "user gesture" window closes fast.
  const openWhatsApp = (target: BookingSelection) => {
    const url = buildWhatsAppUrl(target);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSend = () => {
    openWhatsApp(selection);
    setStep('done');
  };

  const showMobileCta = effectiveStep !== 'done' && picks.length > 0;

  return (
    <main
      ref={mainRef}
      id="main-content"
      data-booking-step={effectiveStep}
      className={`shell booking-page${showMobileCta ? ' has-mobile-cta' : ''}`}
      data-testid="page-booking"
    >
      <span className="motion-sr-only" role="status" aria-live="polite" aria-atomic="true">
        Booking total {formatMoney(totals.total)}
      </span>
      {effectiveStep !== 'done' ? (
        <div className="booking-back-row">
          <Link href="/" className="booking-back">
            <ArrowLeft size={14} /> Back home
          </Link>
          {effectiveStep === 'review' ? (
            <button type="button" className="review-back" onClick={() => setStep('slots')}>
              <ArrowLeft size={14} /> Change slot
            </button>
          ) : null}
        </div>
      ) : null}

      {effectiveStep === 'slots' ? (
        <>
          <motion.header
            className="booking-header"
            {...bookingEnter(enabled)}
          >
            <div className="eyebrow">Book a court</div>
            <h1 tabIndex={-1} className="display booking-title">
              Pick your <span>slot.</span>
            </h1>
          </motion.header>
          <div className="booking-layout">
            <SlotPicker
              sport={sportData}
              rail={rail}
              dayIndex={dayIndex}
              courtIndex={courtIndex}
              picks={picks}
              onSportChange={handleSportChange}
              onDayChange={handleDayChange}
              onCourtChange={handleCourtChange}
              onSlotToggle={handleSlotToggle}
            />
            <SummaryRail
              sport={sportData}
              courtName={courtName}
              day={day}
              picks={picks}
              totals={totals}
              onPicksChange={setPicks}
              onContinue={() => setStep('review')}
            />
          </div>
        </>
      ) : null}

      {effectiveStep === 'review' ? (
        <ReviewStep
          sport={sportData}
          courtName={courtName}
          day={day}
          picks={picks}
          addonIds={addonIds}
          players={players}
          payMode={payMode}
          totals={totals}
          onAddonToggle={handleAddonToggle}
          onPayModeChange={setPayMode}
          onPlayersChange={setPlayers}
          onSend={handleSend}
        />
      ) : null}

      {effectiveStep === 'done' ? (
        <RequestSent
          sport={sportData}
          courtName={courtName}
          day={day}
          picks={picks}
          players={players}
          addonIds={addonIds}
          totals={totals}
          selection={selection}
          onReopenWhatsApp={openWhatsApp}
        />
      ) : null}

      {showMobileCta ? (
        <div className="booking-mobile-cta">
          <div className="booking-mobile-cta-total">
            <span className="booking-mobile-cta-label">Total</span>
            <span className="booking-mobile-cta-amount"><AnimatedNumber value={totals.total} format={formatMoney} /></span>
          </div>
          {effectiveStep === 'review' ? (
            <button type="button" className="button clay" onClick={handleSend}>
              Send request on WhatsApp
            </button>
          ) : (
            <button type="button" className="button clay" onClick={() => setStep('review')}>
              Continue to review
            </button>
          )}
        </div>
      ) : null}
    </main>
  );
}
