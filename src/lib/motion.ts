import { useEffect, useLayoutEffect, useRef, useSyncExternalStore, type RefObject } from 'react';

export const motionDuration = { instant: 0.12, fast: 0.2, base: 0.42, slow: 0.7 } as const;
export const motionEase = { standard: [0.22, 1, 0.36, 1], enter: [0.16, 1, 0.3, 1], exit: [0.4, 0, 1, 1] } as const;
export const motionSpring = {
  responsive: { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 },
  gentle: { type: 'spring', stiffness: 220, damping: 28, mass: 0.9 },
} as const;
export const motionDistance = { short: 8, base: 18, long: 32 } as const;
export const motionStagger = { tight: 0.045, base: 0.08, relaxed: 0.12 } as const;

// One pair of browser listeners serves every motion consumer. Framer's installed
// useReducedMotion snapshots the preference and does not subscribe to changes.
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
let motionMedia: MediaQueryList | undefined;
const getMotionMedia = () => {
  motionMedia ??= window.matchMedia('(prefers-reduced-motion: reduce)');
  return motionMedia;
};
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    getMotionMedia().addEventListener('change', notify);
    document.addEventListener('visibilitychange', notify);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      getMotionMedia().removeEventListener('change', notify);
      document.removeEventListener('visibilitychange', notify);
    }
  };
}
const isVisible = () => typeof document === 'undefined' || document.visibilityState === 'visible';
const isEnabled = () => isVisible() && typeof window !== 'undefined' && !getMotionMedia().matches;
export function usePageVisibility() {
  return useSyncExternalStore(subscribe, isVisible, () => true);
}
export function useMotionEnabled() {
  return useSyncExternalStore(subscribe, isEnabled, () => false);
}

// Settled markup is always readable. Animation is an optional overlay, consumed
// once even if initially suppressed or interrupted. Cancelling removes its
// transform immediately without replacing DOM or stealing keyboard focus.
export function useOnceEntrance(ref: RefObject<HTMLElement | null>, {
  distance = 18, duration = 420, delay = 0, inView = false, stagger = 0,
}: { distance?: number; duration?: number; delay?: number; inView?: boolean; stagger?: number } = {}) {
  const enabled = useMotionEnabled();
  const consumed = useRef(false);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!enabled) { consumed.current = true; return; }
    if (consumed.current) return;
    const animations: Animation[] = [];
    const play = () => {
      if (consumed.current) return;
      consumed.current = true;
      const targets = stagger ? [...element.querySelectorAll<HTMLElement>('[data-stagger-item]')] : [element];
      targets.forEach((target, index) => animations.push(target.animate([
        { transform: `translateY(${distance}px)` }, { transform: 'translateY(0)' },
      ], { duration, delay: delay + index * stagger, easing: 'cubic-bezier(.16,1,.3,1)' })));
    };
    let observer: IntersectionObserver | undefined;
    if (inView) {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) { play(); observer?.disconnect(); }
      }, { threshold: 0.12 });
      observer.observe(element);
    } else play();
    return () => { observer?.disconnect(); animations.forEach((animation) => animation.cancel()); };
  }, [enabled, ref, distance, duration, delay, inView, stagger]);
}

export function useDevelopmentPerformanceDiagnostics() {
  useEffect(() => {
    if (!import.meta.env.DEV || typeof PerformanceObserver === 'undefined') return;
    let layoutShiftScore = 0;
    let longTaskCount = 0;
    const observers: PerformanceObserver[] = [];
    const observe = (type: string, callback: PerformanceObserverCallback) => {
      if (!PerformanceObserver.supportedEntryTypes.includes(type)) return;
      const observer = new PerformanceObserver(callback);
      observer.observe({ type, buffered: true });
      observers.push(observer);
    };
    observe('layout-shift', (list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
        if (!shift.hadRecentInput) layoutShiftScore += shift.value ?? 0;
      }
      if (layoutShiftScore > 0.1) {
        console.warn(`[motion diagnostics] cumulative layout shift: ${layoutShiftScore.toFixed(3)}`);
        layoutShiftScore = Number.NEGATIVE_INFINITY;
      }
    });
    observe('longtask', (list) => {
      for (const entry of list.getEntries()) {
        if (longTaskCount >= 3) break;
        console.warn(`[motion diagnostics] long task: ${entry.duration.toFixed(0)}ms`);
        longTaskCount += 1;
      }
    });
    return () => observers.forEach((observer) => observer.disconnect());
  }, []);
}
