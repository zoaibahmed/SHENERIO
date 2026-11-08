# SHENERIO: pages and section architecture

Authority: primary PDF pp. 2–18 for brand/product copy; supplementary pp. 1–7 for editorial, customer care and functionality. Routes below are proposed, not existing endpoints. No unpublished products should appear as purchasable or indexed inventory.

## Sitemap

| Group | Route proposal | Required content / role |
|---|---|---|
| Home | `/` | All source homepage sections and closing/footer |
| Commerce | `/collections` | THE COLLECTIONS; introductory copy; both launch products |
| Commerce | `/collections/lumiclear` | LUMICLEAR landing using collection model; may initially share content with Collections, with deliberate canonical strategy |
| Commerce | `/products/lumiclear-target-serum` | Exact serum PDP, £26.00 GBP |
| Commerce | `/products/lumiclear-radiance-cream` | Exact cream PDP, £36.00 GBP |
| Brand | `/our-house` | Story, philosophy, future vision |
| Education | `/formulation` | Ingredient roles and formulation philosophy |
| Education | `/the-ritual` | Morning/evening routine, serum/cream cross-links |
| Editorial | `/journal` and `/journal/[slug]` | Journal listing and reviewed full articles |
| Care | `/contact`, `/faq` | Supplied enquiry form and all 17 FAQ entries |
| Care | `/shipping-delivery` | Approved markets, fees, fulfilment and delivery estimates |
| Care | `/returns-refunds` | Service summary and link to approved returns policy |
| Care | `/order-tracking` | Provider-backed authenticated/signed order tracking; helpful failure state |
| Legal | `/privacy-policy`, `/cookie-policy`, `/terms-conditions`, `/returns-policy` | Approved policies; cookie-settings action also available globally |
| Utility | `/search?q=...` | Product and editorial search; empty/no-result/error states |
| Commerce utility | `/bag` | Full basket fallback plus drawer; quantity/remove/summary/checkout |
| Checkout | Provider checkout URL | Secure payment, shipping/tax computation and confirmation |
| Customer | `/account` plus provider login/return | Sign-in/out, account overview, order history/detail and address management where supported |
| System | Not found, generic error, unavailable product, order confirmation/status | Clear recovery and care access |

Header proposal: wordmark/Home; Collections; Our House; Formulation; The Ritual; The Journal; Search, Account, Bag. At intermediate widths move secondary editorial links into a menu rather than squeezing labels. Collection disclosure contains two product links and View collection. Footer must keep every Discover/Customer Care/Legal/Connect item from supplementary p. 5. Cookie settings must reopen consent choices; social links need actual approved destinations.

Account functionality is mandated, but its detailed scope is not specified in the PDFs: the proposed history/address scope is a practical baseline, not supplied copy. Guest checkout should remain available. Search is required even with two products; an elaborate filter drawer is not justified until the catalogue grows.

## Homepage section specification

Order retains primary sections 1–10 and appends the supplementary footer. Complexity denotes frontend work with approved assets, not asset production or backend integration. References use V4=NŪMA and V3=Glowskin PDP.

### 1. Campaign hero — primary pp. 2–3

- **Objective/content:** establish SHENERIO, “THE ART OF ELEVATED SKINCARE.”, supporting line “Where thoughtful formulation meets contemporary luxury.” and supplied London/Korea introduction. Do not replace this with invented clinical promises.
- **Layout/type:** dominant original campaign image, large editorial serif headline, approved wordmark, compact sans supporting copy. Keep face/pack unobstructed.
- **Assets:** wide and phone campaign crops, logo; optional authored campaign video plus still poster.
- **Reference/motion:** V4 0 and 25.5–27.38 s wordmark treatment; V1 portrait scale. One short entrance, no blocking loader.
- **Mobile:** portrait crop with readable text in deliberate safe area; CTA in normal flow; no parallax.
- **CTA:** DISCOVER THE COLLECTION; OUR PHILOSOPHY → Collections and Our House philosophy anchor.
- **Complexity:** Moderate; media production is separate.

### 2. Introducing SHENERIO — primary p. 3

- **Objective:** source headline “A HOUSE BUILT AROUND THE ART OF SKINCARE.” and full supporting introduction.
- **Layout/type:** spacious serif statement with narrow sans paragraph beneath; not a wall of oversized text.
- **Assets:** optional small original texture still, no image required.
- **Reference/motion:** V4 2–6 s whitespace; optional single line reveal, not letter-by-letter reading delay.
- **Mobile:** same order, smaller measure and type; all text visible.
- **CTA:** DISCOVER OUR HOUSE.
- **Complexity:** Straightforward.

### 3. LUMICLEAR collection — primary pp. 3–4

- **Objective:** “THE LUMICLEAR COLLECTION.”, supporting sentence, both exact product names/descriptions and £26/£36 prices.
- **Layout/type:** paired product entries with different image scale, aligned commercial baselines, sans product names and price, serif section title.
- **Assets:** actual serum and cream packshots, textures, approved alternate images.
- **Reference/motion:** V4 8–12 s asymmetric retail; V2 21–22 s image alternate. Two-item stagger and optional hover crossfade.
- **Mobile:** stack two full entries; no compulsory swipe to see the cream. Both prices/actions readable.
- **CTA:** DISCOVER THE SERUM / DISCOVER THE CREAM. Direct Add to Bag is optional later; PDP link is source-led.
- **Complexity:** Moderate; confirmed product data required for commerce.

### 4. Formulation philosophy — primary p. 4

- **Objective:** “THOUGHTFUL INGREDIENTS. CONSIDERED FORMULATIONS.”, source ingredient-role introduction.
- **Layout/type:** product texture macro opposite quiet editorial copy and ingredient links; no efficacy percentages.
- **Assets:** genuine texture imagery and approved ingredient data; avoid stock molecules implying laboratory evidence.
- **Reference/motion:** V4 18–20 s image/copy balance; V3 4.5–5.5 s reveal. One clipped image entrance; optional short sticky scene only after performance review.
- **Mobile:** ordinary image then text/list; no pinning or floating callouts.
- **CTA:** EXPLORE OUR FORMULATION.
- **Complexity:** Moderate; advanced if optional pin approved.

### 5. London meets South Korea — primary pp. 4–5

- **Objective:** “A LONDON VISION. SOUTH KOREAN FORMULATION EXPERTISE.” and supplied origin narrative, with provenance verification gate.
- **Layout/type:** diptych or single wide image plus readable paragraph; serif heading and sans factual copy.
- **Assets:** original/rights-cleared origin imagery; no implied ownership of an unidentified factory.
- **Reference/motion:** V1 6–10 s split layout; V4 atmosphere. Gentle image entry, not animated geography/map gimmick.
- **Mobile:** stacked images with useful captions; no image if no authentic asset exists.
- **CTA:** Our House story link (proposed; no dedicated source button).
- **Complexity:** Straightforward to moderate.

### 6. Everyday suitability and makeup — primary p. 5

- **Objective:** retain “DESIGNED FOR EVERY SKIN. MADE FOR EVERYDAY RITUALS.” and source copy in the private content register; publish claims only after suitability/layering approval. Closing statement “Two essentials. Every skin type. Every day.” is also gated.
- **Layout/type:** human application photograph with narrow sans explanation, restrained serif heading.
- **Assets:** inclusive permissioned application imagery, suitability and makeup test decisions.
- **Reference/motion:** V4 18–20 s human crop, V1 application split. Static or single image reveal.
- **Mobile:** text/image stack, no before/after slider.
- **CTA:** Discover the ritual (proposed). No claim-dependent section should go live without an approved version.
- **Complexity:** Straightforward frontend; publication blocked by evidence.

### 7. SHENERIO ritual — primary pp. 5–6

- **Objective:** “MAKE EVERYDAY CARE A RITUAL.”; Treat with serum, then Nourish with cream; exact two-essentials closing line.
- **Layout/type:** numbered two-step progression, product images and concise sans directions under serif section title. Numbers encode real order.
- **Assets:** both packshots and application stills.
- **Reference/motion:** V3 16–18 s sequence clarity, not its shopping/delivery claims. First step then second entry; user never has to wait to read directions.
- **Mobile:** ordered vertical list. Full AM/PM including external cleanser/SPF remains on Ritual page.
- **CTA:** DISCOVER THE RITUAL.
- **Complexity:** Straightforward.

### 8. Journal — primary p. 6, supplementary pp. 1–2

- **Objective:** “THE JOURNAL.” and “A considered perspective on skincare, ingredients and modern beauty.”; feature approved niacinamide article.
- **Layout/type:** one lead story plus restrained list; serif titles, sans summary/date only when real.
- **Assets:** reviewed manuscripts and rights-cleared editorial images, no copied reference portraits.
- **Reference/motion:** V4 14–16 s row/image-band mechanism may inform focus/hover preview; no mandatory carousel.
- **Mobile:** static linked rows with images and visible titles, not hidden hover panels.
- **CTA:** EXPLORE THE JOURNAL; real article links only.
- **Complexity:** Moderate once editorial model/integration is included.

### 9. Newsletter — primary p. 6, supplementary p. 4

- **Objective:** primary headline/copy and JOIN THE SHENERIO COMMUNITY; include supplementary marketing consent/privacy link. Alternative supplementary headline can be used elsewhere.
- **Layout/type:** broad quiet band; serif heading, label/email field and sans action.
- **Assets:** none required; email-provider credentials, approved consent language and privacy route needed.
- **Reference/motion:** V2 footer subscription architecture, V4 restraint. Direct pending/success/error feedback only.
- **Mobile:** labelled field and full-width button, errors adjacent and announced.
- **CTA:** JOIN THE SHENERIO COMMUNITY.
- **Complexity:** Straightforward UI; moderate real integration.

### 10. Closing statement — primary pp. 6–7

- **Objective:** “SHENERIO. THE ART OF ELEVATED SKINCARE.”; “Thoughtful formulation. Contemporary luxury. A more considered skincare experience.”; invitation to discover SHENERIO.
- **Layout/type:** brand closing band above footer; serif statement, sans supporting line. It may form the footer's introduction to reconcile both PDFs.
- **Assets:** approved wordmark only.
- **Reference/motion:** V4 quiet editorial closure; no forced hero replay.
- **Mobile:** normal flow; headline wraps; never use massive overflowing logo as navigation.
- **CTA:** DISCOVER SHENERIO → Our House (proposed destination).
- **Complexity:** Straightforward.

### 11. Luxury footer — supplementary pp. 4–5

- **Objective:** all specified navigation and service/legal access, official contact/social information, tagline and verified provenance.
- **Layout/type:** four clear groups plus brand block, readable sans links and approved logo. Avoid duplicating adjacent newsletter form.
- **Assets:** official social URLs, copyright identity, approved care/legal content.
- **Reference/motion:** V2 42.65 s hierarchy, V4 spacing. Static links; optional simple disclosures on phones.
- **Mobile:** logical group sequence, large touch areas, cookie settings always reachable.
- **CTA:** contextual destination links, not a new generic sales action.
- **Complexity:** Straightforward.

## Product page section architecture

| Order / objective | Layout, type and assets | Interaction / reference | Mobile / action / complexity |
|---|---|---|---|
| 1. Identify and buy | Breadcrumb, fixed-ratio gallery and purchase column; exact name, price, confirmed size, stock, short description. Approved packshots/application/rear label | V3 0–4 s slide gallery; quantity and provider-backed Add to Bag; no invented stars | Gallery then purchase, optional later sticky CTA; Moderate |
| 2. Understand formulation | Serif heading, narrow sans source description and genuine texture macro | V4 image/copy, optional entry mask | Stack; link Formulation; Straightforward |
| 3. Benefits and highlighted ingredients | Source benefits plus ingredient-role list; avoid confusing generic ingredient properties with trial results | V3 section clarity with reduced density; semantic disclosures if long | Readable list, no hover tooltips required; Straightforward |
| 4. Texture, suitability and makeup | Source text, application image and visible caveats; no hidden suitability qualifiers | V4 editorial photo balance; mostly static | Stack; approved copy gate; Straightforward UI |
| 5. How to use | Ordered source steps, final-packaging direction, morning SPF guidance | Ritual step clarity; no scrolling animation needed | Ordered list; link full Ritual; Straightforward |
| 6. Full INCI and product facts | Full approved list with source order retained; size/provenance/facts | Accessible accordion if necessary; never replace INCI with highlights | Expandable readable text; Straightforward |
| 7. Delivery/returns | Actual rates/terms or links, not invented free-shipping threshold | Disclosure, visible summary before checkout | Large rows; care links; Straightforward UI, operations dependency |
| 8. Complete Your Ritual | Other actual product only, correct price/image | V4 restrained card; provider Add to Bag if enabled | One full-width card; Moderate |
| 9. Reviews when available | Genuine, permissioned customer content only | No source testimonial import; no star placeholders | Omit entire block until real; Moderate later integration |

Gallery zoom, sticky purchase panel, quantity controls and review moderation are proposed enhancements, not observed completed behaviours or explicit detailed PDF specifications.

## Supporting-page sections

| Page / objective | Sections, typography/layout and assets | Behaviour, mobile, CTA and complexity |
|---|---|---|
| Collections | Source heading/intro → two product entries → portfolio closing. Serif intro, sans commercial facts, original packshots | V4 paired retail; stack on phone; Discover product; Moderate. No needless filter controls |
| Our House | Source story → purposeful formulation → innovation → simplicity → long-term vision. Serif headings/narrow sans text, authentic origin/ritual imagery | V4 editorial pace; occasional image reveal, stacked phone; Collections/Formulation links; Straightforward |
| Formulation | Source intro → hydration → conditioning → nourishment → niacinamide → botanicals → commitment. Texture stills and readable ingredient entries | V4 balance/V3 information clarity; anchored sections not floating medical diagrams; product cross-links; Moderate |
| Ritual | Source introduction → full AM ordered steps → PM ordered steps → philosophy. Application images and two real products | Native anchor links preferable to tabs hiding half the content; vertical phone sequence; PDP links; Straightforward |
| Journal index/article | Landing intro, featured niacinamide piece, real published list; article title, author/date if verified, body and related collection | V4 editorial row focus treatment; static mobile, no empty promised articles; Read/Explore collection; Moderate |
| FAQ | 17 supplied questions grouped by brand/products/orders, preserving answer meaning and gates | V3 24–26 s semantic accordion, deep-linkable answers; touch and keyboard; Contact; Straightforward |
| Contact | Source introduction, approved email/location, five exact form fields, closing statement | Persistent labels, validation, rate-limited submission and success receipt; stack on phone; SEND ENQUIRY; Moderate |
| Care/legal | Document title, dated approved copy, clear subsections and related service links | Static server-rendered text, anchored contents for long documents; readable on phone; contact/policy links; Straightforward UI |
| Tracking | Secure lookup/sign-in → verified order status and carrier link → support | No publicly enumerable order IDs; explicit unavailable/error state; one-column phone; Track/contact; Moderate |
| Search | Query field → products first then relevant editorial results → no-result help | Server results or debounced enhancement, query URL retained; list on phone; product/article links; Moderate |
| Account | Provider sign-in/return → profile/orders/addresses → order details | Provider auth, session-scoped data, sign-out; single-column phone, no cinematic motion; Moderate integration |
| Bag/checkout | Lines, quantities/remove, provider totals, shipping/tax disclosure → provider checkout → order status | V3 purchase clarity only; no actual reference checkout. Focus-safe drawer + bag page; full-width phone; Checkout; Moderate/advanced integration |

## SEO source map

Use supplementary pp. 8–9 title/description pairs verbatim initially, subject to the same claim approvals as visible copy. Full descriptions and keyword list are retained in [complete extraction](evidence/TIL%202.txt). Do not silently truncate or rewrite them during implementation.

| Page | Exact supplied SEO title |
|---|---|
| Home | SHENERIO \| Luxury Skincare London |
| Our House | About SHENERIO \| Our Luxury Skincare Philosophy |
| Collections | SHENERIO \| Luxury Skincare Collection |
| Serum | LUMICLEAR TARGET SERUM \| SHENERIO |
| Cream | LUMICLEAR RADIANCE CREAM \| SHENERIO |
| Formulation | SHENERIO \| Skincare Ingredients and Formulation |
| Ritual | The SHENERIO Skincare Ritual |
| Journal | SHENERIO Journal \| Skincare and Beauty Insights |

Use canonical URLs, sitemap, robots rules and unique metadata. Product/Offer structured data must match visible approved provider-backed price/availability; no aggregate rating without real reviews. Use Article data only for published articles. Noindex private previews, account, bag, checkout and appropriate utility states. Collection duplication requires explicit canonical/redirect decisions. These are implementation recommendations beyond the supplied SEO copy.

## Growth model

Model collection, product, variant, media, ingredient reference, approved claim, ritual step, article and policy as reusable content entities. Keep clinical approval status separate from publish status. Build collection navigation from published collections, not hardcoded launch categories. Supplementary future cleansers, eye care, treatments, masks, serums and moisturisers are schema possibilities only; do not create fake live inventory or menu destinations.
