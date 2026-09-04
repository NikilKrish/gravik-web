import { Link } from 'wouter';

export default function NotFound() {
  return (
    <main id="main-content" className="shell not-found-page">
      <div className="eyebrow">404</div>
      <h1 className="display booking-title">
        Off the <span>court.</span>
      </h1>
      <p className="not-found-body">
        That page doesn't exist. Let's get you back in play.
      </p>
      <Link href="/" className="button clay">
        Back home
      </Link>
    </main>
  );
}
