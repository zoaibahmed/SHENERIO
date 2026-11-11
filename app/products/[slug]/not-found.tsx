import { lumiclearCollection } from '@/lib/products';

export default function ProductUnavailable() {
  return (
    <section className="wrap" style={{ maxWidth: '850px', marginInline: 'auto', paddingBlock: 'calc(var(--header) + clamp(56px, 11vw, 150px)) clamp(56px, 11vw, 150px)' }} aria-labelledby="product-unavailable-heading">
      <p className="eyebrow">The collections</p>
      <h1 id="product-unavailable-heading" style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(48px, 7vw, 92px)', lineHeight: 1, marginBlock: '14px 18px' }}>Product unavailable.</h1>
      <p>Explore the Target Serum and Radiance Cream in the LUMICLEAR collection.</p>
      <a className="button button-dark" href={lumiclearCollection.href} style={{ marginTop: '24px' }}>Explore LUMICLEAR <span aria-hidden="true">↗</span></a>
    </section>
  );
}
