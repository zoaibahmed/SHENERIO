# SHENERIO: implementation roadmap and verdict

**Subsequent authorisation:** the user approved Phase A and B1 in the next brief, raising the quality benchmark. The original pre-approval audit below is retained as the planning baseline. Current scope and results are documented in [Phase A/B1 creative plan](SHENERIO_PHASE_AB1_CREATIVE_PLAN.md) and [reference versus prototype assessment](SHENERIO_REFERENCE_VS_PROTOTYPE.md). Remaining phases and production publication are not part of B1.

Status: approval proposal only. Seven audit documents and supporting evidence were created; no application was scaffolded, dependencies installed, storefront redesigned, provider connected or site deployed.

## Recommended sequence and approval boundary

Approve the audit's corrected reference mapping and design direction first. Then authorise a private homepage prototype as the first development milestone. Approval of a prototype does not itself supply merchant configuration or authorise publication of unverified claims. Exact schedule/cost cannot be responsibly set until assets, integration scope and review turnaround are known.

### Phase A — design system and project foundation

Inputs: approval of V4=NŪMA visual direction + V3=Glowskin PDP usability, logo/packaging status, font rights, photography plan, commerce decision and source-copy ownership.

Work after approval: establish Git, agreed framework/types/styling, environment separation, proposed tokens, content/product schemas and asset register. Keep source-provided sizes/INCI and claims marked pending internally. Choose a small set of native accessible components and one motion engine. Confirm hosting/provider/account options without enabling live sales.

Exit: reviewed typography/colour/component samples, responsive image strategy, agreed source-content map and approved asset shortlist. The foundation supports two real products and future collections without fake inventory. Proposed tokens remain changeable until this review.

### Phase B — polished homepage prototype and major motion

First build slice: header + campaign hero + House introduction + LUMICLEAR product pairing. This tests the visual character, original assets, primary commerce discovery and handoff between sections before a full-site build. Then complete source-ordered formulation, origin, suitability (approved/private draft), ritual, Journal, newsletter UI, closing and footer.

Use real source prices/names and source copy; temporary media must be clearly identified in private review. Prototype interactions can be local demonstration states but must be labelled as such in review notes; do not imply a mock bag is a live checkout. Do not collect real email/contact data until integrations and consent are ready.

Exit: desktop and phone walkthroughs with actual campaign/packshot candidates, working navigation/disclosures, restrained hero/reveals, reduced-motion state, useful no-animation content, preliminary network/frame profiling. Obtain a concrete visual review before expanding. Defer pinning if the still composition and mobile sequence are not already excellent.

### Phase C — collections and product pages

Build reusable collection/product templates, the two real PDPs, gallery/thumbnail interactions, full product information, approved INCI and counterpart cross-sell. Connect read-only catalogue data when provider access is ready. No unsupported reviews or badges.

Exit: both products have correct £26/£36 GBP source mapping, approved sizes/content where publishing, gallery keyboard/touch behaviour, availability states and readable delivery/returns access. Two items look intentional, not like an incomplete nine-item grid. Changing product data does not require a redesigned template.

### Phase D — bag, checkout and customer features

Prerequisites: actual SKUs/variants, inventory, merchant account/provider settings, shipping/tax/returns decisions, support identity and customer-account scope.

Implement server-validated cart mutations, bag route/drawer, secure provider handoff, guest checkout, provider customer login/history/address scope, secure tracking and confirmation. Keep secrets server-side and provider totals authoritative. Add consent-aware commerce events without duplicate purchase reporting.

Exit evidence: sandbox successful/failed/cancelled payments; refresh and return from checkout; stock changes; quantity races/double-clicks; cart persistence; provider/network errors; correct tax/shipping display; session isolation; logout; valid order ownership and tracking. Record what the hosted checkout can and cannot brand. Do not process live orders as QA.

### Phase E — supporting pages, CMS/content and SEO

Build House, Formulation, full AM/PM Ritual, Journal/index/article, all FAQ, Contact, search, shipping/returns/tracking and legal pages. Integrate real newsletter/support delivery and approved privacy/consent/analytics settings. Preserve exact supplied title/description pairs subject to claim approval. Publish only real articles with reviewed text and licensed images.

Exit: complete route/link inventory, no insertion placeholders or dead social links, real form success/failure verification, repeat unsubscribe/duplicate signup handling, draft exclusion from metadata/schema, valid structured data, sitemap/canonicals/redirects and CMS editorial permissions. Customer care cannot be omitted merely because it is absent from an aesthetic reference.

### Phase F — responsive refinement, performance, accessibility and final QA

Refine actual phone/tablet/desktop compositions, short viewports, zoom and portrait/landscape. Validate keyboard/screen-reader focus, reduced motion, cookie banner/sticky controls, assets and text overflow. Profile midrange mobile and slow network, measure byte budgets and laboratory performance; set up field monitoring for after launch. Review all product claims, policies, shipping costs, stock and backend settings with owners.

Exit: documented launch checklist with content sign-off, sandbox commerce evidence, responsive and accessibility findings resolved, monitoring configured, deployment rollback path and explicit publication decision. No blanket performance or compliance guarantee based on a local demo.

## Dependency and risk priorities

| Priority | Dependency / risk | Next concrete action |
|---|---|---|
| Critical visual | No official logo/packaging/photography supplied | Obtain artwork and commission hero plus both product image sets before judging final visual parity |
| Critical publication | Sizes/INCI/suitability/makeup and provenance unverified | Manufacturer/brand sign-off with version/date; retain private draft until approved |
| Critical commerce | No merchant/stock/shipping/tax configuration | Select provider and supply launch operations brief before Phase D |
| High | V3/V4 numbering ambiguity | Use filename/brand labels in every review; adopt corrected mapping |
| High | Editorial/legal/support copy incomplete | Assign owners; don't fabricate customer care or ten full articles |
| Medium | Motion scope drifts toward elaborate pinning | Approve one hero and one supporting reveal first; add advanced effects only with measured value |
| Medium | Mobile copies desktop staging | Review phone composition in Phase B, not at the end |
| Medium | Too many services/libraries | Start native scrolling, CSS + GSAP only as needed, provider-native content if adequate |

## Final verdict: ten answers

1. **What is SHENERIO trying to achieve?** An internationally credible, London-founded luxury skincare house with South Korean formulations, launching two complementary LUMICLEAR products. It must convert attention into confident purchases while making ingredients, ritual and customer care understandable. Modern clinical luxury is a presentation position, not permission to imply clinical proof.
2. **Which reference fits best?** NŪMA, filename `original-b318d1739bb54a75ff286720dcaf087c.mp4` (V4 in the supplied list): serif editorial statements, generous space, close skin photography, asymmetric commerce and controlled hover bands. The Glowskin PDP, filename `original-b3ea94313077f4f937ae448155c67f1a.mp4` (V3), is the strongest gallery/purchase-information reference. This corrects the numbering while retaining the user's intended combination.
3. **What should the site feel like?** Quiet, assured, human and exact: porcelain/mineral surfaces, dark readable typography, one expressive campaign, original packshots and restrained serif display against practical sans commerce. Two products receive deliberate space rather than a bloated catalogue layout.
4. **What major motion is feasible?** Wordmark entrances, short line masks, image reveals, two-product stagger, image-alternate hover, expanding menu, gallery slides, manual carousels, FAQ accordions and bag-drawer transitions. Trigger/property/fallback details are specified in M01–M22. Native scrolling is adequate initially.
5. **What is difficult or impractical?** Long responsive pinned narratives are advanced; real liquid/3D/product-film scenes require assets/research; reference backends cannot be inferred. Scan/diagnostic interfaces and unsupported before/after/results do not belong in launch scope. Exact original easing and pixel geometry are unknowable from curated recordings.
6. **Which technologies?** Proposed Next.js/React/TypeScript for the storefront, CSS tokens/Modules (Tailwind optional), CSS feedback plus GSAP/ScrollTrigger where sequencing merits it, and a secure provider such as Shopify for inventory/cart/hosted checkout/accounts. Native scrolling first; avoid adding competing motion libraries. No existing stack constrains the choice. See the technical assessment's official documentation links and headless/theme trade-off.
7. **What is missing?** Approved logo/fonts, final packaging, campaign/product/application/texture images and rights; verified product specifications/INCI/claims/provenance; SKUs/stock/merchant/markets/shipping/tax/returns; support email/business/social details; reviewed policies/articles and provider credentials. Draft sizes and INCI exist and must not be misreported as absent or final.
8. **Can this be built to comparable quality?** Yes for the demonstrated frontend techniques, conditional on professional original assets and iterative visual review. No promise of pixel-perfect duplication or equal conversion/performance based on videos. The complete, tested commerce experience exceeds what the clips demonstrate.
9. **What compromises are necessary?** Simplify movement and remove pinning/parallax on reduced-motion/phone layouts; preserve visible shopping controls instead of hover-only actions; accept hosted-checkout customization limits; omit evidence-free reviews/claims; defer elaborate video/3D until assets and mobile performance justify them. These choices protect usability and credibility.
10. **What first?** After approval, create the private header/hero/House/two-product homepage slice in wide and phone layouts with representative original assets. Review it, then finish the homepage before undertaking all commerce/supporting pages. It is the earliest meaningful proof of art direction and motion quality.

## Review package

- [Project/PDF audit](SHENERIO_PROJECT_AND_PDF_AUDIT.md): facts, source page map, products, conflict resolution, launch gates.
- [Video breakdown](SHENERIO_VIDEO_REFERENCE_BREAKDOWN.md): actual filenames, timestamps, observations, limitations and comparison matrix.
- [Design system](SHENERIO_VISUAL_DIRECTION_AND_DESIGN_SYSTEM.md): proposed colours, type, space, assets and components.
- [Motion specification](SHENERIO_MOTION_AND_INTERACTION_SPEC.md): per-effect implementation, difficulty and fallbacks.
- [Page architecture](SHENERIO_PAGES_AND_SECTION_ARCHITECTURE.md): complete sitemap and section-level content/design/behaviour.
- [Technical assessment](SHENERIO_TECHNICAL_FEASIBILITY.md): architecture, commerce/security, performance and verification plan.

**Development is awaiting the user's approval.** This is the boundary expressly requested in the pasted brief, not an additional inferred approval rule.
