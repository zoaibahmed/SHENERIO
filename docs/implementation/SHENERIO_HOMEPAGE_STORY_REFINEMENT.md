# Homepage restructuring — 11 November 2026

The homepage now has one primary LUMICLEAR shopping scene. The separate serum/cream shopping chapters and their collection bridge have been removed. Their descriptions remain in the main collection rail; ingredient highlights, application details and product interactions remain on the existing product pages. No supporting page was redesigned.

## Components and flow

| Component | Result |
| --- | --- |
| `LumiclearCollection` | Retained serum-to-cream scene, correct supplied pink packaging, textures, prices and direct PDP navigation. Product names are now semantic headings. Compact, reduced-motion and no-script presentations use the same two product articles in normal flow. |
| Separate `.collection-chapters` / `.collection-bridge` | Removed from the homepage. `#collection-details`, `#target-serum` and `#radiance-cream` remain valid targets in the consolidated scene. |
| Old `Ritual` client component | Removed, including its repeated pack shots and quick-view shopping links. |
| `HomeRitual` | New application photographs, source-supported use guidance, TREAT → NOURISH progression and one **DISCOVER THE RITUAL** link to `/the-ritual`. |
| `MotionDirector` | Added one scoped application timeline; removed the obsolete mobile product-card observer. Explicitly clears the collection caption's inherited pixel translation before its percentage animation. Both selected names, prices and descriptions are checked inside the visible text mask. Cleanup restores both scenes when motion preferences or viewport rules change. |
| Hero, Our House, Formulation, origins, Everyday, Journal, Newsletter, closing/footer | Retained in the required order. The collection now leads directly into Formulation. Global navigation, galleries and scroll engine are retained. |

The desktop Ritual uses CSS sticky positioning with bounded scroll travel, a right-to-left image reveal, a small image scale/translation and masked heading choreography. The application guidance changes as one complete state at the narrative handoff, avoiding mixed serum/cream instructions or overlapping fades. It has no GSAP pin spacer, additional scroll controller or per-scroll React render. Both reading states remain in semantic document order. Tablet, mobile, reduced-motion and no-script modes show two sequential application chapters without sticky behaviour.

## Photography

These are cropped and compressed stock application studies. They do not show the SHENERIO formulation or constitute a product endorsement or results demonstration.

- TREAT: [Ron Lach, Pexels 9442294](https://www.pexels.com/photo/a-woman-applying-serum-on-her-cheek-9442294/). Local asset `public/images/ritual-application-serum.webp`, 1440 × 2160, 125,516 bytes.
- NOURISH: [Polina Tankilevitch, Pexels 7382939](https://www.pexels.com/photo/woman-applying-facial-cream-7382939/). Deliberate close crop excludes the held jar, focusing on facial application. Local asset `public/images/ritual-application-cream.webp`, approximately square, 88,116 bytes.
- [Pexels license](https://www.pexels.com/license/) checked on 11 November 2026. No reference-brand media was introduced. A commissioned SHENERIO application campaign would provide exact formulation and talent continuity.

Both application assets request at low fetch priority on page load instead of waiting until the Ritual enters the viewport. Their layout space is reserved. All product packaging and existing texture photographs remain unchanged.

## Browser evidence and checks

Before captures are in `evidence/home-story/before`. The available 37.7-second Windows recording, `Screen Recording 2026-11-11 142854.mp4`, was reviewed across its timeline; it shows the collection, repeated cards and repeated Ritual packs. The exact basename `20261111-0928-09.9430257.mp4` was not present, so identity with that file has not been established.

The final browser evidence, measurement results and continuous recordings are in `evidence/home-story/after`.

| Check | Actual result |
| --- | --- |
| `npm run lint`, `npm run typecheck`, `npm run build` | Passed. Production preview runs at `http://127.0.0.1:3000`. |
| `node scripts/home-story-qa.mjs` | Eight layouts: 1440×900, 1024×768, 768×1024, 390×844, 320×740, 1440×620, plus desktop/mobile reduced motion. No overflow, missing images, runtime errors or automated axe violations. Initial CLS 0 in all eight. |
| Collection/Ritual traversal | Five forward progress points, reverse reset and sticky release verified. Travel at 1440×900 is 477px for Collection and 414px for Ritual. No pin spacers. Product links remain outside moving text masks. |
| Accessible fallbacks | Runtime resizing and motion-preference changes reset scenes. No-script, short-screen, tablet and phone modes retain both products, both application steps and direct links in normal flow. Real emulated touch gesture scrolls. |
| `npm run test:homepage` | Six responsive scenarios passed: menu, quick view, focus containment/return, gallery, ingredient tabs, newsletter preview, footer and reduced motion. CLS 0; no console errors or automated axe violations. |
| `npm run test:browser` | 110 route/viewport checks passed across 22 routes at five widths. No broken internal links, runtime errors or automated axe violations. Existing PDP/gallery/quantity controls, care forms, search and unavailable states passed. |
| `node scripts/direction-scenes-qa.mjs` | Collection keyboard navigation, browser Back scroll restoration, responsive/reduced fallback, existing ingredient index and full Ritual page controls passed. |

### Frame measurements

Chrome 156.0.8078.80, local production server, fresh browser contexts. Each sample traversed 1100 CSS pixels over 2.4 seconds using `requestAnimationFrame`, starting at the named scene after the initial load settled. These are local rendering samples, not physical-device or field measurements. The narrow profile uses a 390×844 viewport at 2× DPR, 4× CPU throttling and 1.6Mbps/150ms network emulation; it is not a physical phone. Actual wheel traversal is shown separately in the desktop recording, and touch input is tested separately.

| Scene / profile | Median frame interval | p95 interval | Intervals above 50ms | Initial CLS |
| --- | --- | --- | --- | --- |
| Collection / 1440×1000 desktop | 16.7ms | 17.2ms | 0 | 0 |
| Collection / throttled 390px viewport | 16.7ms | 16.8ms | 0 | 0 |
| Ritual / 1440×1000 desktop | 16.7ms | 17.0ms | 1 | 0 |
| Ritual / throttled 390px viewport | 16.7ms | 16.8ms | 1 | 0 |

The existing shared scroll engine was retained. No smoothing library, ticker or competing controller was added. The measured desktop scroll samples spent 7.1ms in layout across the Collection traversal and 1.5ms across the Ritual traversal. Each final Ritual sample recorded one interval above 50ms; the samples support near-60Hz typical pacing, with an occasional hitch, rather than an uninterrupted-60fps claim.

Raw results: [scene QA](evidence/home-story/after/home-story-qa.json), [homepage regression](evidence/home-story/regression-home/browser-qa.json), [route regression](evidence/home-story/regression-site/browser-qa.json), [Collection measurement](evidence/home-story/after/performance-collection/performance.json), [Ritual measurement](evidence/home-story/after/performance-ritual/performance.json).

### Captures

- Continuous [desktop homepage recording](evidence/home-story/after/homepage-desktop.mp4) and [mobile recording](evidence/home-story/after/homepage-phone.mp4). Real browser viewport captures; the MP4 files are direct transcodes of continuous Playwright WebM recordings, with no cuts or speed changes.
- [Desktop full-page layout](evidence/home-story/after/desktop-full-page.jpg) and [mobile full-page layout](evidence/home-story/after/phone-full-page.jpg), captured in reduced-motion mode so every static chapter is visible.
- [Before/after comparison](evidence/home-story/before-after.jpg). Scene screenshots at 0/25/50/75/100% progress are also retained; the recordings provide evidence of actual movement.

Desktop page height at 1440×900 decreased from 12,753px to 11,939px; phone height at 390×844 decreased from 11,896px to 11,784px. The phone's single collection presentation remains complete, while the new application photography receives more space than the former pack-shot rows. Product repetition is removed without cutting the editorial story.

Physical iOS/Android devices and a commissioned SHENERIO application shoot were unavailable. Application photographs remain stock studies. Nothing was pushed or deployed.
