# Pellar site versions (hipellar.velesproductions.com)

Rules (from `00_AI_LAB/08_DOCUMENTATION/SOP/SOP_SITE_VERSIONING.md`):
- `index.html` is only ever promoted to, never edited in place.
- The active build is `index_vNN.html` at the repo root so `assets/` resolves.
- `versions/` holds frozen baselines, read-only.
- Every version gets a row here. Promotion = Sam's live in-browser sign-off, then a single copy `index_vNN.html` -> `index.html`.
- This repo is public (GitHub Pages). Nothing is pushed until the footage rights and the build are approved.

| # | File | Origin | Status | Evidence |
|---|---|---|---|---|
| 00 | `versions/00_live_v3_d5fa1a3.html` | Snapshot of the live `index.html` at commit `d5fa1a3` (v3 promoted 11 Aug 2026, legal footer 7 Sept) | frozen baseline | live site 7 Sept 2026 |
| 04 | `index_v04.html` | Copied from 00 on the branch `feat/site-studio-footage-v4`. Swaps the studio scroll-scrub clip for real studio footage with slow camera moves (all-intra encode so the scrub seeks per frame) and adds a control-room scrub band before section 05. | draft, LOCAL ONLY. Pushed by mistake 7 Sept 18:30 before Sam's review; PR #1 closed and remote branch deleted 21:35 (GitHub keeps refs/pull/1/head). Awaiting Sam's browser sign-off | `01_VERTICALS_KB/07_PELLAR/02_WEBSITE/V04_FOOTAGE_2026-09-07.md` in 00_AI_LAB; screenshots in `V04_SHOTS_2026-09-07/`; alternates in `V04_ALTERNATES_2026-09-07/` |
