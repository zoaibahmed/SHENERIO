# SHENERIO: video reference breakdown

## Method and limits

All four local MP4s were decoded with OpenCV. Inspected visual frames at 0 s, every 2 s through each clip, and the final decodable frame; inspected additional 0.25-second samples around menu, gallery, scroll, hover and wordmark sequences. Contact sheets and individual base frames are in [evidence](evidence/); [metadata](evidence/video-metadata.json) records resolution, frame count and sample times. Approximate timestamps below locate recorded behaviour, not an inferred website scroll position. Rendered frames were actually viewed. This is sampled visual analysis, not a claim of continuous playback, source-code inspection, interaction testing or exact easing measurement.

All clips show desktop compositions inside presentation mattes. Their grey/lavender/tan/floral outer backgrounds and rounded presentation windows are not evidence that a live site needs the same framing. No mobile layout, keyboard behaviour, working payment, backend response or measured performance is demonstrated. Cuts and replay loops may be editing rather than route transitions. Triggers marked “likely” are inference from cursor/context, not verified event handlers. Typeface families and libraries cannot be identified reliably from recordings.

## Reference identity — important correction

| ID (filename-list order) | Filename | Duration / raster / fps | Actual content | Recommended role |
|---|---|---|---|---|
| V1 | `c3cde6a7c5d9a9ce274c76829961baf8.mp4` | 16.000 s / 1600×1200 / 60 | Nuvé AI skin-analysis concept | Selective motion only |
| V2 | `original-548010ec4b37f28a6cda106b2d0a2c31.mp4` | 42.667 s / 1440×1080 / 60 | Glowskin broad-catalogue homepage | Supporting components |
| V3 | `original-b3ea94313077f4f937ae448155c67f1a.mp4` | 28.067 s / 1440×1080 / 60 | Glowskin exfoliating-gel PDP | Primary PDP usability |
| V4 | `original-b318d1739bb54a75ff286720dcaf087c.mp4` | 27.400 s / 1600×1200 / 60 | NŪMA editorial beauty storefront | Primary visual direction |

The user's desired *roles* are sound; their V3/V4 descriptions do not match this filename order. Adopt V4 editorial + V3 PDP, with selective V2 navigation and V1 motion. This is an evidence-based relabelling, not rejection of the intended strategy.

## V1: Nuvé — portrait, split composition, typographic emphasis

Evidence: [overview](evidence/video-1-sheet-1.jpg), [transition strip](evidence/video-1-transitions.jpg).

### Visual design

White canvas, dense geometric sans-serif headline at lower left, central oversized portrait, small metrics down the right, compact top navigation. Pale lilac supports secondary UI. The hero fades the portrait into white at its lower edge. The following section is an almost equal image/text split, then a large centred paragraph with floating small labels. Restrained CTA geometry in hero contrasts with the decorative scan overlays. Strong image scale and clean hierarchy; its metrics and AI framing make it a technology product rather than a luxury skincare house.

| Timestamp | What is visible / changes | Trigger and likely implementation | Adaptation |
|---|---|---|---|
| 00:00–00:05 | Portrait pose changes under face-positioned outlined scan boxes; headline/navigation remain stable | Time-based media playback is likely; not proof of real face tracking. Use licensed portrait video and authored overlay only if needed | Keep cinematic human presence; omit scan boxes, AI tool and unsupported metrics |
| 00:05.00–00:06.00 | Hero travels upward as cream-application image/lilac panel enter from below | Scroll-like vertical progression; native document flow can explain it | Clean handoff from campaign to editorial section |
| 00:06–00:10 | Large application image on left; right text and long fine arrow lead from “AI Skincare” to “Mindful Beauty” | On-entry text/line reveals plausible; static composition after reveal | Ingredient/ritual pairing; no AI language |
| 00:11.00–00:12.00 | White section enters; centred paragraph fades from very faint to legible grey, labels appear | Viewport entry or edited timeline; opacity/reveal animation | One brand-statement reveal, readable immediately under reduced motion |
| 00:13.00–00:14.00 | Closing words progressively darken while earlier lines stay grey; coloured labels surround text | Sequential word/line emphasis; GSAP timeline or scroll-progress mapping | Optional single short editorial statement; avoid unreadable body-copy staging |
| 00:15.98 | Hero returns | Loop/cut, not established in-site back-to-top animation | Do not reproduce forced reset |

**Strongest techniques:** portrait scale (0–5 s), clean split-screen (6–10 s), controlled contrast emphasis (13–14 s). Exact hero load is not recorded from a blank state. No cards, gallery, bag, checkout, hover or menu opening is shown. Smooth movement does not establish Lenis, parallax or pinning. Mobile needs stacked image/copy and removal of floating overlays. Small navigation and muted paragraph would need readability testing.

## V2: Glowskin homepage — useful interaction patterns, incompatible density

Evidence: [00–22 s](evidence/video-2-sheet-1.jpg), [24–42.65 s](evidence/video-2-sheet-2.jpg), [transitions](evidence/video-2-transitions.jpg).

### Visual design

Sans-serif headings with black-to-pastel secondary phrases; broad full-bleed group portrait hero; compact nav with capsule centre links and dark buttons. Pastel pink/lilac/mint cards, small rounded corners, cutout packshots, portraits and benefit callouts. Grids are denser than V4 and repeatedly alternate product, social-proof and explanation sections. The large dark footer is a useful architectural example; colourful gradients, result badges, extensive pills and medical/transformational framing are poor SHENERIO defaults.

| Timestamp | Observation | Trigger → implementation inference | Recommendation |
|---|---|---|---|
| 00:00–00:02 | Group hero; product discovery top left, search/account icons top right; start/consultation CTAs | Already populated at clip start; page-load choreography unproven | Use concise SHENERIO navigation; omit consultation funnel |
| 00:03.00–00:04.00 (held through 06 s) | White dropdown expands below All Products; underlying hero darkens; contents fade in later | Cursor near nav, likely hover/click → height/clip reveal, scrim opacity, item stagger | Moderate; use a much smaller two-product menu, keyboard/click support |
| 00:08 | Featured products: two product cards and an editorial portrait tile | Scroll into section, heading appears at staged contrast | Two honest product entries; not a nine-product catalogue |
| 00:10–00:14, detailed 11.00–12.00 | Portrait-card row translates left around arrow interaction, exposing later cards | Likely next-button event → translate track or native scroll snap | Save for future editorial content; two launch products need no carousel |
| 00:16–00:18 | Split before/after face divider changes position | Likely pointer drag → clipped overlay width | Exclude: no SHENERIO comparative evidence |
| 00:20–00:24, detailed 21.00–22.00 | Product grid; hovered card swaps packshot to human/lifestyle image and returns | Pointer enter/leave → opacity swap of fixed-ratio images | Appropriate with licensed matching alternate images; Add to Bag stays discoverable |
| 00:26 | Three-step buying explanation with circular imagery and dotted connectors | Viewport entry/sequence likely | Adapt to actual serum/cream ritual, not imaginary stages or delivery promises |
| 00:28–00:30 | Product carton/bottle composition fills in; surrounding benefit callouts become visible | Section reveal; transform/opacity + supplied cutouts, no proof of 3D | Original two-product formulation story, factual ingredients only |
| 00:32 | Two testimonial-like panels | Scroll/reveal | Omit without genuine permissioned reviews |
| 00:34–00:38 | Review-card row advances laterally | Cursor by next arrow → same track pattern | Mechanism reusable later; do not invent content |
| 00:40 | Human portrait and floating statistical/benefit modules | Section entry; layering of image, text and panels | Human photography only; remove unsourced statistics |
| 00:42.65 | Dark multi-column footer, newsletter and social icons | Natural end of page | Organised customer-care access, readable text rather than tiny footnotes |

**Commercial limits:** catalogue discovery is visible; a working basket, checkout, sign-in, search or payment is not demonstrated. Arrows offer clearer carousel affordance than drag-only controls. Mega-menu contents and repeated actions become excessive for two products. On mobile, use disclosure navigation and vertical product cards; do not shrink the entire desktop grid. No verified sticky/pinned sequence or library-specific smooth scrolling.

## V3: Glowskin PDP — strongest product information reference

Evidence: [00–22 s](evidence/video-3-sheet-1.jpg), [24–28.05 s](evidence/video-3-sheet-2.jpg), [gallery/section/FAQ transitions](evidence/video-3-transitions.jpg).

### Visual design

White, rounded image viewport left; right purchase column with compact sans title, small descriptor, star rating, feature chips, pale lavender purchase button, fine-rule accordions. Orange studio packshot and application photos supply warmth. Thumbnail strip, left/right arrows and anchored information hierarchy are commercially useful. Later pale green benefit blocks and peach evidence panels continue V2's modular palette, not V4's editorial luxury. The tan outer matte is presentation framing.

| Timestamp | Observation | Trigger → feasible method | SHENERIO interpretation |
|---|---|---|---|
| 00:00–00:02 | Split gallery/purchase view with five thumbnails; bottom “Expert tip” content visible | Initial expanded state or previous interaction; no click transition captured | Product name, confirmed size, exact GBP price, short copy and Add to Bag remain immediately readable |
| 00:02.50–00:03.50 | Arrow-area cursor; next application portrait slides in from right while packshot exits left | Gallery next event likely → masked horizontal track, fixed image aspect ratio | Straightforward; arrow buttons, thumbnail controls, touch and keyboard equivalents |
| 00:04–00:06, detailed 04.50–05.50 | New benefits section: image grows/reveals upward, heading resolves, side cards fade in after image | Viewport entry or timed demonstration → transform/clip reveal + short stagger | Restrained ingredient/texture section; not a green claim-card wall |
| 00:08–00:12 | Peach “proven transformations” panel builds in; split-face divider shifts | Section entrance, then comparison interaction likely | Exclude unsupported trials and before/after evidence |
| 00:14 | Portrait surrounded by connected green information panels | Entry composition; flat layers can explain it | Ingredient education possible with less clutter; no inferred medical claims |
| 00:16–00:18 | Three illustrated purchase steps resolve | Heading then step reveal | Use a real ritual sequence instead; source buying speed/delivery claims are not SHENERIO facts |
| 00:20–00:22 | Review cards slide laterally to reveal other people | Cursor/arrow context → controlled carousel | Omit until real reviews exist |
| 00:24–00:25.50 | FAQ rows separated by fine rules; fourth answer visible by 25 s near pointer | Button activation likely; height expansion and content reveal | Straightforward semantic accordion; exact supplementary FAQ answers with publication gates |
| 00:26–00:27+ | FAQ/footer scroll upward; recording ends black at 28.05 | Natural scroll followed by video end/fade | Footer navigation, not a black-screen web transition |

**Strongest section:** 0–4 s gallery + purchase-information relationship. Do not inherit stars, “all-natural”, vegan, gifts, free services or claims. Purchase CTA is visible, but it is not activated in the inspected sequence. No bag drawer, checkout, stock validation or customer session is demonstrated. Gallery does not prove zoom, drag or sticky purchase behaviour; those are proposed additions. Mobile should stack gallery then purchase information, retaining visible thumbnails and full-size controls. No claim that original small controls pass accessibility checks.

## V4: NŪMA — strongest editorial luxury reference

Evidence: [00–22 s](evidence/video-4-sheet-1.jpg), [24–27.38 s](evidence/video-4-sheet-2.jpg), [quarter-second transitions](evidence/video-4-transitions.jpg).

### Visual design

Large high-contrast serif display with selective italic styling; small quiet sans metadata; close-cropped skin imagery; near-white/soft neutral grounds. Oversized wordmark overlays a portrait hero. Generous negative space alternates with asymmetrical commerce: a large lead product, a smaller central product, copy and a third card on the right. Hairline outlines and tiny oval controls are secondary; imagery carries emotion. Category list becomes an image-backed horizontal band on hover. Warm floral media closes the sequence. This is the closest tonal match to modern clinical luxury, though some controls are too small and “clean beauty”/ethics messaging is not transferable evidence.

| Timestamp | Observation | Trigger → feasible implementation | SHENERIO use |
|---|---|---|---|
| 00:00–00:01 | Portrait hero, large serif brand mark, top-left editorial line and small shop link | Already composed at start; actual first load not shown | Original SHENERIO campaign/wordmark, prominent accessible collection CTA |
| 00:02–00:06 | Centred serif philosophy statement, delicate italic phrases, large surrounding space; lower line/action resolves | Viewport/timeline entry likely → line masks and opacity | House introduction with source headline; shorten display treatment without deleting supporting copy |
| 00:07.00–00:08.00 | Statement fades as product heading appears; first lead product enters | Section change or edit → opacity/masked content reveal | Modest entry, content visible even if JS fails |
| 00:08–00:10 | Asymmetric product arrangement fills in across columns | Staged item entry → transforms/opacity with unequal image scale | Two complementary SHENERIO products; do not fabricate a third SKU to match layout |
| 00:10.50–00:11.50 | Right product card changes from plain packshot to dark botanical scene with “ADD TO CART” strip | Grey cursor near card → likely hover state, opacity swap + action reveal | Original alternate packshot; persistent tap/keyboard action outside hover |
| 00:14–00:16, detailed 15.25–16.00 | Text-only category list; HAIR CARE row expands into warm image band with small thumbnail, italic light type and view link | Cursor near row → likely hover/focus, clipped band height reveal and inset image | Adapt later to ingredient/ritual editorial links; no haircare/makeup launch categories |
| 00:18–00:20 | “Radiance in every detail” composition: left products gradually appear; large right application image | Section entry, asymmetric fade/mask reveals | Strong formulation/ritual pairing with actual SHENERIO assets |
| 00:22–00:24 | Floral/media statement, icon labels and fine vertical separators; five positions populated by 24 s | Entry stagger plausible; background motion not measured precisely | Optional restrained origin/values panel; no transferred vegan/cruelty-free/clean badges |
| 00:25.50–00:27.38 | Return to portrait; headline appears, then large letters accumulate/fade into wordmark | Hero replay/load-style sequence → letter transforms/opacity | One brief SHENERIO entrance; replay is not evidence of an in-site route transition |

**Strongest sections:** 2–6 s philosophy; 8–12 s staggered asymmetrical products and hover; 14–16 s category-band interaction; 18–20 s image/editorial balance. Exact typefaces, parallax, pinned scenes, smooth-scroll library and timing curves cannot be recovered. This clip does **not** show a PDP, bag, account or checkout. Narrow screens need a new composition, not scaled-down serif text. Keep large display character but use real touch targets and no hover-only purchase affordance.

## Cross-reference matrix

| SHENERIO surface | Primary influence | Supporting influence | Exclude / adapt |
|---|---|---|---|
| Header/navigation | V2 3–4 s discovery | V3 0 s utility hierarchy | No oversized mega-menu for two items |
| Hero | V4 0 s, 25.5–27.38 s | V1 0–5 s portrait scale | No scanning, metrics, copied wordmarks |
| House introduction | V4 2–6 s editorial space | V1 13–14 s selective emphasis | All copy readable without animation |
| LUMICLEAR collection | V4 8–12 s asymmetry | V2 21–22 s alternate image | Two real products, no stock/reviews invented |
| Formulation | V4 18–20 s photo/copy | V3 4.5–5.5 s staged entry | No medical result diagram |
| London/South Korea | V4 22–24 s media atmosphere | V1 split composition 6–10 s | Original origin imagery, no unsupported factory visuals |
| Everyday suitability | V4 18–20 s human detail | V1 application crop | Claims gated by evidence |
| Ritual | V3 16–18 s sequence clarity | V4 editorial layout | Two sold products; external cleanser/SPF guidance |
| Journal | V4 14–16 s editorial rows | V2 controlled row navigation | Prefer simple list at launch |
| Newsletter/footer | V2 42.65 s structured navigation | V4 type and whitespace | Preserve all care/legal links |
| PDP | V3 0–4 s gallery/info | V4 image quality/type restraint | No borrowed ratings or claim badges |
| FAQ | V3 24–26 s | V4 quiet typography | Use approved SHENERIO answers |
| Bag/checkout/account | No demonstrated reference | PDF functional requirements | Design and test independently |

## Evidence-based feasibility conclusion

Most observed effects are opacity, clipping, translation and image substitution, not demonstrated WebGL or live 3D. Comparable frontend refinement is realistic with original assets and iterative testing. Complex pinning or parallax could be added, but claiming the references prove them would be inaccurate. Restraint, asset quality and coherent commerce matter more than the number of effects.
