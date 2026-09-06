import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useMotionEnabled } from '@/lib/motion';

function PaddleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M14.3 4.2c8.7-3.1 19.8 4.9 22.8 13.5 2.9 8.4-3 16.2-11.7 19.2l-3.4 1.2-3.5-10.2-5.9 2.1-3-8.6 5.9-2.1-3.5-10.1 2.3-4.9Z" fill="var(--clay)" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round"/>
      <circle cx="23" cy="14" r="1.25" fill="#fff"/><circle cx="29.5" cy="17.2" r="1.25" fill="#fff"/>
      <circle cx="20.4" cy="20.7" r="1.25" fill="#fff"/><circle cx="26.8" cy="24" r="1.25" fill="#fff"/>
      <path d="m12.6 27.5 6-2.1 3.4 9.8-6 2.1c-2.7 1-5.6-.4-6.5-3.1l-.1-.2c-.9-2.6.5-5.5 3.2-6.4Z" fill="#18181b" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round"/>
    </svg>
  );
}

export function PaddleCursor() {
  const motionEnabled = useMotionEnabled();
  const [finePointer, setFinePointer] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const enabled = motionEnabled && finePointer;

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine) and (min-width: 769px)');
    const update = () => setFinePointer(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    const root = document.documentElement;
    const timers = new Set<number>();
    let frame = 0;
    let x = -80;
    let y = -80;
    const renderPosition = () => {
      frame = 0;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(renderPosition);
    };
    const over = (event: PointerEvent) => {
      cursor.firstElementChild?.classList.toggle('is-hover', Boolean((event.target as Element | null)?.closest('a, button, [data-cursor], .cursor-pointer')));
    };
    const later = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => { timers.delete(timer); callback(); }, delay);
      timers.add(timer);
    };
    const click = (event: MouseEvent) => {
      if (event.detail === 0) return;
      cursor.firstElementChild?.classList.add('is-clicking');
      later(() => cursor.firstElementChild?.classList.remove('is-clicking'), 200);
      const count = 3 + Math.floor(Math.random() * 3);
      Array.from({ length: count }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 5 + Math.random() * .55;
        const distance = 28 + Math.random() * 42;
        const ball = document.createElement('span');
        ball.className = 'cursor-ball';
        Object.assign(ball.style, {
          left: `${event.clientX - 5}px`, top: `${event.clientY - 5}px`,
          '--burst-x': `${Math.cos(angle) * distance}px`, '--burst-y': `${Math.sin(angle) * distance}px`,
        } as CSSProperties);
        document.body.appendChild(ball);
        later(() => ball.remove(), 650);
      });
    };
    root.dataset.paddleActive = '';
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('click', click);
    return () => {
      delete root.dataset.paddleActive;
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      document.querySelectorAll('.cursor-ball').forEach((ball) => ball.remove());
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      window.removeEventListener('click', click);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={cursorRef} className="paddle-position"><div className="paddle-cursor"><PaddleIcon /></div></div>;
}
