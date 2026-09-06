import { useMemo, useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { motionDistance, useOnceEntrance } from '@/lib/motion';

type RevealProps<T extends ElementType = 'div'> = { as?: T; children: ReactNode; delay?: number; distance?: number } & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>;

export function Reveal<T extends ElementType = 'div'>({ as, children, delay = 0, distance = motionDistance.base, ...rest }: RevealProps<T>) {
  const ref = useRef<HTMLElement>(null);
  useOnceEntrance(ref, { distance, delay: delay * 1000, inView: true });
  const Component = useMemo(() => motion.create(as ?? 'div'), [as]);
  return <Component {...rest} ref={ref}>{children}</Component>;
}
