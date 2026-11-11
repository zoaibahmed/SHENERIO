import { productHref, products } from '@/lib/products';
import { chapters, utilities } from '@/lib/site-navigation';

const groups = [
  { title: 'Discover', links: [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    ...products.map(product => ({ label: product.name, href: productHref(product) })),
    ...chapters,
  ] },
  { title: 'Customer care', links: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Frequently Asked Questions', href: '/faq' },
    { label: 'Shipping & Delivery', href: '/shipping-delivery' },
    { label: 'Returns & Refunds', href: '/returns-refunds' },
    { label: 'Order Tracking', href: '/order-tracking' },
    ...utilities,
  ] },
  { title: 'Legal', links: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Terms & Conditions', href: '/terms-conditions' },
    { label: 'Returns Policy', href: '/returns-policy' },
  ] },
];

export function SiteFooter() {
  return <footer className="site-footer wrap" id="footer">
    <div className="footer-intro">
      <a href="/" className="brand" aria-label="SHENERIO homepage">SHENERIO</a>
      <p>Advanced Skincare. Refined by Design.<br />London, United Kingdom.<br />Formulated and manufactured in South Korea.</p>
      <p className="preview-label">Private storefront preview.<br />Editorial and texture imagery is illustrative.</p>
    </div>
    <div className="footer-groups">
      {groups.map(group => <nav key={group.title} aria-label={group.title}>
        <h2>{group.title}</h2>
        {group.links.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}
      </nav>)}
      <div className="footer-connect">
        <h2>Connect</h2>
        <p>Instagram<br />TikTok<br />Pinterest</p>
        <small>Official profiles awaiting confirmation.</small>
      </div>
    </div>
    <div className="footer-bottom"><span>© SHENERIO. All rights reserved.</span><a href="#main">Back to the beginning ↑</a></div>
  </footer>;
}
