# SHENERIO: motion and interaction specification

Status: proposed implementation contract, no motion code written. Reference IDs follow the filename mapping in the [video breakdown](SHENERIO_VIDEO_REFERENCE_BREAKDOWN.md). Timings below are recommended tuning values, not measured original timings. Recording samples cannot recover original easing curves or distinguish every scroll event from an authored demo timeline.

## Shared motion tokens

| Token | Starting value | Use |
|---|---|---|
| feedback | 140–180 ms | Button colour, pressed feedback, icon state |
| component | 220–320 ms | Accordion, image alternate, menu content |
| panel | 320–420 ms | Navigation and bag drawer |
| editorial | 650–900 ms | Single heading/image reveal |
| stagger | 60–90 ms, total sequence under ~1.2 s | Two products or a short heading sequence |
| ease-out | cubic-bezier(0.22, 1, 0.36, 1) | Editorial entrances |
| ease-ui | cubic-bezier(0.2, 0, 0, 1) | Direct interactions |
| travel | 12–24 px; hero/image scale 1.03 to 1 | Restrained depth, not large fly-ins |

Durations can be interrupted or reversed. Never finish a queued animation before accepting another gallery/menu action. No mandatory preloader and no delay before price, menu or primary CTA can be used.

## Effect catalogue and feasibility

| ID / reference | Trigger and observable basis | Proposed moving properties/method | Classification | Fallback / decision |
|---|---|---|---|---|
| M01 Hero brand entrance, V4 25.5–27.38 | Hero replay shows letters assembling; initial navigation event unknown | After first paint, fade/translate a few wordmark groups over static image using CSS/GSAP; source headline line mask | Moderate complexity | Full brand/headline immediately present in HTML; static reduced-motion state. Logo must remain original |
| M02 Human media, V1 0–5 | Portrait changes pose while UI remains | Supplied muted inline video with poster; optional very slow image scale if still image | Requires special assets or further research | Still campaign image; user pause control for persistent motion; no scan interface |
| M03 Editorial line reveal, V4 2–6 | Philosophy lines/action resolve | First viewport entry → transform line wrappers and opacity, optional clip-path inset | Moderate complexity | Text visible by default; no duplicate accessible text; recompute wraps after fonts/resize |
| M04 Word contrast emphasis, V1 13–14 | Final words turn dark sequentially | Short approved statement only; progress-mapped colour/opacity timeline, once or scrubbed | Moderate complexity | Keep every word at legible contrast; remove progress dependency on mobile/reduced motion |
| M05 Product stagger, V4 7.5–10 | Lead product then neighbouring items appear | First entry → two fixed-ratio stages opacity + y 16→0 | Straightforward | No opacity:0 without successful enhancement; no inventory item delayed behind animation |
| M06 Product alternate/action, V4 10.5–11.5; V2 21–22 | Pointer near card; image changes | Pointer enter/focus-within → crossfade two reserved-size images, show secondary cue | Straightforward | Persistent product link/price/Add to Bag on touch; no card layout shift |
| M07 Product menu, V2 3–4 | Cursor at navigation; panel expands before content | Click or keyboard disclosure → panel clip/short grid-row transition + scrim opacity + item stagger | Moderate complexity | Nonmodal desktop disclosure stays in natural tab order; mobile modal drawer follows focus rules |
| M08 Gallery slide, V3 3–3.5 | Next image slides right-to-left with arrow-area cursor | Button/thumb/swipe → transform track inside overflow clip; image state independent of animation | Straightforward | Instant image switch under reduced motion; button alternatives; announce image position politely |
| M09 Image/section mask, V3 4.5–5.5 | Portrait grows into frame then side panels reveal | On-entry media wrapper clip or inner-image scale, following copy opacity; use GSAP only if sequencing warrants it | Moderate complexity | Simple fade or static; preserve ratio and alt text |
| M10 Category band, V4 15.25–16 | Text row opens an image band and italic active label | Pointer/focus selects row; animate clipped band/inset image; underlying link remains anchor | Moderate complexity | Expanded static editorial tile on touch; not launch shopping categories; do not use for unavailable haircare |
| M11 Carousel, V2 11–12 and 34–38; V3 20–22 | Arrow context with translating card track | Next/previous → native scroll snap + scrollTo; normal list markup | Straightforward | No autoplay; keyboard/buttons; no carousel needed for launch products/reviews |
| M12 Accordion, V3 24–25.5 | Answer appears below fourth row | Button toggles expanded state; native details or measured-height animation with ResizeObserver | Straightforward | Immediate open; no transition required. Body content never waits for fade |
| M13 Floating ingredient callouts, V2 28–30 / V3 14 | Product/photo plus surrounding panels revealed | Entry → image then absolute callouts on wide layout, ordinary list on phone | Moderate complexity | Prefer readable ingredient list; no pseudo-clinical effect arrows |
| M14 Media values panel, V4 22–24 | Floral media, labels, separators fill scene | Optional licensed loop plus simple item entry; static layout otherwise | Requires special assets or further research | Still texture and approved text, omit borrowed ethical badges |
| M15 Before/after slider, V2 16–18 / V3 8–12 | Divider shifts over face | Technically range input mapped to clip width | Not advisable for this brand | No evidence to support outcome comparison; do not build for launch |
| M16 Face scan, V1 0–5 | Boxes sit over moving face; actual AI unproven | An authored overlay is possible; genuine analysis would need a separate validated system | Not advisable for this brand | Omit AI, accuracy figures and scanning functionality |
| M17 Bag drawer, not demonstrated | Approved Add to Bag response or Bag button | TranslateX panel + scrim opacity; API mutation state drives contents, never animation completion | Moderate complexity | Full bag route; static open/close under reduced motion |
| M18 Sticky purchase panel, not demonstrated | Scroll beyond PDP gallery threshold on wide screens | CSS sticky constrained by parent; sticky phone CTA only after main action exits | Moderate complexity | Ordinary flow at zoom/short viewports; no overlay on consent/errors |
| M19 Short pinned story, not established in clips | Optional future approved formulation scene | ScrollTrigger pin + scrub transforms in bounded container; one timeline owns properties | Advanced | Replace with stacked stills on mobile/reduced motion; defer until prototype proves value |
| M20 True parallax, not established in clips | Optional scroll-linked media depth | Bounded image translate in clipped container; scroll-linked GSAP timeline, no layout changes per frame | Moderate complexity | Static on touch/reduced motion; not necessary to match core direction |
| M21 Smooth scrolling, not established | Optional native scroll aesthetic enhancement | Prefer native; Lenis only after measured benefit and integration spike | Moderate complexity | Native scrolling always viable; no scroll hijack or artificial wheel-only navigation |
| M22 Live 3D liquid/rotation, not demonstrated | No supporting source evidence | Would need model/shader assets, lighting and browser performance research | Requires special assets or further research | High-quality stills or authored video; not launch scope |

## Timeline examples

**Homepage campaign:** render image/poster, real headline and controls immediately → when enhancement ready, image 1.03→1 over 800 ms and approved wordmark groups resolve with 70 ms stagger → primary CTA remains available throughout. Do not keep the hero invisible while fonts/video download. Under reduced motion: final frame, no transforms or media autoplay.

**Collection entry:** when section is ~20% visible, animate first image/caption over 650 ms, second begins 80 ms later. Run once per visit; navigation back must preserve state and scroll. Pointer alternate image is a separate opacity layer; no two animation systems own the same transform.

**Gallery:** activate next → update selected index and accessible position → slide 280 ms → allow interruption to the latest index. Keep current product purchase information fixed. Do not claim a thumbnail selection is Add to Bag.

**Bag:** activate Add to Bag → show pending feedback immediately → API succeeds: announce exact product added and show updated lines, then optionally open drawer → API fails: preserve quantity, show actionable error, do not increment bag badge. Product totals come from commerce provider, not animation state.

## Accessibility and runtime contract

- Honour `prefers-reduced-motion` initially and when it changes. Stop loops, remove parallax/pinning/scrubbing, show final content; “reduce” is not merely a faster animation. [MDN guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).
- Modal bag/mobile menu: move focus inside, contain Tab/Shift+Tab, Escape closes, background inert, restore focus to launcher. Closing must also work with visible button. [WAI dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
- Disclosures/accordions expose expanded state. No hidden focusable controls, hover-only purchase actions or forced pointer follower. Carousels are manual and provide labelled controls.
- Keep body copy readable through all phases. Split text decoratively only if one coherent accessible version remains. Animations cannot change semantic reading order.
- Use transforms/opacity where feasible; clip-path and expanding heights need real-device profiling. Avoid full-screen backdrop blurs, perpetual will-change and unbounded compositor layers.
- On route exit, cancel timers/timelines and revert pin styles; use scoped GSAP contexts and responsive match-media cleanup. [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/).
- Wait for known font/image geometry before calculating pins; refresh after relevant layout changes rather than on every scroll event. Native anchor links, browser find, restored scroll and keyboard Page Down must work.

## Acceptance evidence required in development

Record normal and reduced-motion desktop/phone runs; check fast repeated menu/gallery actions; test keyboard and screen reader focus; inspect long titles and failed cart calls. Profile the hero and scroll scene on a midrange phone. Disable one effect if it costs responsiveness or makes content less understandable. None of these tests has been run against an application because no website exists yet.
