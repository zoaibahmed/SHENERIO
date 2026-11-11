# SHENERIO

Private storefront frontend for the London-founded skincare house. It includes the campaign homepage, LUMICLEAR collections and product pages, brand education, Journal, search, customer care and policy approval states. The shared design uses Bodoni Moda and Manrope, porcelain and forest colours, responsive CSS and motion that honours reduced-motion preferences.

```powershell
npm ci
npm run dev
```

Open [the local storefront](http://127.0.0.1:3000). For a production-mode preview, run `npm run build` and `npm start`. Use `npm run typecheck` and `npm run lint` for source checks. With Google Chrome installed and the production preview running, `npm run test:browser` checks the complete route set and `npm run test:homepage` covers homepage-specific motion and interaction. `PREVIEW_URL` overrides the browser scripts’ default address. Set `QA_OUTPUT` to keep homepage regression evidence separate from the original rebuild capture.

Product data and verification fields live in `lib/products.ts`. The Journal distinguishes editorial previews from published material in `lib/journal.ts`. Collections use self-canonicals for the index and the LUMICLEAR feature. `SHENERIO_SITE_URL` sets the canonical origin and defaults to the local preview address. All pages carry a `noindex` directive.

Shopping, payment, account, tracking, contact delivery, subscriptions and analytics require merchant integrations. Concept imagery and provisional product information are labelled. Keep this preview on localhost until the dependencies in the [complete website report](docs/implementation/SHENERIO_COMPLETE_WEBSITE_REPORT.md) are resolved.
