# Pellar site versions

`hipellar.velesproductions.com` (GitHub Pages).

## How this repo is versioned

- `index.html` is only ever promoted to, never edited in place.
- The build in progress lives at the repo root as `index_vNN.html`, so `assets/` resolves the same way it will once promoted.
- `versions/` holds frozen baselines. Read-only.
- Promotion is a single copy, `index_vNN.html` -> `index.html`, after the build has been reviewed in a browser.
- Every version gets a row below.

## Versions

| # | File | What changed | Status |
|---|---|---|---|
| 00 | `versions/00_live_v3_d5fa1a3.html` | Frozen snapshot of v3, the build live from 11 Aug 2026, including the September legal footer. | baseline |
| 04 | `index_v04.html` | Replaced the section 01 scroll-scrub clip with real studio footage on a slow camera move, encoded all-intra so the scrub seeks per frame, and added a control-room band. | superseded by 05 |
| 05 | `index_v05.html` | Nine shots from the Veles making-of film across the page: hero, section 01, voice workflow, templates, a hardware band, a camera accent, the studio band, the proof section and a closing band. All loop with a short fade at each end except the studio band, which stays scroll-scrubbed. No copy changes against v3. | promoted to `index.html`, 8 Sept 2026 |
