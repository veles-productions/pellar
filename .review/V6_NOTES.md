# v6 — build notes after Sam's v3/v6 review

**What / Why / What you do**
- **What:** `sales-page-v6.{html,css,js}` — v4's spine, v3's voice and warmth, and your review applied.
- **Why:** v3 had the best gut feel; v4 had the right argument. v6 is meant to be both.
- **What you do:** look at it, then answer the two content gates and the one palette question at the bottom.

---

## Your v6 list, item by item

| You said | Done |
|---|---|
| Long paragraphs of text | Every lede cut to 1–2 sentences. Hero lede 4 lines → 3. Cell and chain copy roughly halved |
| Lots of tiny text | Root is now **17px** and the microlabel floor is **0.8rem (13.6px)**, up from 10–11px. Smallest rendered text on the page is now 12.6px and it is a decorative icon chip, not copy |
| No standard footer | Four-column footer: brand + one-liner, Product, Contact, Programme with the **Inception badge and its one-liner**, plus a copyright bar |
| 06 "Who it's for" not centred | Centred |
| Missing Veles reel | `veles-reel.mp4` is now the proof in "Made by people who put graphics on air", with native controls and a caption. Its baked-in 2.35:1 letterbox is cropped away |
| Way too much text on the signup | Offer block cut from a 4-part panel to three one-line steps. Intro lede down to one sentence |
| Toggle should read as a light switch | Rebuilt as a wall rocker — recessed plate, ribbed paddle that throws top-to-bottom, LED that lights when the lights are on |
| Nav should be right, not centre | Logo left, everything else anchored right |
| Streamer image is wrong — it's someone editing | Swapped to `homestudio.jpg`: ring light, boom mic, person on camera. It was already in the repo, unused |
| The control-room image is the one you want | Kept, and its treatment — picture falling away to black around the subject — is now applied to every media block on the page |
| Colour balance: too much red conflict | See below |
| Logo wall is good | Kept, and it is now where the "Stream" fork card lands |
| Four animated template families are good | Kept |

## Carried over from your v3 notes

- **The key button.** v3's pale cap with the hard drop shadow and the LED strip is back, on both CTAs. It was the one control everyone wanted to press.
- **The scroll-scrubbed orb.** Restored as a real GSAP scrub — verified moving 0 → 4.99s across the pass, so the poll resolves out of the hand as you scroll rather than appearing by magic.
- **Sora** display face, **numbered section indices**, **status rail** with LED states, **skip link**, and the **tabbed template console** — all v3, all in.
- v3's two gaps are closed here: it had **no light/dark toggle** and **no Inception logo in the footer**. v6 has both.

## The red

You were right that v6 was fighting itself. The design language says the accent "signals state and emphasis only", and the old build had red on section indices, step labels, chevrons, link arrows, frame brackets on every image and seven rows of tick meters. That is decoration, which the language actually forbids.

Red now appears only where something is genuinely stateful:

- the hero frame brackets (and only the hero — every other frame is neutral)
- the scrub thumb, the selected template dot, the LED under the key
- the LIVE dot, "Testing now", "In testing"
- the access rule and the send button

Filled tick meters are now white, not red. Indices, step labels and chevrons are grey. That is where most of the calm comes from.

## ⚠ Three things still owed

**1. Named customer.** Slot built and commented out in `#origin`. Candidates from the 11 Aug training session: Super Express (pie chart + flowchart, hard on their current Vimix — a named incumbent and a named gap) and TVP as a reference. Nothing publishes until you clear a name.

**2. Cohort size and pilot terms.** "First N teams", free / paid / credited. Commented in above the form. Without it the CTA still has no reason to act *now*.

**3. The palette question — this one is new and it is yours.**
Part of why v3 feels calmer is that **v3's accent is blue** (`#75b7ff`), not Veles red. The design language you locked on 11 Aug says red is the only accent and that teal-blue may never label a category or mark emphasis. I got v6 calm by making red *rare* rather than by changing the accent, because unlocking that is not my call. If what you actually liked was v3's blue, that is a design-language change, and it should be a deliberate one.

## Open, answered

- **Roadmap section — my recommendation is no, not today.** The compatibility section already does the "what's coming and in what order" job with real content. A product roadmap needs dates we do not have, and it invites the one question the page cannot answer yet. Add it once pricing and the pilot cohort exist, so it has something to count down to.
- **Streamer vs broadcaster blend — solved structurally.** The fork identifies; the two cards now point at genuinely different sections. "Broadcast" goes to the control-room chain (roles, permissions, verify). "Stream" goes to the creator path (the logo wall — your own stack, OBS/vMix/NDI). Both cards say plainly that they jump down the page, so the promise is kept instead of dumping you on an undifferentiated anchor.

## Still broken, not by me

`privacy.html` 404s from the footer and the consent line. It lives on `waitlist-double-optin` and has never been merged. Same decision as before.

## Verified this round

1440 / 390 / tall, dark and light. Zero console errors, no horizontal overflow at 390px.
In the live DOM: GSAP loaded with 2 ScrollTriggers (hero + orb); orb scrub confirmed advancing;
reel cropped to 2.35:1; switch exposes `role="switch"` + `aria-checked`; 0 images without `alt`;
0 unlabelled form controls; one `<main>`, one `<h1>`; smallest rendered text 12.6px.
`app.js` untouched — the theme control is `#theme-knob`, so its legacy `#theme` handler stays dormant.
