import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useMotionEnabled, useOnceEntrance } from '@/lib/motion';

/** Decorative court planes. Semantic hero content never travels with them. */
export function CourtField() {
  const ref = useRef<HTMLDivElement>(null);
  const arrivalRef = useRef<HTMLDivElement>(null);
  const enabled = useMotionEnabled();
  useOnceEntrance(arrivalRef, { distance: 18, duration: 950, inView: true });
  const inView = useInView(ref);
  const travel = useMotionValue(0);
  const surfaceY = useTransform(travel, [0, 1], [0, 12]);
  const courtY = useTransform(travel, [0, 1], [0, 28]);
  const netY = useTransform(travel, [0, 1], [0, 48]);
  const atmosphereY = useTransform(travel, [0, 1], [0, -18]);

  useEffect(() => {
    if (!inView) arrivalRef.current?.getAnimations().forEach((animation) => animation.cancel());
  }, [inView]);

  useEffect(() => {
    if (!enabled || !inView) {
      if (!enabled) travel.set(0);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = ref.current?.getBoundingClientRect();
      // Natural-flow progress, with reduced travel for the portrait crop.
      if (bounds) travel.set(Math.min(1, Math.max(0, -bounds.top / bounds.height)) * (bounds.width <= 768 ? 0.6 : 1));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [enabled, inView, travel]);

  return (
    <div ref={ref} className="court-field" aria-hidden="true">
      <motion.div className="court-field-ground" style={{ y: surfaceY }}>
        <svg className="court-field-surface" viewBox="0 0 1000 520" preserveAspectRatio="none" fill="none">
          <path className="court-field-apron" d="M0 0H1000V520H0Z" />
          <path className="court-field-kitchen" d="M360 0H640V520H360Z" />
        </svg>
      </motion.div>
      <motion.div className="court-field-travel" style={{ y: courtY }}>
        <div ref={arrivalRef} className="court-field-arrival">
          <svg className="court-field-surface" viewBox="0 0 1000 520" preserveAspectRatio="none" fill="none">
            <g className="court-field-lines">
              <path d="M60 60H940V460H60Z" />
              <path d="M360 60V460M640 60V460M60 260H360M640 260H940" />
            </g>
            <path className="court-field-center" d="M500 42V478" />
            <g className="court-field-ticks"><path d="M12 260H38M962 260H988M500 20V34M500 486V500" /></g>
          </svg>
        </div>
      </motion.div>
      <motion.div className="court-field-net-travel" style={{ y: netY }}>
        <div className="court-field-net"><span /><span /><span /><span /></div>
      </motion.div>
      <motion.div className="court-field-atmosphere" style={{ y: atmosphereY }} />
    </div>
  );
}
