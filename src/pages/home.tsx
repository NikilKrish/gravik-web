import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronRight, Menu, Phone, X, MapPin, Instagram, Mail, Award, ShieldCheck, Trophy, Clock, Users, GraduationCap, Shirt, Coffee, Car, Lightbulb } from 'lucide-react';
import { hasOpened, OPENING_LABEL } from '../lib/opening';

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
  const reduce = useReducedMotion();
  const opened = hasOpened();

  useEffect(() => {
    document.title = 'GRAVIK | Play. Compete. Connect. | Chennai';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Chennai\'s new destination for pickleball and cricket practice. Open daily.');
  }, []);

  const nav = (id: string) => {
    setMenu(false);
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  };

  const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5 }
  };

  return (
    <main id="main-content" data-testid="page-home">
      <header className="shell sticky top-0 z-50 bg-[#14120F]/92 backdrop-blur-md">
        <nav className="nav" data-testid="navigation-main">
          <a href="#top" className="brand" data-testid="link-brand" onClick={() => setMenu(false)}>
            <img src="/brand/gravik-logo-panel.webp" alt="GRAVIK Logo" />
          </a>

          <div className={`nav-links ${menu ? 'open' : ''}`}>
            <a href="#sports" data-testid="link-sports" onClick={() => setMenu(false)}>Sports</a>
            <a href="#facilities" data-testid="link-facilities" onClick={() => setMenu(false)}>Facilities</a>
            <a href="#visit" data-testid="link-visit" onClick={() => setMenu(false)}>Location</a>
            <a href="#contact" data-testid="link-contact" onClick={() => setMenu(false)}>Contact</a>
          </div>

          <div className="nav-tools">
            <Link className="button clay" href="/book" data-testid="link-book-now">
              Book Court <ArrowRight size={14} />
            </Link>
            <button className="icon-button mobile-menu" aria-label="Open menu" data-testid="button-mobile-menu" onClick={() => setMenu(!menu)}>
              {menu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <section id="top" className="shell hero">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="hero-tagline">
            <span /> {opened ? 'Now open · Open daily' : `Opening ${OPENING_LABEL}`} <span />
          </div>
        </motion.div>

        <motion.h1 className="display" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
          Play. Compete.<br /><span>Connect.</span>
        </motion.h1>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="hero-sub">
            Chennai's new destination for <span className="bone-text">Pickleball</span> and <span className="bone-text">Cricket Practice</span>. Equipped. Ready when you are.
          </p>
          <div className="hero-actions">
            <Link className="button clay" href="/book" data-testid="link-hero-book">
              Book Your Court Today <ArrowRight size={14} />
            </Link>
            <a className="button" href="#sports" onClick={() => nav('sports')}>
              Explore Sports <ChevronRight size={14} />
            </a>
          </div>
        </motion.div>
      </section>

      <div className="ticker" aria-label="brand highlights">
        <div className="ticker-inner">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>
              RALLY. SMASH. REPEAT. <b>•</b> FOCUS. PRACTICE. PERFORM. <b>•</b> OPEN DAILY <b>•</b>
            </span>
          ))}
        </div>
      </div>

      <section id="sports" className="section shell">
        <motion.div {...reveal}>
          <div className="eyebrow">Choose your game</div>
          <h2 className="display" style={{ fontSize: 'clamp(50px, 8vw, 100px)', margin: 0 }}>Train Hard.<br/>Play Smart.</h2>
        </motion.div>

        <div className="sports-grid">
          {/* Pickleball */}
          <motion.article {...reveal} transition={{ delay: 0.1 }} className="sport-card">
            <img src="/brand/pickleball-action.webp" alt="Pickleball Action" className="sport-img" />
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
          </motion.article>

          {/* Cricket Nets */}
          <motion.article {...reveal} transition={{ delay: 0.2 }} className="sport-card">
            <img src="/brand/cricket-action.webp" alt="Cricket Net Action" className="sport-img" />
            <div className="sport-content">
              <div className="sport-slogan">Focus. Practice. Perform.</div>
              <h3 className="display sport-title">Cricket Nets</h3>
              <p style={{ color: 'var(--muted)', font: '500 16px/1.5 Manrope, sans-serif' }}>Single net with bowling machine.</p>

              <div className="sport-pricing">
                <div>
                  <div style={{ font: '700 12px \'Space Grotesk\', sans-serif', color: 'var(--clay)', textTransform: 'uppercase', marginBottom: 4 }}>*Limited Time Offer</div>
                  <span className="old-price">45 MINS</span>
                </div>
                <div>
                  <span className="new-price">₹500</span><span className="unit">/ 1 hr</span>
                </div>
              </div>

              <Link className="button clay" href="/book?sport=cricket" data-testid="link-book-cricket" style={{ marginTop: 24, width: '100%' }}>
                Check availability <ArrowRight size={14} />
              </Link>
            </div>
          </motion.article>
        </div>
      </section>

      <section id="facilities" className="section shell">
        <motion.div {...reveal} style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Premium Experience</div>
          <h2 className="display" style={{ fontSize: 'clamp(50px, 8vw, 90px)', margin: '10px 0 20px' }}>Built for the players</h2>
        </motion.div>

        <div className="benefits-grid">
          {benefits.map((b, i) => (
            <motion.div key={b.title} className="benefit-card" {...reveal} transition={{ delay: i * 0.05 }}>
              <b.icon className="benefit-icon" size={40} />
              <div>
                <h4 className="benefit-title">{b.title}</h4>
                <p style={{ font: '500 13px/1.5 Manrope, sans-serif', color: 'var(--dim)', marginTop: 8 }}>{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="visit" className="visit">
        <div className="visit-text">
          <motion.div {...reveal}>
            <div className="eyebrow">Find your court</div>
            <h2 className="display visit-title">See you on<br/>the court!</h2>
            <p className="visit-address">
              Plot No. 28, VGN Victoria Park, Enford Street,<br/>Ambattur, Chennai – 600 053
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="https://maps.google.com/?q=Plot+No.+28,+VGN+Victoria+Park,+Enford+Street,+Ambattur,+Chennai" target="_blank" rel="noreferrer" className="button clay">
                <MapPin size={16} /> Get Directions
              </a>
              <a href="tel:+916385515521" className="button">
                <Phone size={16} /> Call Us
              </a>
            </div>
          </motion.div>
        </div>
        <div className="visit-map">
          {/* We use the brand board image slightly visible as a placeholder map background for vibe */}
          <img src="/brand/gravik-board.png" alt="Map Background" />
          <div className="map-overlay">
            <div className="qr-code">
              {/* Fake QR code visualization for the aesthetic */}
              <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                {Array.from({length: 16}).map((_, i) => (
                  <div key={i} style={{ background: Math.random() > 0.3 ? '#000' : 'transparent', borderRadius: 2 }} />
                ))}
              </div>
            </div>
            <span className="mono" style={{ color: 'var(--ink)', fontSize: 14 }}>Scan for directions</span>
          </div>
        </div>
      </section>

      <footer id="contact" className="footer">
        <div className="shell">
          <div className="footer-top">
            <div>
              <div className="footer-brand">
                <img src="/brand/gravik-logo-panel.webp" alt="GRAVIK" style={{ filter: 'grayscale(1) brightness(2)' }} />
              </div>
              <div className="footer-slogan">Play. Compete. Connect.</div>
              <p style={{ color: 'var(--dim)', marginTop: 16, font: '500 14px/1.6 Manrope, sans-serif', maxWidth: 300 }}>
                Chennai's new destination for Pickleball and Cricket Practice. Open daily.
              </p>
            </div>

            <div>
              <h4>Contact Us</h4>
              <div className="footer-links">
                <a href="tel:+916385515521" className="flex"><Phone size={16} /> +91 6385 515521</a>
                <a href="tel:+916385515531" className="flex"><Phone size={16} /> +91 6385 515531</a>
                <a href="mailto:gravik0523@gmail.com" className="flex"><Mail size={16} /> gravik0523@gmail.com</a>
                <a href="https://instagram.com/gravikpadel" target="_blank" rel="noreferrer" className="flex" style={{ color: 'var(--bone)' }}><Instagram size={16} /> @gravikpadel</a>
              </div>
            </div>

            <div>
              <h4>Location</h4>
              <div className="footer-links">
                <span style={{ lineHeight: 1.6 }}>Plot No. 28, VGN Victoria Park,<br/>Enford Street, Ambattur,<br/>Chennai – 600 053</span>
                <a href="https://maps.google.com/?q=Plot+No.+28,+VGN+Victoria+Park,+Enford+Street,+Ambattur,+Chennai" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', color: 'var(--clay)', marginTop: 8 }}>Open in Maps</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <span>© 2026 GRAVIK. All rights reserved.</span>
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
