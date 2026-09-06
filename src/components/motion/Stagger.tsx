import { useMemo, useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { motionStagger, useOnceEntrance } from '@/lib/motion';

export function Stagger({ children, interval = motionStagger.base, ...rest }: HTMLMotionProps<'div'> & { interval?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useOnceEntrance(ref, { inView: true, stagger: interval * 1000 });
  return <motion.div {...rest} ref={ref}>{children}</motion.div>;
}

export function StaggerItem<T extends ElementType = 'div'>({ as, children, ...rest }: { as?: T; children: ReactNode } & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>) {
  const Component = useMemo(() => motion.create(as ?? 'div'), [as]);
  return <Component {...rest} data-stagger-item="">{children}</Component>;
}
