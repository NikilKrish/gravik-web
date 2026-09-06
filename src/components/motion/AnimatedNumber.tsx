import { memo } from 'react';

export const AnimatedNumber = memo(function AnimatedNumber({ value, format = String, className }: { value: number; format?: (value: number) => string; className?: string }) {
  const rendered = format(value);
  return <span className={`animated-number ${className ?? ''}`.trim()}>
    <span key={rendered} className="animated-number-digit">{rendered}</span>
  </span>;
});
