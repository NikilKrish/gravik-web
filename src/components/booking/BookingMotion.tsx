import { createContext, memo, useContext, useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { Check } from 'lucide-react';
import { motionDuration, motionEase, useMotionEnabled } from '@/lib/motion';

export const bookingEnter = (enabled: boolean, delay = 0) => enabled ? {
  initial: { opacity: 1, x: 12 }, animate: { opacity: 1, x: 0 },
  transition: { duration: motionDuration.base, delay, ease: motionEase.standard },
} : {
  initial: false as const, animate: { opacity: 1, x: 0 },
  transition: { duration: 0 }, style: { opacity: 1, transform: 'none' },
};

// One decorative marker follows the latest selection. The buttons own state,
// pressed styles and keyboard behavior; the marker never intercepts input.
export function SelectionGroup({ className = '', active, kind, children }: {
  className?: string; active: string | number | undefined; kind: string; children: ReactNode;
}) {
  const enabled = useMotionEnabled();
  const ref = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const measure = () => {
    const root = ref.current;
    const marker = markerRef.current;
    if (!root || !marker) return;
    if (activeRef.current === undefined) {
      marker.hidden = true;
      return;
    }
    const target = [...root.querySelectorAll<HTMLElement>('[data-selection]')]
      .find((item) => item.dataset.selection === String(activeRef.current));
    marker.hidden = !target;
    if (!target) return;
    const box = target.getBoundingClientRect();
    const bounds = root.getBoundingClientRect();
    marker.style.transform = `translate(${box.left - bounds.left + root.scrollLeft + (box.width - 20) / 2}px, ${box.bottom - bounds.top + root.scrollTop - 5}px)`;
  };
  useEffect(() => {
    const frame = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(frame);
  }, [active]);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`booking-selection-group ${className}`} data-selection-group={kind} data-motion={enabled ? 'on' : 'off'}>
    {children}
    <span ref={markerRef} className="booking-selection-marker" aria-hidden="true" hidden />
  </div>;
}

export const SectionHeading = memo(function SectionHeading({ title, value, caption }: { title: string; value?: string; caption?: string }) {
  const enabled = useMotionEnabled();
  return <div className={`booking-section-head booking-progress-head${value ? ' is-complete' : ''}`} data-motion={enabled ? 'on' : 'off'}>
    <h2 className="booking-section-title">{title}</h2>
    {value ? <span className="booking-section-value"><span key={value}><Check size={12} aria-hidden="true" />{value}</span></span> : null}
    {caption ? <span className="booking-section-caption">{caption}</span> : null}
  </div>;
});

const BookingRowsMotion = createContext(true);

export function BookingRows({ children }: { children: ReactNode }) {
  const enabled = useMotionEnabled();
  return <BookingRowsMotion.Provider value={enabled}>
    <AnimatePresence initial={false}>{children}</AnimatePresence>
  </BookingRowsMotion.Provider>;
}

export function BookingRow({ children, className }: { children: ReactNode; className: string }) {
  const enabled = useContext(BookingRowsMotion);
  const present = useIsPresent();
  return <motion.div className={`${className} booking-animated-row`} aria-hidden={!present || undefined} inert={!present || undefined}
    style={!present ? { position: 'absolute', width: '100%', pointerEvents: 'none' } : undefined}
    exit={enabled ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
    transition={enabled ? { duration: motionDuration.fast, ease: motionEase.standard } : { duration: 0 }}>
    {children}
  </motion.div>;
}
