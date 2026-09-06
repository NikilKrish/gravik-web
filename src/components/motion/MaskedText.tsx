import { useMemo, useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useOnceEntrance } from '@/lib/motion';

export function MaskedText<T extends ElementType = 'span'>({ as, children, className, ...rest }: { as?: T; children: ReactNode; className?: string } & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>) {
  const innerRef = useRef<HTMLSpanElement>(null);
  useOnceEntrance(innerRef, { distance: 32, duration: 700 });
  const Component = useMemo(() => motion.create(as ?? 'span'), [as]);
  return <Component {...rest} className={`motion-mask ${className ?? ''}`.trim()}>
    <span ref={innerRef} className="motion-mask-inner">{children}</span>
  </Component>;
}
