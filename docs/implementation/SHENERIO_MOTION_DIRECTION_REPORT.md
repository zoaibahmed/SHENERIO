# SHENERIO | Motion direction and luxury UX correction

The soft-ivory identity, source product copy and private preview remain in place. LUMICLEAR Target Serum is £26.00 GBP and LUMICLEAR Radiance Cream is £36.00 GBP. Packaging and cosmetic texture imagery remain concept studies. [Brand and formulation PDF](../../TIL.pdf) · [Product brief](<../../TIL 2.pdf>)

## Before and after

The exact requested filename was unavailable. The local 50.10-second Windows recording has an embedded creation time of 09:28:04 UTC, about six seconds after the supplied timestamp. Its content matches the five specified review windows. Consecutive frames distinguish motion within a composition from the composition moving through the viewport.

| Window | What the baseline shows | Revised scene |
|---|---|---|
| 3–7 s | A scrubbed edge divides the two packs and their backgrounds. Product CTAs appear only in the normal-flow cards below. | One fixed stage moves the pack, material, paper tint, masked step names and fact rail on separately timed layers within one scrubbed timeline. Both product links stay mounted and accessible. The dark action follows the active product without moving keyboard focus. [Baseline frames](evidence/direction/before/film-collection.jpg) |
| 10–12 s | The macro and paper index appear in succession. Image depth and the upward index motion are separate. | A single scrubbed scene reframes the macro to the page margins as the raised ingredient panel moves into place. Compact layouts keep the full image and index in flow. [Baseline frames](evidence/direction/before/film-texture.jpg) |
| 23–27 s | The portrait and still life travel past the text. The studio image conveys material but gives little sense of either location. | The opening portrait leads into separate London and South Korea location frames. The focal points are limestone architecture in London and the roofline in Seoul. Each frame enters through a finite editorial mask. The captions distinguish place from the formulation narrative. [Baseline frames](evidence/direction/before/film-house.jpg) |
| 31–37 s | The macro opens onto a directory of anchor links and static ingredient chapters. | The macro changes crop while an ink editorial panel comes into place. Below it, a keyboard and touch atlas previews all five topics in place, then offers a direct chapter link. Detailed ingredient copy remains in normal flow. [Baseline frames](evidence/direction/before/film-atlas.jpg) |
| 39–44 s | The recording scrolls past the default Treat state and then the routine lists. The existing selector could swap the pack. | The selector stages the pack, corresponding texture, paper tone and masked name together. The product panel uses its source description and application directions. The controls sit above the scene on phones, and the morning and evening instructions keep distinct reading sequences. [Baseline frames](evidence/direction/before/film-ritual.jpg) |

The timed hero opens with the portrait at left and keeps the headline in the brighter negative space. The collection plate puts the pack in the central tonal field and moves material along the outer edge. The atlas uses broad macro imagery, a high-contrast reading panel and immediate ingredient selection. Our House uses authentic, credited place images in two offset frames. The site’s regular shopping, editorial and customer-care routes remain available directly.

## Motion and reference decisions

| Reference | What moves in the reference | Applied here |
|---|---|---|
| Glowskin homepage, 27–29 s | Product objects arrive in order while the scene holds. | The outgoing serum contracts and withdraws before the cream resolves, with its texture and information coordinated on one scrub. [Reference frames](evidence/reference-motion/reference-2.jpg) |
| Glowskin PDP, 3.2–3.8 s | A lateral image transition preserves the gallery frame and surrounding shopping controls. | Both PDP galleries retain their frame and independent purchase column. The collection also keeps its purchase links and the editorial rail in fixed positions. [Reference frames](evidence/reference-motion/reference-3.jpg) |
| NŪMA, 14.5–16 s | A narrow image strip grows into the chosen editorial row. | The material strip opens independently of the pack, and atlas selection uses a short, directionally clipped image reveal. [Reference frames](evidence/reference-motion/reference-4.jpg) |
| Nuvé, 11–14 s | A portrait yields to a focused text statement. | The formulation crop and reading panel share scroll progress, preserving a single spatial handoff. [Reference frames](evidence/reference-motion/reference-1.jpg) |

The hero opening is **time-based**. The collection, home texture handoff and Formulation introduction are **scroll-driven** on qualifying desktop viewports. Our House and selected editorial images use **entry-triggered** masks. Atlas, Ritual, galleries and navigation use **event-driven** transitions. The previously measured desktop wheel smoothing remains scoped to the homepage. Touch, keyboard and supporting routes use native scrolling.

## Supporting layouts and assets

The collection still life shows both names and prices before the product chapters. Serum leads with cool glass and flowing texture, while Cream uses a wider tactile gallery and a skin-application chapter. The Journal keeps its featured introduction and adds a two-format reading spread linking to existing skincare guides. Footer and header focus feedback, open FAQ answers and search result hierarchy were refined without adding care-page motion.

The new photography is location context. The London image shows Somerset House, and the South Korea image shows traditional houses in Bukchon, Seoul. Local WebP derivatives were resized and use crops in the layout. Credits and licence links appear with the photographs. [The wub, Somerset House Courtyard, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Somerset_House_Courtyard.jpg) · [Basile Morin, Bukchon at golden hour, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Traditional_hanok_houses_at_golden_hour_in_Bukchon_Hanok_Village_in_Seoul.jpg)

Still needed for approved creative delivery are a campaign master with a dedicated phone crop, approved pack front and angled views for both products, verified macro texture captures of the actual formulas, and serum and cream application photography. The current campaign, packaging, formula textures and application images remain illustrative.

## Browser evidence

- [Desktop walkthrough, 51 seconds](evidence/direction/after/direction-desktop.mp4) · [Phone walkthrough, 17 seconds](evidence/direction/after/direction-phone.mp4) · [Fresh hero opening frames](evidence/direction/after/desktop-opening-frames.jpg)
- [Collection before and after](evidence/direction/collection-comparison.jpg) · [Atlas before and after](evidence/direction/atlas-comparison.jpg) · [House before and after](evidence/direction/house-comparison.jpg) · [Ritual before and after](evidence/direction/ritual-comparison.jpg)
- [Forward transfer](evidence/direction/after/desktop-stage-transfer.jpg) · [Reverse transfer](evidence/direction/after/desktop-stage-reverse.jpg) · [Serum PDP gallery](evidence/direction/after/desktop-product-target-serum.jpg) · [Cream PDP gallery](evidence/direction/after/desktop-product-radiance-cream.jpg)

The production build, TypeScript and lint passed. Chrome ran 110 route and viewport checks with no broken links, browser errors or Axe violations in the scanned states. Six homepage scenarios covered desktop, tablet, phone and reduced motion. The new scene checks verified release from the sticky span, correct keyboard CTA order, scroll restoration after browser Back, resize fallback, all five atlas choices and rapid interruption of the Ritual switch. The desktop stage artwork was ready at the first stop. The phone excluded those desktop image requests and recorded a 400 px vertical touch gesture, plus a gallery swipe that selected the texture image. [Route checks](evidence/direction/site/browser-qa.json) · [Homepage regression](evidence/direction/homepage/browser-qa.json) · [Scene checks](evidence/direction/site/scene-layout-checks.json) · [Recording measurements](evidence/direction/after/motion-evidence.json)

The stage held 92 px from the viewport top for its 477 px runway at 1440 × 900. The captured forward and reverse midpoint were 53.9% and 53.0% of scroll progress, then returned to the Treat state. The Formulation aperture moved from its open state to an 11% right crop. The CSS opening ran for 1.08 seconds on desktop and 0.82 seconds on phone.

### Performance

The browser recordings are separate 25 fps captures. Chrome profiling used wheel input for the desktop trace and emulated touch input for the phone checks. A scripted 2.4-second sample crossed the collection and atlas independently. The throttled phone uses 4× CPU throttling, 1.6 Mbps download and 150 ms latency.

| Measurement | p95 frame interval | Intervals over 50 ms |
|---|---:|---:|
| Desktop collection, scripted, initial and isolated recheck | 32.9 / 16.8 ms | 0 / 0 |
| Desktop Formulation transition, scripted | 16.9 ms | 0 |
| Phone collection in normal flow, 4× throttled, scripted, initial and recheck | 16.8 / 16.8 ms | 0 / 1 |
| Phone Formulation, 4× throttled, scripted | 16.8 ms | 0 |
| Phone homepage, native touch | 16.8 ms | 0 |
| Phone homepage, native touch with 4× CPU throttling | 33.3 ms | 0 |

The desktop wheel trace recorded a longest main-thread task of 13.90 ms, a longest layout of 0.98 ms and a longest paint of 3.25 ms. It recorded zero child-node mutations inside the stage during forward and reverse input. The 4× touch trace recorded one 52 ms long animation frame and attributed no script to it. These results are local lab samples. Safari and physical-device performance remain unverified. [Collection sample](evidence/direction/performance-stage/performance.json) · [Isolated collection recheck](evidence/direction/performance-stage-recheck/performance.json) · [Wheel trace summary](evidence/direction/performance-stage/trace-summary.json) · [Atlas sample](evidence/direction/performance-atlas/performance.json) · [Phone touch](evidence/direction/performance-home/phone-frame-native-unthrottled.json) · [Throttled phone trace](evidence/direction/performance-home/phone-frame-attribution.json)
