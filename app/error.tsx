'use client';

export default function RouteError({ retry }: { retry: () => void }) {
  return <section className="recovery-page wrap">
    <p className="eyebrow">SHENERIO</p>
    <h1>This page couldn’t load.</h1>
    <p>Try loading the page again or return to the House.</p>
    <div className="recovery-actions">
      <button type="button" className="button button-dark" onClick={retry}>Try again</button>
      <a className="text-link" href="/">Return home</a>
    </div>
  </section>;
}
