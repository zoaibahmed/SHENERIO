import type { Metadata } from 'next';
import { CareArrow, CarePage } from '@/components/care-page';

export const metadata: Metadata = {
  title: 'Your shopping bag',
  description: 'Shopping bag status for the SHENERIO private preview.',
  robots: { index: false, follow: false },
};

export default function BagPage() {
  return (
    <CarePage label="LUMICLEAR" title="Your shopping bag">
      <div className="care-split care-bag">
        <section className="care-panel" aria-labelledby="bag-state-heading">
          <p className="care-status">Private preview</p>
          <h2 id="bag-state-heading">Your bag is empty.</h2>
          <p>Shopping will be available once the commerce service is connected. Explore the two LUMICLEAR essentials in the meantime.</p>
          <a className="text-link" href="/collections">Discover Collections <CareArrow /></a>
        </section>
        <section className="care-side" aria-labelledby="checkout-heading">
          <h2 id="checkout-heading">Checkout</h2>
          <p>Checkout is unavailable in this preview.</p>
          <button className="button button-dark care-unavailable" type="button" disabled>Checkout</button>
        </section>
      </div>
    </CarePage>
  );
}
