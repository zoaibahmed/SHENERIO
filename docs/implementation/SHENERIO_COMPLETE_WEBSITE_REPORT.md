# SHENERIO Phase 2 website report

The private storefront extends the existing Light. Texture. Ritual. homepage into 22 navigable pages. The shared header, footer and product preview now link to full destinations. The homepage retains the campaign portrait, LUMICLEAR stage, material-to-ingredient handoff and two-step ritual. Phase 2 refinements bring the portrait into the opening mask earlier, reveal the House image with a moving matte, connect quick views to product details, and size the closing wordmark against its own content width.

The original PDFs provide the brand, formula, routine, FAQ, contact and footer content. The design audit established the information architecture and approval boundaries. The prior flagship review records the observed NŪMA editorial and Glowskin PDP sequences and the Tatcha and Dr. Barbara Sturm findings. NŪMA informed the editorial pacing and image-backed navigation rows. The product pages use the Glowskin reference’s stable gallery footprint, direct thumbnail controls and progressively disclosed details. No reference photography is served by the app. The exact recording named in the first Phase 2 message was unavailable. The available 26.94-second Windows recording of the current homepage was created at 13:42:07 UTC, six seconds after the supplied timestamp. Its identity is unverified. [Reference study](SHENERIO_FLAGSHIP_REVIEW.md) · [PDF and project audit](../design-audit/SHENERIO_PROJECT_AND_PDF_AUDIT.md)

## Route and feature checklist

| Route | Private preview behaviour |
|---|---|
| `/` | Existing homepage with refined campaign, chapter transitions, shared navigation, linked product previews and local newsletter feedback. |
| `/collections` | Portrait-led catalogue introduction and both LUMICLEAR products. |
| `/collections/lumiclear` | Separate dark collection feature around the two-step ritual. Both collection pages have distinct content and self-canonicals. |
| `/products/lumiclear-target-serum` | £26.00 GBP. Three-view gallery, arrows and thumbnails, quantity control, ingredient and use disclosures, delivery/returns and cream pairing. |
| `/products/lumiclear-radiance-cream` | £36.00 GBP. Same controls with a warmer gallery treatment, cream-specific details and serum pairing. |
| `/our-house` | Framed portrait, London and South Korean provenance and all four source philosophy principles. |
| `/formulation` | Macro photography, ingredient index and sourced cosmetic ingredient roles. |
| `/the-ritual` | Keyboard and touch controlled serum-to-cream scene. Full morning and evening routines include the source morning sunscreen guidance. Cleanser and sunscreen are routine steps. |
| `/journal` | Magazine index with the available niacinamide introduction. |
| `/journal/niacinamide` | Reusable article layout displaying the supplied introduction as an editorial preview. Related-article support is ready for reviewed manuscripts. |
| `/contact` | Full Name, Email Address, Enquiry Subject, optional Order Number and Your Message. Browser validation and local preview feedback. |
| `/faq` | All 17 source questions in keyboard-operable disclosures. Approval and service notes qualify answers where needed. |
| `/shipping-delivery` | Structured delivery information placeholder pending markets, rates and timeframes. |
| `/returns-refunds` | Customer-care guidance with terms pending. |
| `/order-tracking` | Clear provider pending state with links to relevant help. |
| `/search` | GET search across catalog product names and ingredients, editorial landing pages and published Journal entries. Draft introductions are excluded. |
| `/bag` | Empty preview bag and unavailable checkout. |
| `/account` | Preview state pending merchant authentication and account service. |
| `/privacy-policy` | Approval placeholder. |
| `/cookie-policy` | Approval placeholder. Consent controls are reserved for a real tracking integration. |
| `/terms-conditions` | Approval placeholder. |
| `/returns-policy` | Separate legal approval placeholder linked from customer care. |
| Unmatched route, product or article | Branded 404 with useful recovery links. The runtime error boundary offers retry and a return to the House. |

## Design and motion

The forest, mineral and porcelain palette, type system, fixed navigation, focus states and link treatments carry across layouts. The catalogue is image-led, product details use a gallery and a buying-information column, Our House has a full editorial narrative, formulation is a material study, and care and legal pages use quieter, readable layouts.

Motion is layered by purpose. The homepage keeps its bounded GSAP hero, stage transfer and ritual choreography. Lenis remains limited to eligible fine-pointer desktop homepage wheel input, based on the earlier isolated wheel comparison. Supporting routes use native scrolling, observer-triggered heading, mask, stagger and image entrances, a near-viewport desktop image-depth timeline where supported, and CSS gallery transitions. Same-origin native anchor navigation can use the browser’s short cross-document transition in supporting browsers. Content is rendered on the server, so entry effects are optional. Reduced motion removes the enhancements. [View transition specification](https://www.w3.org/TR/css-view-transitions-2/) · [Previous wheel comparison](evidence/flagship/after/wheel-comparison.json)

## Browser evidence

- Desktop capture, 23.40 seconds at 1440 × 900. It shows the homepage entrance, collection navigation, product gallery, quantity and disclosures, product pairing, brand editorial pages, the ritual and Journal. [Desktop recording](evidence/phase2/phase2-desktop-final.mp4)
- Phone capture, 12.56 seconds at 390 × 844. It shows the chapter menu, cream gallery and quantity, the ritual and product search. [Phone recording](evidence/phase2/phase2-phone-final.mp4)
- [Homepage before](evidence/phase2/before-desktop-home.png) · [Homepage after](evidence/phase2/desktop-home.png) · [LUMICLEAR](evidence/phase2/desktop-collections-lumiclear.png) · [Serum desktop](evidence/phase2/desktop-products-lumiclear-target-serum.png) · [Cream phone](evidence/phase2/phone-products-lumiclear-radiance-cream.png)
- [Our House](evidence/phase2/desktop-our-house.png) · [Formulation](evidence/phase2/desktop-formulation.png) · [Ritual](evidence/phase2/phone-the-ritual.png) · [Journal](evidence/phase2/desktop-journal.png) · [Contact](evidence/phase2/desktop-contact.png) · [Mobile navigation](evidence/phase2/phone-expanded-navigation.png)

`npm run build`, `npm run typecheck` and `npm run lint` passed on the production build. Lint uses the TypeScript 6 compiler API compatibility package alongside the native TypeScript 7 checker. The production dependency audit reported zero advisories. npm reported eight moderate advisories in the development dependency tree after adding lint. [TypeScript compatibility guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-60)

The full Chrome sweep passed 66 checks across all 22 routes at 1440, 768 and 390px. It reported zero broken internal destinations, browser errors or Axe violations in the scanned states. The mobile interaction sweep verified navigation and history, quick-view focus return, both PDP galleries and quantities, ritual keyboard selection, FAQ disclosures, preview contact validation with zero transmissions, search and three branded 404s. The homepage headline and closing wordmark also fit with scripts disabled at 320, 390, 768 and 1440px. The runtime error boundary was compiled but not fault-injected. [Production browser results](evidence/phase2/browser-qa.json) · [Search results](evidence/phase2/phone-search-results.png)

The separate homepage regression passed all six Chrome scenarios, including real wheel input, emulated touch input, hover alternates, the sticky ritual and reduced motion. Those runs recorded zero layout shift, Axe violations or browser errors. [Homepage regression results](evidence/phase2/homepage-regression/browser-qa.json)

### Frame pacing

The isolated Chrome samples use a cold context and a scripted 2.4-second scroll through the first 2,640 CSS pixels. Desktop is 1440 × 1000. The 390 × 844 sample uses 4× CPU throttling, 1.6 Mbps downstream and 150 ms latency. Frame intervals are from `requestAnimationFrame`. The recordings are separate 25fps captures.

| Route and viewport | LCP | Median frame interval | p95 interval | Intervals over 50 ms | CLS |
|---|---:|---:|---:|---:|---:|
| Homepage desktop | 1.04 s | 16.7 ms | 17.1 ms | 1 | 0 |
| Homepage throttled phone | 2.60 s | 16.7 ms | 66.7 ms | 5 | 0 |
| Target Serum desktop | 0.88 s | 16.7 ms | 16.7 ms | 0 | 0 |
| Target Serum throttled phone | 2.94 s | 16.7 ms | 16.8 ms | 0 | 0 |

The homepage's throttled sample had fewer slow intervals than the prior flagship sample, but it still missed frames and its largest-content paint was later in this run. The product page held a more consistent interval during its measured scroll. This is a single lab sample per scenario. Physical phone performance, Safari and field metrics remain unverified. [Homepage sample](evidence/phase2/performance-home/performance.json) · [Product-page sample](evidence/phase2/performance-serum/performance.json) · [Previous flagship sample](evidence/flagship/after/performance.json)

## Dependencies before merchant launch

- Approved pack photography, approved packaging artwork, final pack sizes, manufacturer INCI for both formulas and final suitability, makeup and other product claims. The reference 30 ml and 50 ml figures are labelled pending, and the gallery uses concept imagery.
- Commerce catalog IDs, inventory, cart, checkout, payment, market and tax setup, order tracking, account provider and approved delivery and returns details.
- Official customer-service email, contact delivery, verified social profiles and a subscription provider with reviewed consent language.
- Reviewed legal text, any consent-controlled analytics configuration and reviewed full Journal articles. The policy and editorial approval states remain within the private preview.
- Approved canonical domain, access control for a hosted private preview and physical-device testing before public launch. The checked site is local and carries `noindex` metadata and headers.
