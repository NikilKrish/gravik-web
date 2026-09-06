import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FocusEvent, type MouseEvent } from 'react';
import { Link } from 'wouter';
import { MaskedText, Reveal, Stagger, StaggerItem } from '@/components/motion';
import { CourtField } from '@/components/motion/CourtField';
import { useMotionEnabled } from '@/lib/motion';
import { ArrowRight, ChevronRight, Menu, Phone, X, MapPin, Instagram, Mail, Award, ShieldCheck, Trophy, Clock, Users, GraduationCap, Shirt, Coffee, Car, Lightbulb } from 'lucide-react';
import { hasOpened, OPENING_LABEL } from '../lib/opening';

// One source of truth for the venue location: the Get Directions buttons and
// the QR code in the visit panel all resolve to this exact URL, so the printed
// code can never drift from the links beside it.
const MAPS_URL =
  'https://maps.google.com/?q=Plot+No.+28,+VGN+Victoria+Park,+Enford+Street,+Ambattur,+Chennai';

const navItems = [
  { id: 'sports', label: 'Sports' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'visit', label: 'Location' },
  { id: 'contact', label: 'Contact' },
] as const;

const benefits = [
  { icon: Award, title: 'Quality Courts', desc: 'Well-maintained playing experience' },
  { icon: GraduationCap, title: 'Coaching', desc: 'Learn, improve & elevate your game' },
  { icon: Trophy, title: 'Tournaments', desc: 'Compete, challenge & level up' },
  { icon: Users, title: 'Open Play', desc: 'Meet players. Build your game. Have fun.' },
  { icon: Clock, title: 'Open Daily', desc: 'Seven days a week' },
  { icon: ShieldCheck, title: 'Safe & Secured', desc: 'CCTV surveillance & security' },
  { icon: Car, title: 'Ample Parking', desc: 'Hassle-free parking space' },
  { icon: Coffee, title: 'Drinking Water', desc: 'Stay hydrated always' },
  { icon: Shirt, title: 'Changing Rooms', desc: 'Clean & comfortable facilities' },
  { icon: Lightbulb, title: 'Premium Lighting', desc: 'Best play day or night' },
];

export function Home() {
  const [menu, setMenu] = useState(false);
  const enabled = useMotionEnabled();
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const navLinks = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState('');
  const sentinel = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLSpanElement>(null);
  const opened = hasOpened();

  // A sentinel at the top of the document tells us the header has left the
  // flow, without a scroll listener. Drives the condensed glass treatment.
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Scroll spy: whichever section crosses the middle band of the viewport is
  // the current one. Ties resolve in document order so the nav never flickers
  // between two sections that both qualify.
  useEffect(() => {
    const targets = navItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!targets.length) return;
    const visible = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      setActive(navItems.find((item) => visible.has(item.id))?.id ?? '');
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  // One rail slides between links rather than each link owning a border, so
  // the indicator animates as a single transform. Measured, because label
  // widths depend on a webfont that lands after first paint.
  useLayoutEffect(() => {
    const container = navLinks.current;
    const railEl = rail.current;
    if (!container || !railEl) return;
    const place = () => {
      const link = active ? container.querySelector<HTMLAnchorElement>(`a[data-nav="${active}"]`) : null;
      if (!link || mobile) {
        container.removeAttribute('data-rail');
        return;
      }
      const bounds = container.getBoundingClientRect();
      const target = link.getBoundingClientRect();
      railEl.style.setProperty('--rail-x', `${target.left - bounds.left}px`);
      railEl.style.setProperty('--rail-w', `${target.width}`);
      container.setAttribute('data-rail', 'on');
    };
    place();
    const resize = new ResizeObserver(place);
    resize.observe(container);
    document.fonts?.ready.then(place).catch(() => {});
    return () => resize.disconnect();
  }, [active, mobile]);

  useEffect(() => {
    document.title = 'GRAVIK | Play. Compete. Connect. | Chennai';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Chennai\'s new destination for pickleball and cricket practice. Open daily.');
  }, []);

  useEffect(() => {
    const breakpoint = window.matchMedia('(max-width: 768px)');
    const update = () => {
      setMobile(breakpoint.matches);
      setMenu(false);
      // Move focus out of the disclosure if it becomes hidden at the breakpoint.
      if (breakpoint.matches && navLinks.current?.contains(document.activeElement)) menuButton.current?.focus();
      if (!breakpoint.matches && document.activeElement === menuButton.current) navLinks.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    };
    breakpoint.addEventListener('change', update);
    return () => breakpoint.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!menu || !mobile) return;
    navLinks.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenu(false);
      menuButton.current?.focus();
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setMenu(false);
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', escape);
      document.removeEventListener('pointerdown', outside);
    };
  }, [menu, mobile]);

  useEffect(() => {
    let frame = 0;
    const settleHash = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (!target) return;
      target.dataset.motionSettled = 'true';
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }));
    };
    settleHash();
    window.addEventListener('hashchange', settleHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', settleHash);
    };
  }, []);

  const nav = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    setMenu(false);
    const target = document.getElementById(id);
    if (!target) return;
    target.dataset.motionSettled = 'true';
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: enabled ? 'smooth' : 'instant', block: 'start' });
  };

  const settleFocus = (event: FocusEvent<HTMLElement>) => {
    const section = event.target.closest<HTMLElement>('section, footer');
    if (section) section.dataset.motionSettled = 'true';
  };

  return (
    <main id="main-content" className="home-page" tabIndex={-1} data-testid="page-home" onFocusCapture={settleFocus}>
      <div ref={sentinel} className="nav-sentinel" aria-hidden="true" />
      <header ref={header} className="home-header" data-scrolled={stuck ? 'true' : undefined} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setMenu(false); }}>
        <nav className="nav shell" aria-label="Main navigation" data-testid="navigation-main">
          <a href="#top" className="brand" data-testid="link-brand" onClick={(event) => nav(event, 'top')}>
            <img src="/brand/gravik-logo-panel.webp" alt="GRAVIK Logo" width={610} height={265} fetchPriority="high" decoding="async" />
          </a>

          <div ref={navLinks} id="home-navigation-links" className={`nav-links ${menu ? 'open' : ''}`} inert={mobile && !menu}>
            {navItems.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-nav={item.id}
                data-testid={`link-${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                style={{ '--nav-index': index } as CSSProperties}
                onClick={(event) => nav(event, item.id)}
              >
                {item.label}
              </a>
            ))}
            <span ref={rail} className="nav-rail" aria-hidden="true" />
          </div>

          <div className="nav-tools">
            <Link className="button clay" href="/book" data-testid="link-book-now">
              Book Court <ArrowRight size={14} />
            </Link>
            <button ref={menuButton} type="button" className="icon-button mobile-menu" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="home-navigation-links" data-testid="button-mobile-menu" onClick={() => setMenu(!menu)}>
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <section id="top" className="shell hero" tabIndex={-1}>
        <CourtField />
        <div className="hero-copy">
          <div>
            <div className="hero-tagline">
              <span /> {opened ? 'Now open · Open daily' : `Opening ${OPENING_LABEL}`} <span />
            </div>
          </div>

          <h1 className="display">
            <MaskedText>Play. Compete.</MaskedText><br /><MaskedText><span className="hero-accent">Connect.</span></MaskedText>
          </h1>

          <div>
            <p className="hero-sub">
              Chennai's new destination for <span className="bone-text">Pickleball</span> and <span className="bone-text">Cricket Practice</span>. Equipped. Ready when you are.
            </p>
            <div className="hero-actions">
              <Link className="button clay" href="/book" data-testid="link-hero-book">
                Book Your Court Today <ArrowRight size={14} />
              </Link>
              <a className="button" href="#sports" onClick={(event) => nav(event, 'sports')}>
                Explore Sports <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker" aria-label="brand highlights">
        <div className="ticker-inner">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i} aria-hidden={i > 0 ? true : undefined}>
              RALLY. SMASH. REPEAT. <b>•</b> FOCUS. PRACTICE. PERFORM. <b>•</b> OPEN DAILY <b>•</b>
            </span>
          ))}
        </div>
      </div>

      <section id="sports" className="section shell" tabIndex={-1}>
        <Reveal data-home-reveal distance={32}>
          <div className="eyebrow">Choose your game</div>
          <h2 className="display" style={{ fontSize: 'clamp(50px, 8vw, 100px)', margin: 0 }}>Train Hard.<br/>Play Smart.</h2>
        </Reveal>

        <Stagger className="sports-grid" data-home-reveal interval={0.08}>
          {/* Pickleball */}
          <StaggerItem as="article" data-home-reveal className="sport-card">
            <img src="/brand/pickleball-action.webp" alt="Pickleball Action" className="sport-img" width={537} height={352} loading="lazy" decoding="async" />
            <div className="sport-content">
              <div className="sport-slogan">Rally. Smash. Repeat.</div>
              <h3 className="display sport-title">Pickleball</h3>
              <p style={{ color: 'var(--muted)', font: '500 16px/1.5 Manrope, sans-serif' }}>Premium courts. Court price per hour.</p>

              <div className="sport-pricing">
                <div>
                  <div style={{ font: '700 12px \'Space Grotesk\', sans-serif', color: 'var(--clay)', textTransform: 'uppercase', marginBottom: 4 }}>*Limited Time Offer</div>
                  <span className="old-price">₹1000</span>
                </div>
                <div>
                  <span className="new-price">₹750</span><span className="unit">/ hr</span>
                </div>
              </div>

              <Link className="button clay" href="/book?sport=pickleball" data-testid="link-book-pickleball" style={{ marginTop: 24, width: '100%' }}>
                Check availability <ArrowRight size={14} />
              </Link>
            </div>
          </StaggerItem>

          {/* Cricket Nets */}
          <StaggerItem as="article" data-home-reveal className="sport-card">
            <img src="/brand/cricket-action.webp" alt="Cricket Net Action" className="sport-img" width={525} height={440} loading="lazy" decoding="async" />
            <div className="sport-content">
              <div className="sport-slogan">Focus. Practice. Perform.</div>
              <h3 className="display sport-title">Cricket Nets</h3>
              <p style={{ color: 'var(--muted)', font: '500 16px/1.5 Manrope, sans-serif' }}>Single net with bowling machine.</p>

              <div className="sport-pricing">
                <div>
                  <div style={{ font: '700 12px \'Space Grotesk\', sans-serif', color: 'var(--clay)', textTransform: 'uppercase', marginBottom: 4 }}>*Limited Time Offer</div>
                  <span className="old-price">₹750</span>
                </div>
                <div>
                  <span className="new-price">₹500</span><span className="unit">/ hr</span>
                </div>
              </div>

              <Link className="button clay" href="/book?sport=cricket" data-testid="link-book-cricket" style={{ marginTop: 24, width: '100%' }}>
                Check availability <ArrowRight size={14} />
              </Link>
            </div>
          </StaggerItem>
        </Stagger>
      </section>

      <section id="facilities" className="section shell" tabIndex={-1}>
        <Reveal data-home-reveal distance={8} style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Premium Experience</div>
          <h2 className="display" style={{ fontSize: 'clamp(50px, 8vw, 90px)', margin: '10px 0 20px' }}>Built for the players</h2>
        </Reveal>

        <Reveal data-home-reveal distance={8} className="benefits-grid">
          {benefits.map((b) => (
            <div key={b.title} className="benefit-card">
              <b.icon className="benefit-icon" />
              <div>
                <h4 className="benefit-title">{b.title}</h4>
                <p style={{ font: '500 13px/1.5 Manrope, sans-serif', color: 'var(--dim)', marginTop: 8 }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      <section id="visit" className="visit" tabIndex={-1}>
        <div className="visit-text">
          <Reveal data-home-reveal distance={12}>
            <div className="eyebrow">Find your court</div>
            <h2 className="display visit-title">See you on<br/>the court!</h2>
            <p className="visit-address">
              Plot No. 28, VGN Victoria Park, Enford Street,<br/>Ambattur, Chennai – 600 053
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="button clay">
                <MapPin size={16} /> Get Directions
              </a>
              <a href="tel:+919150293767" className="button">
                <Phone size={16} /> Call Us
              </a>
            </div>
          </Reveal>
        </div>
        <div className="visit-map">
          <img src="/brand/gravik-board.webp" alt="" aria-hidden="true" width={720} height={1019} loading="lazy" decoding="async" />
          <div className="map-overlay">
            {/* A real, scannable code for MAPS_URL — pre-rendered at build time so
                no QR library ships to the client. Also a link, so a desktop
                visitor who cannot scan it still gets the directions. */}
            <a className="qr-code" href={MAPS_URL} target="_blank" rel="noreferrer" aria-label="Open the GRAVIK location in Google Maps">
              <img src="/brand/directions-qr.svg" alt="" width={200} height={200} loading="lazy" decoding="async" />
            </a>
            <span className="mono map-overlay-caption">Scan for directions</span>
          </div>
        </div>
      </section>

      <footer id="contact" className="footer" tabIndex={-1}>
        <div className="shell">
          <div className="footer-top">
            <div>
              <div className="footer-brand">
                <img src="/brand/gravik-logo-panel.webp" alt="GRAVIK" width={610} height={265} loading="lazy" decoding="async" />
              </div>
              <div className="footer-slogan">Play. Compete. Connect.</div>
              <p style={{ color: 'var(--dim)', marginTop: 16, font: '500 14px/1.6 Manrope, sans-serif', maxWidth: 300 }}>
                Chennai's new destination for Pickleball and Cricket Practice. Open daily.
              </p>
            </div>

            <div>
              <h4>Contact Us</h4>
              <div className="footer-links">
                <a href="tel:+919150293767" className="flex"><Phone size={16} /> +91 91502 93767</a>
                <a href="tel:+918072919632" className="flex"><Phone size={16} /> +91 8072 919 632</a>
                <a href="mailto:gravik0523@gmail.com" className="flex"><Mail size={16} /> gravik0523@gmail.com</a>
                <a href="https://instagram.com/gravikpadel" target="_blank" rel="noreferrer" className="flex" style={{ color: 'var(--bone)' }}><Instagram size={16} /> @gravikpadel</a>
              </div>
            </div>

            <div>
              <h4>Location</h4>
              <div className="footer-links">
                <span style={{ lineHeight: 1.6 }}>Plot No. 28, VGN Victoria Park,<br/>Enford Street, Ambattur,<br/>Chennai – 600 053</span>
                <a href={MAPS_URL} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--clay)', marginTop: 8 }}>Open in Maps</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <span>© {new Date().getFullYear()} GRAVIK. All rights reserved.</span>
              <Link href="/privacy" className="footer-legal-link">Privacy</Link>
              <Link href="/terms" className="footer-legal-link">Terms</Link>
            </div>
            <div className="partners">
              <span>We are also on:</span>
              <b>TURFTOWN</b>
              <b>PLAYO</b>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
