# SHENERIO opening and editorial refinements

Implemented locally on 11 November 2026. No push or deployment.

## Opening

`HomeIntro` is a homepage-only client component. It uses the same Bodoni wordmark typography as the existing header, an ivory curtain, a masked wordmark, the exact **ADVANCED SKINCARE. REFINED BY DESIGN.** signature, and one GSAP timeline that continues into the existing campaign photograph, headline, description and collection CTA. The previous CSS hero entrance and header-wordmark animation were removed. Scroll motion continues to use the outer hero frame, while the opening animates its nested picture and text.

The curtain starts revealing as soon as the critical image and fonts are ready. There is no minimum brand-animation hold. A 900ms readiness budget begins the handoff if a resource is late. Late hydration accelerates the continuation to fit the entry budget; if too little time remains it reveals the static hero. A separate 2.2s safety deadline releases the view if the application script fails. This is a fallback ceiling, not a deliberate wait.

The initial-entry decision runs before the body paints. It checks the homepage path, navigation type, fragment, reduced-motion preference, same-origin referrer and a session-only visited flag. Refresh, inner-page entry, browser history and subsequent homepage visits do not replay the introduction. Direct product, Journal and customer-care visits have no intro component.

The overlay is decorative (`aria-hidden`), never captures pointer events, never makes content inert and never locks scrolling. Keyboard, pointer, touch, wheel, route interruption, page hiding and runtime reduced-motion changes dismiss it and restore final styles. The existing shared scroll engine remains unchanged. The component cleans up its timeline, readiness listeners and timers, and accommodates React Strict Mode's development effect replay. Without JavaScript or with reduced motion, the hero is immediately static.

## Ritual and Journal

- `/the-ritual`: rounded the campaign image, overlapping introduction, combined TREAT/NOURISH study, routine sections and guidance box. Large surfaces use the existing 18–24px tokens; tabs use 12px. The study clips its animated layers within the rounded outer frame. Existing product controls, AM/PM instructions and sunscreen guidance remain.
- `/journal`: preserved the masthead, serif hierarchy, featured overlap composition, ivory colours and asymmetric reading-room layout. Refined corners, mobile panel insets, caption alignment and restrained arrow/image hover feedback.
- Ingredient-atlas link: replaced the green glass study with an actual clear-serum and pipette macro on a warm ivory reflective surface. Its existing image-hover interaction remains.
- Niacinamide: replaced the paper/glass image with actual serum-application photography. Refined the hero crop, 65ch reading width, 17–20px body type, paragraph spacing and mobile proportions. The three existing introductory paragraphs remain unchanged. The page and Journal card identify the work as a **private editorial draft**, with an explicit review notice and noindex metadata. Preview content remains excluded from search.

## Photography

- New `public/images/journal-serum-macro.webp`: [Ani Coloca / Pexels 30229020](https://www.pexels.com/photo/clear-serum-dropper-with-liquid-reflection-30229020/), cropped and compressed from the actual photograph. [Pexels license](https://www.pexels.com/license/), checked 11 November 2026.
- Niacinamide uses the existing [Ron Lach / Pexels 9442294](https://www.pexels.com/photo/a-woman-applying-serum-on-her-cheek-9442294/) stock application photograph, `ritual-application-serum.webp`. It is an editorial illustration, not evidence of a niacinamide concentration, product result or endorsement of SHENERIO. The article caption makes that distinction.

No reference-brand assets, generated molecules, invented manuscript sections or publication dates were added.

## Verification and evidence

Results and actual fresh-load recordings are in `evidence/opening-editorial/after`. Comparison captures are in `evidence/opening-editorial/before` and `after`. The final checks and measurements are recorded below.

The dedicated opening sample uses Chrome 156.0.8078.80, fresh browser contexts and the local production server. No recording or screenshots run during this sample. These are local emulated-browser observations, not field data or physical-device measurements.

| Opening sample | Desktop 1440×900 | Phone 390×844 |
| --- | --- | --- |
| Active coordinated timeline | 1.66s | 1.29s |
| Median / p95 frame interval | 16.7 / 17.0ms | 16.7 / 17.1ms |
| Intervals over 50ms during the active scene | 0 | 0 |
| Long tasks during the active scene | 0 | 0 |
| LCP | 476ms | 212ms |
| CLS | 0.0031 | 0 |
| Intro replay on refresh | No | No |

The desktop startup still recorded a 104ms task before the animation began; the phone startup recorded 90ms and 56ms tasks. These are recorded separately rather than claiming the whole application has no main-thread work. An earlier clip-driven curtain sample had two desktop frame intervals above 50ms. The final curtain uses a transform, with a temporary transform-compositing hint on the hero image; the final sample recorded none. The previous sample is retained in `opening-performance-before-promotion.json`. A single local sample is not a universal 60fps guarantee.

Raw measurement: [opening-performance.json](evidence/opening-editorial/after/opening-performance.json). The broader opening QA also collects timings while recording and taking screenshots; those figures include capture overhead and are separate from the dedicated sample.

### Checks

- `npm run lint`, `npm run typecheck` and `npm run build`: passed.
- `node scripts/opening-editorial-qa.mjs`: fresh desktop/mobile entries, refresh, direct product/Journal/care entry, internal navigation, Back/Forward, keyboard/pointer/wheel interruption, route interruption, runtime reduced motion, no scripting and aborted application scripts passed. The 1.6-second delayed-image case releases without a false loading indicator. At 1.6Mbps and 150ms latency, the late-hydration path shows the static hero; no intro remains over the application.
- Fifteen editorial route/viewport checks passed across Ritual, Journal and Niacinamide at 1440, 1024, 768, 390 and 320px. No horizontal overflow or automated axe violations. TREAT/NOURISH selection, keyboard tabs, morning sunscreen wording, Journal hover and navigation, noindex draft state and the original three-paragraph manuscript were checked.
- `npm run test:homepage`: all six scenarios passed, including menu/quick-view focus handling, galleries, ingredient controls and reduced motion. Observed initial CLS ranged from 0 to 0.0088.
- `npm run test:browser`: 110 route/viewport checks passed. No broken internal links, runtime errors or automated axe violations. Existing commerce controls, care/search flows and unavailable states passed.
- The Next.js development server was also tested with a fresh context. React Strict Mode initially exposed an effect-replay cancellation; the controller now defers from a passive effect, and the development opening completes correctly.

Raw results: [opening and editorial QA](evidence/opening-editorial/after/opening-editorial-qa.json), [homepage regression](evidence/opening-editorial/regression-home/browser-qa.json), [route regression](evidence/opening-editorial/regression-site/browser-qa.json).

### Captures

- Genuine continuous fresh-load recordings: [desktop](evidence/opening-editorial/after/opening-desktop.mp4), [mobile](evidence/opening-editorial/after/opening-phone.mp4), [delayed photograph](evidence/opening-editorial/after/opening-delayed-photo.mp4). The contexts were created before navigating to the homepage. MP4 files are direct transcodes; no cuts, speed changes or reconstructed animation.
- Before/after: [Ritual](evidence/opening-editorial/ritual-before-after.jpg), [Journal and atlas](evidence/opening-editorial/journal-before-after.jpg), [Niacinamide and reading width](evidence/opening-editorial/article-before-after.jpg), [mobile](evidence/opening-editorial/mobile-before-after.jpg).
- Full-page screenshots: [desktop Ritual](evidence/opening-editorial/after/desktop-ritual-full.jpg), [mobile Ritual](evidence/opening-editorial/after/phone-ritual-full.jpg), [desktop Journal](evidence/opening-editorial/after/desktop-journal-full.jpg), [mobile Journal](evidence/opening-editorial/after/phone-journal-full.jpg), [desktop article](evidence/opening-editorial/after/desktop-article-full.jpg), [mobile article](evidence/opening-editorial/after/phone-article-full.jpg).

Physical iOS/Android devices and field INP measurements were unavailable. The photography remains stock editorial illustration. The manuscript remains unapproved. The local preview runs at `http://127.0.0.1:3000`; nothing was pushed.
