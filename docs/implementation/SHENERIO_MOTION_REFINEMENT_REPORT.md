# SHENERIO | Motion and design refinement

The ivory foundation, product identity and source copy carry forward. The palette now uses `#FBF8F2` ivory, `#F2EBE2` cream, `#E7DCD0` linen, `#E7D2CC` rose, `#7A806D` sage and `#302B28` ink. Serum art sits on cooler sage tones. The cream uses the rose surfaces. The desktop homepage has one short sticky scene. Product links and details remain directly available in the regular document flow. [Brand and formulation PDF](../../TIL.pdf) · [Product brief](<../../TIL 2.pdf>)

## Before and after

The locally available recording is `Screen Recording 2026-11-10 114916.mp4`. Its embedded creation timestamp is 06:48:16 UTC and its duration is 59.87 seconds. Those details and the visible ivory build match the brief closely. The file named `20261110-0648-11.7132361.mp4` was unavailable by exact filename, so the association is based on timestamp, duration and visible content. The capture begins with the hero already partly scrolled and shows the two translucent product images overlapping early in the recording. The formulation content appears as a repeated grid later in the same capture. [Recording overview](evidence/refinement/before/recording-overview.jpg) · [Consecutive product frames](evidence/refinement/before/recording-product-frames.jpg)

| Scene | Before | Revised behaviour |
|---|---|---|
| Campaign | The timed intro and independent hero parallax had little visual connection to the House statement. | The aperture, image settle and headline line masks share a CSS clock starting with first styled paint. A separate scrubbed sequence draws the image into the House margins while the manifesto enters. The phone uses a shorter portrait aperture with a vertical opening. |
| Treat to Nourish | Two semi-transparent packs briefly overlapped against the same stage and the price sat outside the scene. | One moving edge exposes the cream pack and its texture while the serum exits. A separate clipped rail rolls from one product name, price and description to the other. Both effects and the progress rule are reversible. Desktop uses a bounded CSS sticky stage and one GSAP ScrollTrigger. Phones and reduced-motion users see both products in regular flow. |
| Formulation | One macro photo led to three equal columns of text. | The macro frame expands as its image settles and the ingredient index moves into position, driven by the same scroll progress. The index leads directly to five chapters. Hydration and botanicals have their own imagery. Conditioning, nourishment and niacinamide use distinct reading layouts and preserve their source information. |

| Reference clip | Observed consecutive frames | Application in the revised build |
|---|---|---|
| Nuvé, about 11–14 seconds | The portrait leaves the frame before the statement gathers emphasis. | The campaign pulls into the same margins as the House. The masked statement resolves during that handoff. [Source frames](evidence/reference-motion/reference-1.jpg) |
| Glowskin homepage, about 27–29 seconds | Objects arrive on the same surface in a specific order. | A short stage holds the visual reference point while the objects, textures and product records move through it. [Source frames](evidence/reference-motion/reference-2.jpg) |
| Glowskin PDP, about 3.2–3.8 seconds | A new gallery image enters laterally while the old image remains underneath. | The PDP gallery masks the incoming image over the previous view. The direction follows the selected thumbnail, arrow or horizontal swipe. [Source frames](evidence/reference-motion/reference-3.jpg) |
| NŪMA, about 14.5–16 seconds | A narrow image strip grows into an editorial row before the content settles. | The atlas uses a widening aperture, and the Ritual borrows the visual sequence for its explicit Treat and Nourish controls. [Source frames](evidence/reference-motion/reference-4.jpg) |

## Supporting pages

- Our House opens with a full-width portrait and leads to the London and South Korea provenance ledger through an illustrative studio still life. The four philosophy principles remain readable in regular flow.
- The Ritual uses a two-layer product wipe with keyboard and touch tabs. The AM and PM routines follow in separate, vertically ordered ledgers, with the original cleanser, sunscreen and makeup guidance. The homepage ritual also follows normal scroll.
- Collections uses the updated surface palette and keeps the two product paths visible. The product detail pages keep their distinct texture and application chapters. Their galleries reserve one frame for all views and support thumbnails, arrows, keyboard and horizontal touch gestures. The quantities, prices and preview purchase state stay in the buying panel.
- The Journal gives the available introduction a single, keyboard-accessible feature link, with an image mask on entry and a shorter hover or focus image movement. Customer care and informational pages use shared reading spacing, a stronger panel hierarchy and clear form focus and invalid field styling. Merchant and editorial approval states remain visible.

The hero opening is **timed**. The campaign handoff, product transition and atlas opening are **scroll-driven** on qualifying desktop layouts. The image masks for House, Journal and selected plates are **entry-triggered**. The gallery, Ritual, navigation and disclosure motion is **event-driven**. The ScrollTrigger scenes scope and revert their styles on cleanup. The existing Lenis integration stays restricted to fine-pointer desktop wheel input on the homepage. Reduced motion keeps the material, product details, controls and route navigation available.

## Browser captures

- [Desktop walkthrough, 43 seconds](evidence/refinement/after/refinement-desktop.mp4) · [Phone walkthrough, 16 seconds](evidence/refinement/after/refinement-phone.mp4) · [Opening frames](evidence/refinement/after/desktop-opening-frames.jpg)
- [Campaign handoff](evidence/refinement/after/desktop-campaign-handoff.jpg) · [Serum](evidence/refinement/after/desktop-stage-serum.jpg) · [Transfer](evidence/refinement/after/desktop-stage-transfer.jpg) · [Cream](evidence/refinement/after/desktop-stage-cream.jpg) · [Reverse transfer](evidence/refinement/after/desktop-stage-reverse.jpg)
- [Product stage before and after](evidence/refinement/stage-comparison.jpg) · [Ingredient index before and after](evidence/refinement/atlas-comparison.jpg)
- [House](evidence/refinement/after/desktop-house-material.jpg) · [Ritual on phone](evidence/refinement/after/phone-ritual.jpg) · [Desktop product gallery](evidence/refinement/after/desktop-product-gallery.jpg) · [Phone product gallery](evidence/refinement/after/phone-product-gallery.jpg)

## Production verification

The production build, TypeScript and lint passed. Chrome tested 22 routes at 1440, 1024, 768, 390 and 320 px for 110 route checks, with zero broken internal links, runtime errors or Axe violations in the scanned states. The interaction sweep covered the product prices and quantity UI, gallery and accordion controls, navigation history, ritual keyboard tabs, contact preview, FAQ, search and recovery states. [Route checks](evidence/refinement/site/browser-qa.json)

The recorded fresh loads emitted start and end events for the CSS aperture at its configured 1.08 s desktop duration and 0.82 s phone duration. At 1440 × 900 the product stage stayed 92 px from the viewport top across its 477 px runway. The forward and reverse samples reached the same part of the product transition within two percentage points. The atlas went from an inset to a full frame, and browser Back restored the previous ingredient index position. On the 390 px viewport a vertical swipe scrolled 400 px and a horizontal swipe opened the next gallery image. [Motion measurements](evidence/refinement/after/motion-evidence.json)

The homepage regression passed all six scenarios, including reduced motion and emulated touch input. A separate check verified that the sticky scene released after its runway, the comparison link reached both products by keyboard, the atlas was fully readable in reduced motion, and the products remained visible with JavaScript disabled. [Homepage regression](evidence/refinement/homepage/browser-qa.json) · [Scene layout and fallback checks](evidence/refinement/site/scene-layout-checks.json)

### Frame pacing

These are local Chrome lab runs. The timed samples use 2.4 seconds of scripted scrolling. The compact sample uses 4× CPU throttling, 1.6 Mbps download and 150 ms latency. The stage and atlas samples start near the scene. The walkthrough videos were captured separately at 25 fps.

| Sample | Desktop p95 frame interval | Throttled compact p95 |
|---|---:|---:|
| Homepage, first 2,640 px, three runs | 33.2 / 17.0 / 16.8 ms | 1299.7 / 216.7 / 1499.6 ms |
| Collection chapter, 530 px | 16.9 ms | 33.3 ms |
| Formulation chapter, 760 px | 16.9 ms | 17.0 ms |

The desktop stage trace measured a longest main-thread task of 23.44 ms, a longest layout of 1.01 ms and a longest paint of 3.57 ms during real wheel input forward and backward. It recorded no child-node mutations inside the stage. Homepage layout shift was 0 in the ordinary regression runs and ranged from 0 to 0.033 across the throttled timing runs. [Homepage samples](evidence/refinement/performance-home/performance.json) · [Recheck](evidence/refinement/performance-home-recheck/performance.json) · [Repeat](evidence/refinement/performance-home-repeat/performance.json) · [Collection sample](evidence/refinement/performance-stage/performance.json) · [Atlas sample](evidence/refinement/performance-atlas/performance.json) · [Stage trace summary](evidence/refinement/performance-stage/trace-summary.json)

The compact homepage showed repeatable stalls under the synthetic stress test. The emulated native-touch diagnostic at 4× throttling recorded 66.6 ms p95 and one long animation frame with about 1.31 seconds attributed to React’s document-level pointerdown handler. That attribution is limited to the traced event. The unthrottled touch run recorded 16.9 ms p95 and scrolled 1,395 px. The compact layout runs without GSAP scrub or Lenis. Physical phones and Safari remain unverified. [Throttled phone attribution](evidence/refinement/performance-home/phone-frame-attribution.json) · [Unthrottled native touch sample](evidence/refinement/performance-home/phone-frame-native-unthrottled.json)

## Private image studies

Built-in ImageGen produced the following new studies. Their subjects illustrate editorial concepts. The botanical image does not identify a species or confirm an extract. The studio still life does not depict a SHENERIO facility.

| Working file | Original master |
|---|---|
| `D:/new-client/public/images/atlas-hydration.webp` | `exec-bd83c1a2-b1ac-4b87-b876-615a5500b17f.png` |
| `D:/new-client/public/images/atlas-botanical.webp` | `exec-daac5ee0-c149-41bf-898f-52bdc913dec0.png` |
| `D:/new-client/public/images/house-material.webp` | `exec-781b3b9c-754a-40d5-94b2-a8d945fc0e60.png` |

The masters remain in `C:/Users/NC/.codex/generated_images/01a1bbff-e2ec-72b2-8938-142297df4d59/`.

<details>
<summary>Image generation prompts</summary>

- Create a brand-new horizontal 3:2 high-end editorial macro photograph for a luxury skincare ingredient atlas. Pure clear water beads in varying sizes on vertically fluted translucent glass, with sparse soft pale-sage and chalk-ivory refracted daylight. Bring one razor-sharp cluster of beads and vertical ridges to the central third, with fine out-of-focus detail and authentic optical distortions toward edges. Quiet, slightly cool and tactile, as a photographic metaphor for hydration. Full bleed image. No hands, cosmetics, products, typography, logos, labels, scientific diagrams or unrealistic swirls.
- Create a brand-new horizontal 3:2 quiet botanical macro still life for a luxury skincare ingredient atlas. A few fresh green plant leaves with clearly defined delicate veins, gently lit through translucent ivory paper, details grouped in the lower centre, warm ivory around them, one droplet only. Natural muted sage and olive, with real pores and surface texture, strong editorial directional window light. This is an illustrative study of leaf structure. No packaging, people, lettering, logos, diagrams or text. Photographic realism and understated tonality.
- Create a brand-new horizontal 3:2 photographic editorial still life for the Our House story of an ivory-toned London-founded skincare brand whose products are formulated in South Korea. Focus on the craft of formulation, framed as an abstract studio material study. Three pieces of unbranded clear handblown glass in a shallow ivory ceramic trough on a honed limestone worktop, one lightly rippled glass sheet casting a curved line, and a narrow shaft of soft lateral afternoon light with an ink shadow at the left. Keep the forms in the middle and bottom third for a cinematic wide crop. Modern Korean ceramic restraint and warm limestone texture without representing any real workshop, laboratory, staff or factory. No droppers, labels, logos, copy or people.

</details>
