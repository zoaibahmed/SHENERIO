# SHENERIO Phase A / B1 verification

Date: 9 November 2026, Asia/Karachi (machine-readable logs use UTC). Tested local production build, not a deployed store. Source assets and original audit documents preserved. No live transactions or customer data collected.

## Build and functional verification

- `npm run build`: passed; statically rendered homepage and not-found route, TypeScript compilation successful.
- `npm run typecheck`: passed.
- `npm run test:browser`: passed all six scenarios, with zero uncaught page errors, no detected horizontal overflow and all rendered images loaded.
- axe WCAG A/AA tagged checks: zero detected violations on page and open product dialog in those scenarios. Automated checks do not establish full WCAG compliance.

| Scenario | Viewport | Motion preference | Result |
|---|---|---|---|
| Desktop | 1440×1000 | Normal | Passed; runtime switch to reduced motion also tested |
| Compact desktop | 1024×768 | Normal | Passed |
| Tablet | 820×1180 | Normal | Passed; dedicated portrait composition |
| Phone | 390×844 | Normal | Passed |
| Phone | 390×844 | Reduced | Passed |
| Small phone | 320×740 | Reduced | Passed |

Each run exercises collection disclosure, Escape and launcher focus, anchor navigation, serum preview, full/detail image controls, ingredient disclosure, 15 consecutive Tab presses contained in dialog, Escape and focus restoration, cream preview, explicit close and House philosophy disclosure. Also verifies one h1, exact product headings and noindex response header. The implementation was refined after the initial modal focus test failed; final runs pass. Screenshot captures were inspected at desktop, compact, tablet, phone and small-phone sizes.

Evidence: [full machine-readable results](prototype-evidence/browser-qa.json), [repeatable test](../../scripts/browser-qa.mjs), [desktop walkthrough](prototype-evidence/desktop-interaction.webm), [phone walkthrough](prototype-evidence/mobile-interaction.webm). Videos record actual automated interaction with the running browser; they are not simulated site screenshots.

## Visual review and revisions

Actual first-pass screenshots (`prototype-evidence/first-*.png`) are retained. Review led to larger menu thumbnails, a companion portrait for phone/tablet/House, corrected image overscan, explicit modal focus wrapping, and earlier critical font/image loading. Final screenshots use the latest production build. Normal and reduced-motion page views have the same content and usable actions.

Key captures: [desktop hero](prototype-evidence/desktop-hero.png), [campaign handoff](prototype-evidence/desktop-campaign-handoff.png), [House](prototype-evidence/desktop-house.png), [collection/full page](prototype-evidence/desktop-full.png), [menu](prototype-evidence/desktop-menu.png), [product preview](prototype-evidence/desktop-preview.png), [phone](prototype-evidence/mobile-full.png), [tablet](prototype-evidence/tablet-hero.png), [reduced motion](prototype-evidence/mobile-reduced-full.png).

## Performance — target not consistently achieved

The script uses Chrome 156, local production server, fresh browser context, 390×844 at 2× device scale, 4× simulated CPU slowdown, 1.6 Mbps download / 0.75 Mbps upload and 150 ms latency. Server image derivatives may already be cached. These are local synthetic samples, not real-user Core Web Vitals, physical midrange-phone measurements or a controlled comparison with the reference sites.

| Sample | LCP | CLS | Resource transfer bytes | Meaning |
|---|---:|---:|---:|---|
| Before critical-loading refinement | 4,060 ms | 0.00341 | 290,253 | Initial result motivated changes |
| After refinement, alongside browser QA | 2,548 ms | 0 | 290,488 | Encouraging sample, slightly above 2.5 s target; concurrent work adds noise |
| After refinement, separate rerun | 4,792 ms | 0.00015 | 244,919 | Worse sample; target is not reliably met |

Do not cherry-pick the 2.55-second result or call this performance-complete. The runtime/asset-loading path was improved by responsive image preload, preloaded local fonts and moving the critical entrance from hydration-dependent GSAP to CSS. The measured LCP remains variable. Further trace-based investigation and real-device validation are required before production. No INP field result is available.

Final scroll frame sample: median ~16.7 ms, p95 ~116.6 ms, six intervals over 50 ms in a ~2.4-second synthetic scroll. An earlier sample was smoother; this variability means a blanket “60 fps on mobile” claim would be unsupported. Below-fold decoding, image processing, layout and animation initialization need profiling on actual hardware. The phone deliberately omits scroll parallax/pinning; additional dramatic effects are not justified until this is resolved.

Raw evidence: [before](prototype-evidence/performance-before-loading-refinement.json), [concurrent sample](prototype-evidence/performance-concurrent-validation.json), [separate final sample](prototype-evidence/performance-lab.json). Reproduce with [lab script](../../scripts/performance-lab.mjs), with other browser QA workloads stopped. Resource totals are entries captured at the sample point, not the final full-page download or document transfer size.

## Remaining checks and boundaries

- Physical iOS/Android devices, Safari/Firefox, full screen-reader testing, text zoom/reflow with enlarged fonts and touch gestures remain unverified. Viewport emulation is not equivalent to those checks.
- No working checkout, inventory, basket, account, search or subscription integration is claimed. B1 previews two source products only.
- Generated skin imagery is a campaign concept, not a customer result. Packaging, logo study, official sizes/INCI, provenance and claim sign-off remain open. These are recorded in the [asset register](SHENERIO_PROTOTYPE_ASSET_REGISTER.md) and source audit.
- Page uses robots metadata and an X-Robots-Tag header, but noindex is not access control. Keep the preview local/private until a deployment decision.
- Final homepage sections, real multi-angle galleries, care/legal content and commerce belong to subsequent phases.

## Current acceptance judgment

The authorised opening slice is implemented, visually refined and functionally reviewable. Its visual direction and narrow interactions are ready for user review. The ambition to exceed all four references remains a benchmark, not an achieved fact: full editorial/commerce coverage, final assets and reliable mobile performance are still below the desired final standard. See the [reference comparison](SHENERIO_REFERENCE_VS_PROTOTYPE.md) for explicit adapted/improved/outstanding judgments.
