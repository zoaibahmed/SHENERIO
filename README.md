# SHENERIO — Phase A / B1

Private, responsive luxury skincare homepage prototype. Scope: navigation, campaign, House introduction, two-product collection and product preview interaction study. Next.js / React / TypeScript, CSS tokens, GSAP + ScrollTrigger. Native scrolling. Locally bundled Bodoni Moda and Manrope fonts (SIL Open Font License; package licences retained in node_modules/@fontsource).

## Run

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:3000. For the production preview, `npm run build` then `npm start`. Type-check with `npm run typecheck`. Browser checks use the installed Google Chrome browser: `npx playwright install ffmpeg`, then with the app running `npm run test:browser`. The ffmpeg package records the actual interaction walkthroughs. The lab sample is `node scripts/performance-lab.mjs`; do not run it alongside other browser workloads when comparing timings.

This is not a live shop. No checkout, account, inventory, payment, tracking, email signup or analytics service is connected. Product names/prices and short descriptions come from TIL.pdf; no additional products or reviews are invented. Product sizes, full INCI and claims remain subject to approval and are not presented as final in the prototype. AI-generated campaign and packaging concepts are explicitly identified in the preview. Replace with brand-approved assets before publication. All routes carry noindex metadata and X-Robots-Tag; this is not access control, so keep previews private.

## Project map

- `app/page.tsx`: server-rendered homepage sections and source content.
- `components/experience.tsx`: narrow interactive navigation, preview dialog and motion controller.
- `app/globals.css`: semantic tokens, layouts, responsive and reduced-motion variants.
- `lib/products.ts`: typed source product register; not a commerce database.
- `public/images`: optimized original concept assets. No reference-video imagery is deployed.
- `docs/design-audit`: source audit, implementation direction, asset register and comparison/QA evidence.

See `docs/design-audit/SHENERIO_PHASE_AB1_CREATIVE_PLAN.md` for current authorisation; historical audit documents describe the earlier pre-approval state. Full commerce, supporting pages and remaining homepage sections belong to later phases.
