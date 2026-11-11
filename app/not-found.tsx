export default function NotFound() {
  return <section className="recovery-page wrap">
    <p className="eyebrow">SHENERIO / 404</p>
    <h1>This page is unavailable.</h1>
    <p>Explore the LUMICLEAR collection or search the House to find what you were looking for.</p>
    <div className="recovery-actions">
      <a className="button button-dark" href="/collections">Explore collections</a>
      <a className="text-link" href="/search">Search SHENERIO</a>
      <a className="text-link" href="/">Return home</a>
    </div>
  </section>;
}
