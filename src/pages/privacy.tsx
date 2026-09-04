import { Link } from 'wouter';

export default function Privacy() {
  return (
    <main id="main-content" className="shell not-found-page">
      <div className="eyebrow">Privacy Policy</div>
      <h1 className="display booking-title">
        Privacy <span>policy.</span>
      </h1>
      <p className="not-found-body">
        We're finalizing our privacy policy ahead of launch. In the meantime, reach us
        directly at{' '}
        <a href="mailto:gravik0523@gmail.com" style={{ color: 'var(--clay)', textDecoration: 'underline' }}>
          gravik0523@gmail.com
        </a>{' '}
        with any questions about how we handle your information.
      </p>
      <Link href="/" className="button clay">
        Back home
      </Link>
    </main>
  );
}
