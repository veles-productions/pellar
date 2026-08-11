# PICK UP HERE — next session

## What is waiting for you

**1. Sol's review** → `.review/SOL_REVIEW.md`

Launched 2026-08-11 ~14:42 CEST via `codex exec -m gpt-5.6-sol -c model_reasoning_effort=medium`
against `REVIEW_BRIEF.md` in this worktree. It writes its own output file and prints DONE.

Check it first thing:

```bash
cd C:/AI_LAB/worktrees/pellar-v4-salespage
ls -la .review/
cat .review/SOL_REVIEW.md          # the review, if it landed
tail -40 .review/sol-run.log       # what happened, if it did not
```

If `SOL_REVIEW.md` is missing or truncated, the run died with the session. Re-run:

```bash
cd C:/AI_LAB/worktrees/pellar-v4-salespage
codex exec -m gpt-5.6-sol -c model_reasoning_effort=medium --skip-git-repo-check \
  "Read REVIEW_BRIEF.md, review sales-page-v4.{html,css,js} against it, write the review to .review/SOL_REVIEW.md, print DONE." \
  > .review/sol-run.log 2>&1
```

**2. Our own critique** → `.review/COMMS_CRITIQUE.md`
`/critique` (design, 27/40 on Nielsen) + `/pitch-surgeon` (conversion). Already done — read
it before Sol's so you can tell which findings are independent agreement and which are new.

## The state of the page

Branch `v4-sales-page`, worktree `C:\AI_LAB\worktrees\pellar-v4-salespage`, off `main`.
Commits: `29e8e77` build → `a8b0a8e` font/composites → `2385be2` 2×2 + compat + NVIDIA →
`cb71be1` spring, knob, hero plate, bugs.

Serve it: `python -m http.server 8791` then `http://localhost:8791/sales-page-v4.html`.

Design language it is built to: `C:\AI_LAB\pellar\.grill-me\pellar-website-design-language\`
— read `SUMMARY.md` and `CONSTRAINTS.md` first, they are short.

## The three things already known to be wrong

1. **Zero `:focus-visible` rules.** P0 accessibility.
2. **`.label` is 10px mono at `--text-3`** — fails AA contrast at that size.
3. **Scroll motion is hand-rolled rAF**, against the GSAP house rule.

Plus the big one from pitch-surgeon: **the hero sells voice, but voice is not the product.**
The template library and the verify step are. Highest-leverage change is moving the
pre-rendered-graphic mechanism ("changing one digit takes three minutes, you are on air
now") into the hero and demoting voice to the fast path.

## Decisions still owed by Sam

- Which comes first: the P0/P1 accessibility pass, or the missing close (pricing, FAQ, proof)?
- What proof is cleared for public use? No customer name appears on the page because nobody
  has said which are allowed. This is the single biggest content gap.
- The waitlist-lane merge decision: merge everything, or cherry-pick the waitlist files onto
  `main`. Until that happens `privacy.html` 404s from this page's footer.
- Whether the Polish graphics (Legia–Lech, WYBORY SAMORZĄDOWE) stay for a non-Polish audience.

## Not to be re-litigated

- Orange in the product UI screenshots is **TVP's show branding**, not Pellar's. Site palette
  is navy → teal (light), charcoal/grey (material), Veles red `#E63946` (the only accent).
- The operator panel on the page is a **rebuild**, deliberately. The only real capture that
  exists is a TVP client build and cannot go public.
- **No playout claims.** The feature does not exist. The transport strip is a preview scrubber.
