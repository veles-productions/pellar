# Pellar sales page v4 — comms-stack critique

Run 2026-08-11 against `sales-page-v4.html` @ `cb71be1`, branch `v4-sales-page`.
Skills used: `/critique` (design + Nielsen heuristics), `/pitch-surgeon` (conversion).
Companion: `.review/SOL_REVIEW.md` — independent Codex/Sol design + code review.

---

## Part A — /critique verdict

**AI-slop check: PASS with one tell.** Clean on palette, gradient text, glassmorphism,
metric-card hero, emoji icons, decorative blobs, slop vocabulary. The one tell is
**Inter everywhere** — the baseline names it explicitly. Inter 700 at −.045em plus
JetBrains Mono microlabels gives it *some* voice, but there is no display face of its own.

**Health score: 27/40.**

| # | Heuristic | Score | Issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | No loading state on hero video |
| 2 | Match system / real world | 4 | Control-room vocabulary is native |
| 3 | User control and freedom | 3 | No way to pause the scrub |
| 4 | Consistency and standards | 3 | 7 identical `.cell` cards, two meanings |
| 5 | Error prevention | 3 | Email validated before POST |
| 6 | Recognition over recall | 3 | Nav marks active section |
| 7 | Flexibility and efficiency | 2 | **Zero focus styles** |
| 8 | Aesthetic and minimalist | 3 | ~250px dead gap, compat → waitlist |
| 9 | Error recovery | 3 | Form error copy is human |
| 10 | Help and documentation | 0 | No FAQ, pricing, or next-step |

**Working:** the safe-area frame borrowed from the product carries the page; the animated
composites argue better than copy can; the copy passes the sceptic test and claims no
playout.

**Priority design issues**
- **[P0]** Zero `:focus-visible` rules. Keyboard users are blind. → `/harden`
- **[P1]** `.label` 10px mono at `--text-3` ≈ 4.6:1, fails AA at that size. → `/normalize`
- **[P1]** Hand-rolled rAF against the GSAP house rule. → `/animate`
- **[P2]** Seven identical bento cells across sections that mean different things. → `/arrange`
- **[P2]** The page cannot close — no pricing, FAQ, proof or next step. → `/clarify`

**Persona red flags**
- *Marek, newsroom producer, on his phone between bulletins:* taps "Broadcast", lands on
  an anchor not a page. No pricing, so he cannot take it to his manager. Leaves.
- *Kuba, solo streamer, keyboard-first:* loses the focus ring at the hero and tabs blind.
  Reads "Needs Pellar QA" against Streamlabs — which he uses — as "doesn't work yet."

---

## Part B — /pitch-surgeon verdict

Awareness level: **2** (cold, problem-aware at best). Motion: single — waitlist.

```
FINDING: The page has no offer shape at all.
SEVERITY: CRITICAL
LOCATION: #waitlist, and by omission everywhere
WHY IT FAILS: The buyer cannot tell what they get, when, on what terms, or what
  happens after they type an email. A newsroom producer cannot take "join the
  waitlist" to a manager. There is no scope, no timeline, no commercial anchor,
  not even "early access opens Q1, 10 teams, free during pilot."
FIX: Add a short offer block above the form — what early access includes, how
  many teams, what it costs during pilot, and what the first call covers. It does
  not need a price. It needs a shape.
```

```
FINDING: Zero proof. The entire page is claims plus stand-in footage.
SEVERITY: CRITICAL
LOCATION: whole page
WHY IT FAILS: Proof-before-promise is the rule and this page has none — no named
  customer, no number, no citation, no third-party mark except the NVIDIA badge
  buried in the footer. "The graphics are not mockups" is the only evidence-shaped
  line on the page and it is asking the reader to take its word.
FIX: Nothing here needs a cleared customer name. Usable today: the number of
  templates in the library; a rendered-frame count or render time; "built by a
  broadcast production company, not a software startup"; the NVIDIA Inception mark
  moved somewhere it does work. Get one hard number above the fold.
```

```
FINDING: The hero selects on voice, but voice is explicitly not the product.
SEVERITY: HIGH
LOCATION: sales-page-v4.html — h1 "Say it. It's on air."
WHY IT FAILS: The page's own spine (per the 11 Aug training session) is the
  template library and the verify step. The headline promises a voice assistant,
  which is the demo. A broadcaster reads "voice" and files it under gimmick; the
  page then spends eight sections arguing something else.
FIX: Lead on the trapped situation, not the interface. The strongest line already
  on the page is buried mid-scroll.
```

```
FINDING: The 3-5 minute mechanism — the single best asset — is buried and abstract.
SEVERITY: HIGH
LOCATION: the full-bleed band, "Three minutes is an eternity"
WHY IT FAILS: This is the one line a producer would repeat to a colleague, and it
  sits four screens down, stated as a feeling rather than a mechanism. The concrete
  version — open After Effects, edit a text layer, re-export, re-import, re-trigger
  — is what makes it undeniable, and it is in the body copy where nobody reads it.
FIX: Move the mechanism to the hero. Something in the shape of: "Changing one digit
  on a pre-rendered graphic takes three minutes. You are on air now."
```

```
FINDING: The stream/broadcast fork promises segmentation and delivers an anchor.
SEVERITY: HIGH
LOCATION: .fork-card href="#what" and href="#chain"
WHY IT FAILS: The cards read as a routing choice — pick your world, get your page.
  Clicking scrolls you down the same undifferentiated page. The buyer notices, and
  it costs trust at the exact moment they self-identified.
FIX: Either build the two sub-pages (already the plan, after this page's design is
  signed off) or restyle the cards so they read as "which of these is you"
  positioning rather than navigation.
```

```
FINDING: The compatibility roadmap reads as a stop sign to the audience it targets.
SEVERITY: MEDIUM
LOCATION: #compat
WHY IT FAILS: Four of six rows say NEEDS PELLAR QA, INDIRECT, or TARGET. The honesty
  is right and worth keeping, but a Streamlabs user sees their own tool marked
  not-ready and leaves. Honesty without a date reads as "not yet", not as "soon".
FIX: Keep every status. Add a date to each. "Needs Pellar QA — targeted Q4" converts;
  "Needs Pellar QA" repels.
```

```
FINDING: "Verified templates" appears in the hero subhead before the reader knows
  what verify means.
SEVERITY: MEDIUM
LOCATION: hero .lede
WHY IT FAILS: It is the page's best differentiator and it is spent as jargon three
  seconds in, six sections before it is explained.
FIX: Either explain it in the same breath or hold it until the verify section earns it.
```

```
FINDING: One CTA, repeated three times, with no reason to act now.
SEVERITY: MEDIUM
LOCATION: header, hero, #waitlist
WHY IT FAILS: Identical label, identical weight, no scarcity, no deadline, no
  differentiated ask for the two audiences the page just spent a section splitting.
FIX: Differentiate at least the final one, and give it a reason: cohort size, opening
  date, or what the first ten teams get that the eleventh does not.
```

```
FINDING: The segment selector wastes its own signal.
SEVERITY: LOW
LOCATION: #waitlist select
WHY IT FAILS: "Something else" is an option on a page that just argued there are
  exactly two kinds of buyer, and nothing on the page tells the user why answering
  helps them.
FIX: Drop to the two real segments, and say what changes based on the answer.
```

**The Artur test:** the only line on the page repeatable from memory is "Three minutes
is an eternity" — and it is not in the hero. That is the whole diagnosis in one sentence.

**Highest-leverage change:** move the pre-rendered-graphic mechanism into the hero and
demote voice to the fast path. Everything else on this list is smaller than that one move.
