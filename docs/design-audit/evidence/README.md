# Audit evidence

Generated 8 November 2026 from the six original files in `D:\new-client`. No reference imagery is authorised for use as SHENERIO website artwork.

- `TIL.txt`: all 18 primary PDF pages, with page delimiters.
- `TIL 2.txt`: all 10 supplementary PDF pages, with page delimiters.
- `til-pages-*.jpg` / `til2-pages-*.jpg`: rendered contact sheets covering every PDF page. Full rendered pages are also in `../../../tmp/pdfs/` relative to this directory.
- `video-metadata.json`: source identities, durations, dimensions, fps, frame counts and base frame sample positions.
- `vN-SSS.ss.jpg`: full-raster representative video frames (0 seconds, 2-second interval, final frame).
- `video-N-sheet-*.jpg`: chronological overviews of those frames.
- `video-N-transitions.jpg`: additional quarter-second sampling, visually inspected for changes between neighbouring frames.
- `extract_evidence.py`: base extraction utility, writes documentation evidence only. Requires existing Python pypdf, Pillow, OpenCV. PDF pages were rendered separately using Poppler: `pdftoppm -scale-to 1000 -jpeg "TIL.pdf" "tmp/pdfs/til"` and equivalent for `TIL 2.pdf`/`til2`.

Additional transition sampling (seconds, inclusive endpoints, 0.25-second increments):

| Video | Windows |
|---|---|
| 1 | 5–6; 11–12; 13–14 |
| 2 | 3–4; 11–12; 21–22 |
| 3 | 2.5–3.5; 4.5–5.5; 25–26 |
| 4 | 7–8; 10.5–11.5; 15–16; 25.5–26.5 |

These strips were extracted in a separate OpenCV pass. Quarter-second sampling supports approximate observations, not frame-exact easing measurements. No live reference site was opened or tested; no mobile, backend or checkout conclusions are claimed from these recordings.

## Document verification

Seven requested SHENERIO Markdown documents exist. All relative Markdown file links were checked and resolved. Extracted PDF page delimiter counts are 18 and 10. Source-root file sizes still match the initial inventory. No application tests were applicable because no application was implemented.

Initial sRGB contrast calculations for proposed solid colours: Ink/Porcelain 14.60:1; Slate/Porcelain 6.13:1; Slate/Mineral 5.01:1; White/Ink 15.26:1; Evergreen/Porcelain 7.87:1; Error/Porcelain 7.02:1. These checks do not establish accessibility compliance or photo-overlay contrast. Measure final rendered states during development.
