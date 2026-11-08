# SHENERIO: proposed visual direction and design system

Status: recommendation for approval, not an implemented redesign. Official identity and product copy remain governed by the PDFs; the PDFs do not supply an official colour palette, logo artwork or font system.

## Direction: formulation presented with editorial confidence

Use the NŪMA clip (V4, filename ending `b318d1739bb54a75ff286720dcaf087c.mp4`) for spacious compositions, skin close-ups and serif/sans contrast. Use the Glowskin PDP (V3) for gallery and purchase clarity. SHENERIO should feel like a focused skincare house: two complementary formulations with assured art direction and readily accessible ingredients, price and care information.

The distinctive moment should be an original campaign photograph with the SHENERIO wordmark and the source headline “THE ART OF ELEVATED SKINCARE.” Follow it with quiet, highly legible content. Clinical credibility comes from factual formulation information, not laboratory props, clinical badges or pale-green claim cards. London/South Korea is a documented brand narrative, not a visual excuse for stock landmarks or invented factory scenes.

No imitation of NŪMA's lettering, source campaign images or exact compositions. No random gradients, floating metric cards, faux glass controls, ubiquitous pill buttons, decorative numbering or fabricated endorsements. Numbers belong to the ritual sequence only.

The UI/UX skill's automated lookup suggested liquid glass and a feature-card/social-proof pattern. Those conflict with this brief and the actual references; they are deliberately rejected. Use its accessibility and interaction checks, not its generic layout recommendation.

## Proposed colour tokens

| Primitive | Hex | Semantic application |
|---|---|---|
| Porcelain | `#FAFAF7` | Main page surface; neutral and clean rather than beige luxury shorthand |
| White | `#FFFFFF` | Packshot stage, inputs and image margins |
| Ink | `#202723` | Main text, filled purchase action, footer |
| Slate | `#58615B` | Supporting copy on light surfaces |
| Mineral | `#DFE5DF` | Quiet formulation-section background |
| Line | `#C8CEC8` | Decorative rules; not the sole interactive boundary |
| Evergreen | `#305649` | Focus, selected controls, restrained links |
| Error | `#9B3030` | Form validation with message/icon |

Semantic aliases: `surface-page=Porcelain`, `surface-media=White`, `surface-education=Mineral`, `text-primary=Ink`, `text-secondary=Slate`, `action-primary=Ink`, `action-on-primary=White`, `focus=Evergreen`. Component tokens: button fill uses action-primary; input boundary uses Slate; accordion divider uses Line. Pale Line is decorative only. Never use secondary text over photos without a measured opaque field or sufficient scrim. Test actual rendered combinations and focus indicators before acceptance; do not assume a colour name guarantees contrast. Dark footer uses White text; error on dark needs a separate tested token.

No speculative gold accent; formulation, daylight and packaging should carry material richness. Final packaging colour may justify revising Mineral after physical/photographic review.

## Typography proposal

Display candidate: **Bodoni Moda**, regular/medium; UI and body candidate: **Manrope**, regular/medium/semibold. These are proposed choices, not identified reference fonts or approved brand fonts. Verify downloadable files, licensing, glyph coverage and web usage before selection; reserve premium commercial alternatives for a separately approved licence. Keep SHENERIO's logo as an approved artwork asset, not typeset approximation for production.

| Role | Wide desktop | Small mobile | Treatment |
|---|---:|---:|---|
| Campaign headline | 72–104 px | 38–52 px | Serif; line-height 0.98–1.08, natural line breaks |
| Main page title | 56–72 px | 36–44 px | Serif; line-height 1.08–1.15 |
| Section heading | 40–56 px | 28–36 px | Serif; mostly left aligned, editorial intro can centre |
| Product title | 24–32 px | 22–28 px | Sans medium; exact full product names preserved |
| Body | 17–18 px | 16–17 px | Sans; line-height 1.55–1.7, 55–70 character measure |
| Price/action | 15–17 px | 15–17 px | Sans medium; tabular price numerals if supported |
| Supporting label | 13–14 px | 13–14 px | Sans; never carry essential facts in tiny metadata |

Retain official uppercase hero/product/tagline wording; do not add tracked uppercase labels above every section. Use italics for occasional editorial phrases only, not as an automatic highlighted-word recipe. No per-letter tracking on body copy. At 200% text size, layouts must wrap rather than crop. Limit initial font payload to used Latin subsets and necessary weights; tune fallback metrics.

## Space and composition

- Base scale in CSS px: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Prefer 16–24 within copy blocks, 32–48 between modules, 80–128 between desktop sections; 48–72 between phone sections.
- Proposed wide content max: 1440 px; body/editorial max: 720 px. Gutters 64 px desktop, 32 tablet, 20 phone. 12-column desktop, 6-column tablet, 4-column phone; 24/20/16 px gaps respectively.
- Breakpoint intent: below 768 px stack; 768–1023 px compact two-column where readable; 1024 px+ editorial split. Content, zoom and controls decide final breakpoints.
- Hero uses generous portrait/product negative space with text separate from facial detail. Do not bury the shopping link inside the wordmark.
- Collection uses unequal image scale within balanced paired entries. Both exact names, prices and product links are visible. No carousel for two products.
- Mix a single centred brand statement with left-aligned ingredients, commerce and service information. Avoid full-page centred body prose.
- Image ratios: campaign 16:10 wide plus dedicated 4:5 mobile crop; product stage 4:5, detail 1:1, application portrait 4:5, Journal 3:2. Confirm safe areas per asset rather than assuming object-fit solves every crop.

## Component specifications

| Component | Geometry/content | States and behaviour | Mobile adaptation |
|---|---|---|---|
| Header | ~80 px desktop / 64 px mobile; approved wordmark, primary links, Search/Account/Bag | Stable readable background; optional simple sticky mode; visible focus; active route marked | Menu button + essentials; full labelled navigation drawer |
| Product menu | Compact two-product disclosure with names, thumbnail and collection link | Click/focus operation, Escape and outside dismissal; hover only supplemental | Nested disclosure, not miniature desktop mega-menu |
| Primary button | 48 px min height, 20–28 px side padding, 2 px radius, Ink/White | Hover/pressed colour shift; clear pending, disabled and error states; no movement of layout | Full width in purchase panel; 44×44 px minimum hit regions for icon controls |
| Secondary action | Underlined text or quiet 1 px outline, sufficient contrast | Focus visible; action wording matches destination | Persistent, no hover dependence |
| Product card | 4:5 image stage; title, short descriptor, GBP price, product link | Optional alternate image crossfade; Add to Bag explicit if enabled; no fake ratings | Vertical pair or readable two-up only where room permits |
| PDP gallery | Fixed-ratio viewport, thumbnail strip, labelled previous/next | Selected thumb exposed; no auto advance; optional accessible zoom dialog | Swipe enhancement plus buttons; logical reading order |
| Purchase panel | Product/price/confirmed size; short description, quantity, stock and Add to Bag | Error and unavailable states; genuine delivery terms only | Optional sticky purchase bar after original action leaves view; safe-area and focus clearance |
| Accordion | Heading/button, rule, plus/minus indicator | Expanded state announced, Enter/Space works, content stays in DOM | Large touch row; no tiny plus-only hit area |
| Bag drawer | Approx. 440–480 px wide; line image, name, price, quantity/remove, totals, checkout | Modal focus rules, Escape, focus restore, pending/error status; no silent line removal | Full-width sheet with independently scrollable contents |
| Form field | Persistent label; 48 px min field height; 2 px radius | Inline validation and linked error summary on failed submit; preserve values | Email keyboard/autocomplete; no placeholder-only label |
| Newsletter | One email field, primary source CTA and supplementary consent copy | Explicit success/error; no preselected marketing consent; service submission alone does not subscribe | Field and button stacked |
| Footer | Brand/closing band; Discover, Customer Care, Legal, Connect | All required destinations; cookie settings permanently reopenable | Logical groups; disclosures only if headings remain meaningful and links accessible |

## Photography and asset commissioning

Priority 1: approved logo/SVG and actual final packaging. Photograph each product front, angled, rear label and texture against consistent daylight/soft studio light, with colour-calibrated materials. Source matched alternate card images and retain real label legibility. Priority 2: one campaign combining honest skin texture and formulation ritual, including phone crop. Priority 3: application detail, restrained texture stills and authentic origin/editorial imagery. Record licences, model releases, crop permissions and alt-text intent in an asset register.

Do not retouch skin to imply product efficacy or present illustrative renders as confirmed final packaging. Audit frames must never be deployed. Without approved assets, an authorised prototype can use clearly labelled temporary blocks in private review; it cannot demonstrate final photographic quality.

## Responsive and motion principles

One memorable hero entrance, selective product reveal, direct feedback for interaction. No repeated reveal on every paragraph. Reduced motion gets the same content in final positions. Phone layouts retain the cinematic crop and typography but drop pins, secondary parallax and hover-only alternate imagery. Readability, price and shopping controls take precedence over exact desktop resemblance.

See [motion specification](SHENERIO_MOTION_AND_INTERACTION_SPEC.md) for triggers/tokens and [architecture](SHENERIO_PAGES_AND_SECTION_ARCHITECTURE.md) for source-based section ordering.
