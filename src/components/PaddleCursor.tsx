import { useEffect, useState, type CSSProperties } from 'react';

type CursorPoint = { x: number; y: number };
type BurstBall = CursorPoint & { id: number; dx: string; dy: string };

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
  const [position, setPosition] = useState<CursorPoint>({ x: -80, y: -80 });
  const [hover, setHover] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [balls, setBalls] = useState<BurstBall[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine) and (min-width: 769px)');
    const updateEnabled = () => setEnabled(media.matches);
    updateEnabled();
    media.addEventListener('change', updateEnabled);
    return () => media.removeEventListener('change', updateEnabled);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let timer = 0;
    const move = (event: MouseEvent) => setPosition({ x: event.clientX, y: event.clientY });
    const over = (event: MouseEvent) => setHover(Boolean((event.target as Element | null)?.closest('a, button, [data-cursor], .cursor-pointer')));
    const click = (event: MouseEvent) => {
      setClicking(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setClicking(false), 200);
      const newBalls = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 5 + Math.random() * .55;
        const distance = 28 + Math.random() * 42;
        return { id: Date.now() + index, x: event.clientX - 5, y: event.clientY - 5, dx: `${Math.cos(angle) * distance}px`, dy: `${Math.sin(angle) * distance}px` };
      });
      setBalls((current) => [...current, ...newBalls]);
      window.setTimeout(() => setBalls((current) => current.filter((ball) => !newBalls.some((newBall) => newBall.id === ball.id))), 650);
    };
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', over);
    window.addEventListener('click', click);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      window.removeEventListener('click', click);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <>
    <div className={`paddle-cursor${hover ? ' is-hover' : ''}${clicking ? ' is-clicking' : ''}`} style={{ left: position.x, top: position.y }}><PaddleIcon /></div>
    {balls.map((ball) => <span className="cursor-ball" key={ball.id} style={{ left: ball.x, top: ball.y, '--burst-x': ball.dx, '--burst-y': ball.dy } as CSSProperties} />)}
  </>;
}
