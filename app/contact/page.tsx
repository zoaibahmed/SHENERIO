import type { Metadata } from 'next';
import { CareContactForm } from '@/components/care-contact-form';
import { CareArrow, CarePage } from '@/components/care-page';

export const metadata: Metadata = {
  title: 'Contact SHENERIO',
  description: 'Contact and customer service information for the SHENERIO private storefront preview.',
};

export default function ContactPage() {
  return (
    <CarePage label="Contact SHENERIO" title="We are here to assist." intro="At SHENERIO, we value the relationship we build with our customers.">
      <div className="care-split care-contact">
        <div className="care-panel care-contact-form-panel">
          <h2>Contact form</h2>
          <CareContactForm />
        </div>
        <aside className="care-side care-contact-side" aria-labelledby="customer-service-heading">
          <h2 id="customer-service-heading">Customer service</h2>
          <p>For questions about our products, orders or general enquiries, our team welcomes your correspondence.</p>
          <address>London, United Kingdom.</address>
          <p className="care-side-note">The official customer service email is awaiting confirmation.</p>
          <a className="text-link" href="/faq">Frequently Asked Questions <CareArrow /></a>
        </aside>
      </div>
      <p className="care-closing">Thank you for your interest in SHENERIO.</p>
    </CarePage>
  );
}
