# Review brief — Pellar sales page v4

## What you are reviewing

Three files in this worktree (branch `v4-sales-page`):
- `sales-page-v4.html`
- `sales-page-v4.css`
- `sales-page-v4.js`

They also load `app.js` (waitlist form → live n8n webhook, do not change) and assets
under `assets/`. Serve locally with `python -m http.server` if you want to run it.

## What the site has to do

Sell Pellar — a live broadcast graphics system — to two audiences that fork right
after the hero:

- **Broadcasters.** Newsroom producers, graphic operators, control-room staff. They buy
  to prevent dead air and eliminate human error, not to make art. Their incumbent is
  Vimix/Vizrt. They care about: a template library their designers own, a verify step
  before anything reaches air, permissions matching the operator → editor → vision-mixer
  chain, and running on their own hardware with no external API dependency during a
  live broadcast.
- **Streamers and creators.** One operator, one machine, no time to open After Effects.
  OBS/Streamlabs/XSplit.

The core argument: a pre-rendered graphic is hardcoded, so changing one digit means
After Effects, a re-export and a re-import — 3 to 5 minutes while you are on air.

## Hard constraints (violations are bugs, not opinions)

1. **Playout control does not exist yet.** Nothing may show or imply play/stop/sequence
   control of graphics, or playlists. The transport strip in the mocked panel is a
   preview scrubber only.
2. **Local model support is in testing, not shipped.** It may be framed as an
   architectural commitment, never as a delivered feature.
3. **No compliance claims.** The verify step may be described; AI Act compliance may not
   be claimed.
4. **One accent colour only:** Veles red `#E63946`. Navy → teal is the *light* register
   (grounds, blooms, lit rims, LEDs). Charcoal/grey is the *material* register (panels,
   controls, relief). White is type and brightest light. Material never glows; light
   never becomes a surface.
5. **Tactility is implied, never depicted.** Depth from soft relief, edge highlight,
   contact shadow, LED state. No literal materials, no photographic textures.
6. **Rejected patterns:** multi-hue neon glow, glowing orbs/particle fields, broken grid,
   art-directed ragged type, images collaged into headlines, decorative shape-masking,
   hand-drawn or clip-art icons, numbered-tile infographic grids with illustrated icons.
7. Dark is default; **light mode is mandatory** and must be a real mode, not an inversion.
8. The operator panel in the page is a **rebuild in Pellar's own palette**. The only real
   product capture that exists is a client build and cannot go public. Do not suggest
   using screenshots.

## Known open issues (already found — do not just restate these)

- Zero `:focus-visible` rules. Keyboard navigation has no visible focus.
- `.label` is 10px mono at `--text-3`; likely fails WCAG AA contrast at that size.
- Scroll motion is hand-rolled `requestAnimationFrame`; house rule says GSAP
  (gsap-core / gsap-scrolltrigger).
- Seven identical `.cell` bento cards across two sections that mean different things.
- No pricing, no FAQ, no named proof, no "what happens next" after the waitlist.
- `privacy.html` is linked but does not exist on this branch.

## What I want from you

A **design and functional code review**, in two parts.

**Part 1 — functional/code.** Real defects. Prioritise:
- Anything that breaks at a viewport size, in light mode, or with reduced motion.
- CSS specificity traps (two have already bitten: `.safe > img` was stretching overlaid
  graphics and the corner logo — look for more of that class).
- The scroll-scrub implementation: correctness, jank, behaviour when the video fails to
  load or `currentTime` is rejected, teardown, passive listeners.
- Accessibility beyond the known focus gap: landmarks, heading order, alt text, contrast,
  reduced-motion coverage, form labelling.
- Performance: video decode cost, animated WebP weight, layout thrash, anything that
  would make a laptop fan spin on a page about live production.
- Dead code and rules that no longer match the markup.

**Part 2 — design.** Judge it against the goals above, not against generic landing-page
convention:
- Does the page make the broadcaster's case, in the broadcaster's language, in the right
  order? Is anything load-bearing missing or buried?
- Is the stream/broadcast fork doing real work or is it decorative?
- Is the visual language internally consistent with the constraints in section 4–7, and
  where does it slip?
- Where does it still read as a generic AI/SaaS landing page rather than a broadcast tool?
- What is the single highest-leverage change to make it convert?

Be specific and cite file:line. Rank by impact. Do not soften. If something is fine,
say so briefly and move on — I want the problems.
