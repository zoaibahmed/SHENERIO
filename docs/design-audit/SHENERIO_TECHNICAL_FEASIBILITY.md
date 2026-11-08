# SHENERIO: technical feasibility

## Existing state and conclusion

The folder has six reference assets and no app, repository, package configuration or existing integrations. No migration is warranted yet. It is realistic to build the demonstrated editorial layouts, image reveals, gallery, menu and hover interactions. A comparable finished result depends on original imagery, confirmed packaging/content, commerce access and several design/QA iterations. A recording cannot establish pixel-perfect source dimensions, easing, browser behaviour or production readiness.

The reference site backends are unknown; no clip demonstrates payment or customer-session operation. Commerce must be designed and tested independently. The complete effect-by-effect classification is in the [motion catalogue M01–M22](SHENERIO_MOTION_AND_INTERACTION_SPEC.md), including advanced and excluded effects.

## Proposed architecture and alternatives

| Area | Recommendation / reason | Trade-off or alternative |
|---|---|---|
| Storefront | Next.js App Router, React, TypeScript; server-render commercial/editorial content, client boundaries only around interactive features | Proposed greenfield choice. Custom Shopify theme is a valid lower-operations option; bespoke design need not look templated on either platform |
| Styling | CSS custom-property tokens + CSS Modules; Tailwind optional if agreed before foundation | No need for both utility-heavy CSS and a competing component theme. Typography, imagery and spacing are custom |
| Motion | CSS for feedback; GSAP + ScrollTrigger only for coordinated scroll/hero sequences | One owner per animated property. Do not add Motion/Framer Motion in parallel without a specific unmet need |
| Scrolling | Native browser scrolling initially | Lenis deferred until testing justifies added lifecycle/accessibility complexity |
| Commerce | Candidate: headless Shopify catalogue/variants/inventory/cart with Shopify-hosted checkout | Provider fees, plan, supported markets and required checkout branding need merchant confirmation. Hosted checkout has customization constraints |
| Accounts | Provider-supported account login/order history and address features, hosted first if suitable | Custom account interface increases integration/testing scope; do not build password storage |
| Editorial content | Start with commerce-managed pages/blog/metafields if sufficient; separate CMS only if authoring/versioning requires it | Avoid two conflicting product/price sources. Versioned approval records needed whichever tool is chosen |
| Media | Responsive image pipeline/CDN; explicit dimensions and crops; poster-first optional video | Existing MP4s are reference recordings, not website backgrounds |
| Email/support | Provider-backed subscription and server-side contact endpoint | Credentials, consent workflow, mail domain and operations ownership missing |
| Hosting | Managed Next.js-compatible deployment with preview/production isolation and CDN | Vendor/domain/budget are unselected. No deployment requested during audit |

Server Components can keep noninteractive work off the client; proposed client islands are gallery, bag, navigation, search enhancement and selected animation controllers. This follows the [Next.js server/client boundary guidance](https://nextjs.org/docs/app/getting-started/server-and-client-components). Its [image guidance](https://nextjs.org/docs/app/getting-started/images) supports responsive sizing and image optimization. These capabilities do not guarantee performance without asset budgets and testing.

## Commerce boundary

Proposed flow: product/variant from provider → cart mutation → canonical provider totals → user reviews bag → redirect to provider checkout URL → provider order confirmation/status. Shopify's [cart guide](https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage) documents cart operations and `checkoutUrl`; its [Customer Account API](https://shopify.dev/docs/api/customer/latest) is a separate integration to configure and validate, not an automatic consequence of adding a cart.

- Price and stock authority stays with provider, not browser/local storage. Validate merchandise, quantity and availability on mutation and checkout. Format GBP correctly; confirm tax display and markets with merchant.
- Reconcile optimistic UI against actual response. Serialize/conflict-handle quantity changes; prevent double submissions; preserve existing cart on network failure. Show unavailable/out-of-stock states explicitly.
- Persist cart identity securely for the chosen integration; do not expose secret admin credentials. Public storefront tokens and server secrets have different rules. Isolate sessions, protect account endpoints and validate redirect destinations.
- Provider handles payment capture; storefront does not store card data. Secure checkout alone does not solve merchant fulfilment, tax, returns or policy setup.
- Webhooks require signature verification, deduplication/idempotency, retries and monitoring where used for content/inventory cache updates. Never treat a browser success URL alone as proof of payment.
- Authenticated tracking/order history must enforce ownership; signed provider status links are preferable to open order-number enumeration.
- Newsletter signup needs actual provider response, abuse controls and consent record. Contact submission needs server validation, rate limits, delivery failure handling and no secrets in client code.
- Consent-aware analytics must respect configured choices, with settings reopenable. Policy text and legal interpretation require merchant/privacy approval; this audit is not legal advice or a jurisdiction-specific compliance assessment.

## Animation implementation feasibility

Straightforward: product image alternates, two-item staggers, gallery track movement, manual carousel, standard accordions, button feedback. Moderate: expanding navigation with staged contents, line masks after font load, clipped image sequences, accessible modal drawers and sticky purchase UI. Advanced: long pinned scenes and interacting scroll timelines across route changes, dynamic content and viewport resizing. Special assets/research: believable product rotation/liquid/skin film, real 3D and accurate packshot renders.

Use [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) for bounded scroll timelines if approved, with [matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) and cleanup for responsive/reduced-motion variants. No need for WebGL to achieve the core look. Do not infer 3D merely because a product cutout moves. Video frame scrubbing is not demonstrated and would need a dedicated compressed sequence/seek performance spike; do not use the source screen recordings for it.

Not advisable: scan overlays/AI diagnostics, transformation comparisons without evidence, borrowed clinical/ethical badges, made-up reviews, forcing long scroll sequences between purchase and ingredients. These are brand/content decisions, not limitations of CSS.

## Proposed performance budgets and checks

These are design targets, not measured results. There is no running app to benchmark.

| Measure | Initial target | Verification |
|---|---|---|
| Real-user LCP / INP / CLS | ≤2.5 s / ≤200 ms / ≤0.1 at 75th percentile | Instrument after launch; lab runs before launch are proxies, not field proof |
| Phone hero still | Aim ≤250 KB served variant, crop permitting | Inspect actual quality and CDN output; increase only with measured justification |
| Initial phone visual payload | Aim ≤800 KB including critical images/fonts, excluding deferred film | Cold network trace; not the size of the source master |
| Route's first-load compressed JS | Aim ≤200 KB total, measure shared/runtime cost explicitly | Bundle report and network trace; revise architecture if over budget |
| Font files | Aim ≤120 KB initially, only used styles/subsets | Network report and fallback-layout review |
| Motion | Responsive interaction and frame work within ~16.7 ms at 60 Hz | Real-device performance trace; reduce layers/pins if frames drop |
| Video | Optional, loaded after essential content; no compulsory large autoplay download | Test slow network/data-saving, still poster and pause behaviour |

The standard metric thresholds are documented by [Google PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/about). Budgets for bytes/frames above are our proposals. Largest image gets priority loading; below-fold images lazy-load with reserved geometry. Do not lazy-load the likely LCP image, or hide it behind animation initialization. Restrict font weights and third-party apps, reserve all media dimensions and keep text server-visible. Avoid nested sticky/fixed elements inside transformed scroll containers. Mobile decoded image memory can exceed compressed file size; use appropriately sized variants, not many full-resolution layers.

## Accessibility and browser acceptance

Target WCAG 2.2 AA; measure rather than claim compliance. Use semantic landmarks, one logical page heading, linked labels, useful image alternatives, visible focus, error association and stock/cart status announcements. Prefer 44×44 CSS-px hit areas as a design target, including tiny visual arrows. Check 200% text sizing and 320 CSS-px reflow. Dialog interactions follow [WAI's modal pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/); reduced-motion behaviour follows [MDN's preference guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

Support current Safari/iOS Safari, Chrome/Android Chrome, Firefox and Edge at launch; confirm exact supported versions during foundation. Native HTML/CSS is the baseline. clip-path, masks, sticky layouts and viewport units need Safari/Android testing; offer simple opacity/static alternatives. No browser-specific scrolling effect may hide price, INCI or checkout. Test keyboard, VoiceOver/NVDA, touch and pointer, with consent/banner/sticky CTA combinations and landscape/short-height viewports.

## SEO and operational requirements

Server-render source content and metadata. Preserve supplied SEO descriptions subject to approval; valid canonical/sitemap/robots and correct redirects. Product/Offer and breadcrumb data must match actual stock/price; no invented rating schema. Keep drafts private/noindex; do not let approval-pending copy leak into structured data or snippets. Journal content needs editorial review, not keyword stuffing. Monitor cart failures, order handoff, webhook errors, broken links and image load failures. Use preview fixtures separately from live customer/order data.

## Candid limitations

Equivalent technical techniques are feasible; exact visual parity is not promised. The references have short, curated desktop demonstrations and may omit slow loads, bugs and touch behaviour. Production SHENERIO will need clearer controls, no unsupported claims, a shorter mobile story and the payment provider's checkout constraints. High-quality original assets and iterative art direction remain the critical path, not adding libraries.

Official documentation was consulted on 8 November 2026. Exact dependency versions, API release and provider plan must be selected and pinned at implementation time; this audit installs nothing.
