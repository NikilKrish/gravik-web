import { Link } from 'wouter';

export default function Terms() {
  return (
    <main id="main-content" className="shell not-found-page">
      <div className="eyebrow">Terms of Service</div>
      <h1 className="display booking-title">
        Terms of <span>service.</span>
      </h1>
      <p className="not-found-body">
        We're finalizing our terms of service ahead of launch. In the meantime, reach us
        directly at{' '}
        <a href="mailto:gravik0523@gmail.com" style={{ color: 'var(--clay)', textDecoration: 'underline' }}>
          gravik0523@gmail.com
        </a>{' '}
        with any questions.
      </p>
      <Link href="/" className="button clay">
        Back home
      </Link>
    </main>
  );
}
