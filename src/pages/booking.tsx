// Booking page container: owns all selection state and composes the
// slots, review, and done steps.

import { useEffect, useMemo, useState } from 'react';
import { Link, useSearch } from 'wouter';
import { motion, useReducedMotion } from 'framer-motion';
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
  const reduce = useReducedMotion();

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

  const handleSportChange = (id: SportId) => {
    if (id === sport) return;
    setSport(id);
    setCourtIndex(0);
    setPicks([]);
    setAddonIds([]);
  };

  const handleDayChange = (index: number) => {
    if (index === dayIndex) return;
    setDayIndex(index);
    setPicks([]);
  };

  const handleCourtChange = (index: number) => {
    if (index === courtIndex) return;
    setCourtIndex(index);
    setPicks([]);
  };

  const handleSlotToggle = (startMinutes: number) => {
    setPicks((prev) => toggleSlot(prev, startMinutes));
  };

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
      id="main-content"
      className={`shell booking-page${showMobileCta ? ' has-mobile-cta' : ''}`}
      data-testid="page-booking"
    >
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
            initial={reduce ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="eyebrow">Book a court</div>
            <h1 className="display booking-title">
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
            <span className="booking-mobile-cta-amount">{formatMoney(totals.total)}</span>
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
