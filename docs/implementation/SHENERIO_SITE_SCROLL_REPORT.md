# SHENERIO site-wide scrolling and motion

## Scroll architecture

The previous build mounted Lenis inside the homepage scene controller. Supporting routes used native wheel scrolling on the same document. The difference was input handling. Chrome recorded 120 px steps on the supporting routes while the homepage eased the same input over multiple frames.

- `app/layout.tsx` and `components/scroll-engine.tsx` mount one shared engine. Lenis and ScrollTrigger share the GSAP ticker on devices reporting a fine primary pointer and hover. Keyboard, touch, reduced-motion, fragment and history navigation use the browser. The next wheel input resynchronises if a native position change lands as the preceding easing completes. ScrollTrigger refreshes on relevant geometry changes and font readiness.
- `components/motion.tsx` and `components/atlas-motion.tsx` own route-scoped GSAP contexts and revert their scenes on navigation or media-query changes. The homepage collection keeps its short reversible sticky stage. Chrome selected a moving hero element as a history scroll anchor and restored approximately 507 px instead of 620 px. `app/ivory.css` excludes the moving hero from anchor selection while preserving browser restoration.
- `components/experience.tsx` and `app/globals.css` contain nested menu and preview scrolling. The document lock follows the native dialog’s `open` state.

## Rendered scenes

| Page | Change |
| --- | --- |
| Homepage | First-paint aperture and wordmark reveal, staggered headline masks, always-available collection CTA, and a scroll-linked portrait crop and rule leading to the manifesto. Phones get a dedicated portrait crop, quicker entrance and a short native scroll-driven exit where supported. |
| Our House | Full-width brand statement, distinct location masks and a scroll-drawn rule between the London and South Korea chapters. The closing statement uses a dark field. The photographed locations retain credits and identify the places shown. |
| Formulation | Cream and serum macro diptych. A bounded scrub reframes the large plate, opens the inset and brings the reading panel into place. Ingredient tabs show a factual summary and link to the complete chapter. |
| The Ritual | The product and texture wipe is coordinated with a paper-tone shift and the incoming editorial panel. Treat and Nourish remain explicit, interruptible controls. |
| Journal | Shorter masthead, asymmetric lead story, and guide photographs with matching hover and keyboard-focus feedback. |
| Collections and products | Opposing still-life entrances tie the two products together. Gallery thumbnails have clearer selected and focus states. Existing directional galleries, separate serum and cream texture chapters, and £26.00/£36.00 prices remain available. |
| Customer care and legal | Shared scroll behaviour and restrained interaction treatment. |

## Reference comparison

| Source | Frame-to-frame comparison |
| --- | --- |
| Latest SHENERIO recording | The available 60.4-second Windows capture shows the prior ivory site, homepage product stage, and visits to Our House, Formulation, The Ritual and Journal. Its metadata is 12:08:56 UTC, seven seconds from the timestamp in the requested filename. The exact filename was unavailable. The new version preserves that campaign and develops the supporting transitions into connected scenes. [Before contact sheet](evidence/site-scroll/before/recording-overview.jpg) |
| Nuvé, 11–14 s | The portrait clears the field as the manifesto gains emphasis. SHENERIO keeps the portrait in view during the initial crop and hands the eye to the House headline with a moving rule. [Reference frames](evidence/reference-motion/reference-1.jpg) |
| Glowskin homepage, 27–29 s | Products enter in sequence while the display surface holds. SHENERIO’s short reversible stage couples product movement to the cream aperture and incoming information. The paired collection photography uses a finite entrance. [Reference frames](evidence/reference-motion/reference-2.jpg) |
| Glowskin product page, 3.2–3.8 s | A new image travels across the fixed gallery frame. SHENERIO uses a directional gallery handoff with independent thumbnails, keyboard navigation and swipe. [Reference frames](evidence/reference-motion/reference-3.jpg) |
| NŪMA, 14.5–16 s | A narrow photographic strip opens into the selected category row. The SHENERIO menu uses a compact expansion, while the atlas inset and location bridge use narrow elements to cue a change in chapter. [Reference frames](evidence/reference-motion/reference-4.jpg) |

The motion is built from still photographs and composited product studies. Commissioned campaign footage, approved packaging and matching production macro photography are still pending. The preview retains the existing merchant and content approval states.

## Browser evidence

- [Before and after](evidence/site-scroll/before-after.jpg) places the supplied recording frames on the left and the current Chrome captures on the right. The rows show the South Korea chapter, formulation textures and Journal lead.
- [Desktop hero](evidence/site-scroll/after/desktop-hero.jpg) · [Phone hero](evidence/site-scroll/after/phone-hero.jpg) · [Mobile navigation](evidence/site-scroll/after/phone-menu.jpg)
- [Desktop recording](evidence/site-scroll/after/site-scroll-desktop.mp4) follows real wheel input through the hero handoff, the product stage forward and in reverse, the formulation route and its atlas, Our House, the Ritual, the Journal, Collections and both product galleries. [Recorded frames](evidence/site-scroll/after/desktop-motion-frames.jpg) · [Scene values](evidence/site-scroll/after/motion-evidence.json)
- [Phone recording](evidence/site-scroll/after/site-scroll-phone.mp4) shows emulated touch scrolling, navigation and Back, the two product chapters, quick view and gallery swipe.

## Verification

- TypeScript, ESLint, production build and `git diff --check` passed. Chrome exercised 22 routes at 1440, 1024, 768, 390 and 320 px. The suite reported zero broken links, browser errors and automated accessibility violations. It covered both product galleries, prices, quantities and accordions, search, contact validation, all 17 FAQ entries and recovery states. [110 route and viewport checks](evidence/site-scroll/site/browser-qa.json)
- The six homepage runs also passed, including the runtime reduced-motion check. They reported zero layout shift and automated accessibility violations. [Homepage results](evidence/site-scroll/homepage/browser-qa.json)
- The targeted Chrome check verified Back and Forward positions, top-of-page navigation, fixed-header anchor clearance, native keyboard interruption and nested menu and dialog scrolling. The campaign-to-commerce journey was exercised through the real header, menu, product cards and pairing links. Runtime reduced motion removed Lenis and restored the atlas to its static presentation. No layout shifts were observed on the eight measured route loads. [Interaction and layout results](evidence/site-scroll/site/scroll-interactions.json)
- The collection stage released after 477 px. Both stage links accepted keyboard focus, a viewport resize restored the compact product chapters, and rapid Ritual selections settled on the last requested product. [Scene results](evidence/site-scroll/site/scene-layout-checks.json)

## Measured scrolling

Chrome at 1440 × 900 received six 120 px wheel events per route. The seven sampled supporting routes reached the same destination while distributing the movement over 54–56 sampled frames. They previously moved in five sampled jumps. The homepage already eased the wheel before this change. [Before data](evidence/site-scroll/before/wheel-profile.json) · [After data](evidence/site-scroll/after/wheel-profile.json)

| Route group | Peak movement per frame before → after | p95 frame interval after |
| --- | --- | --- |
| Homepage | 30 → 32 px | 33.3 ms |
| Our House, Ritual, Journal, LUMICLEAR, Target Serum, FAQ | 120 → 30–31 px | 16.8–16.9 ms |
| Formulation | 120 → 36 px | 17.4 ms |

Small-delta input, used as a trackpad approximation, went from 22 to 8–9 px peak movement on supporting routes. The measured p95 interval was 16.8–16.9 ms. The homepage’s initial wheel pass measured 16.9 ms p95 before the changes and 33.3 ms after. Formulation recorded one interval over 50 ms. These are browser frame samples on one Windows host. Physical trackpad and phone input and Safari were outside the test environment.

- Chrome DevTools recorded the 477 px collection stage forward and back. The longest renderer main-thread task was 20.87 ms, with zero tasks over 50 ms and zero child-list changes within the stage. Maximum layout and paint work measured 0.70 ms and 3.71 ms respectively. [Trace summary](evidence/site-scroll/performance-stage/trace-summary.json)
- Three emulated native touch swipes advanced the homepage 1,591 px. The 145 sampled intervals had a p95 of 16.8 ms and no interval over 50 ms. [Touch profile](evidence/site-scroll/performance-home/phone-frame-native-unthrottled.json)
