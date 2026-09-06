import { useRef, type ReactNode } from 'react';
import { useOnceEntrance } from '@/lib/motion';
export function RouteTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useOnceEntrance(ref, { distance: 8, duration: 200 });
  return <div ref={ref} className="route-transition">{children}</div>;
}
