# GRAVIK — Memory (user, decisions, working style)

## The user

Nikil Krishnan (nikil.june25@gmail.com). Owns/runs GRAVIK, a pickleball + cricket
facility opening 6 Sept 2026 in Chennai. Comfortable delegating implementation
end-to-end but pushes back hard when told something "can't be done" that plausibly
can — see the GitHub-repo-creation exchange below. Reviews work by actually opening
the preview, not just reading a summary.

## Standing product decisions — do not re-litigate these

These came out of an explicit "grilling" (structured Q&A) session before any code
was written. Each was a deliberate choice, not a default:

1. **Flat pricing, no peak/off-peak surcharge.** Removes revenue on high-demand
   hours; the user chose this anyway for simplicity. Don't reintroduce peak pricing.
2. **All booking slots shown as available, always.** No fake scarcity, no random
   "booked" slots, no blocking of past times. This was chosen over three other
   options (hand-maintained availability file, keep-fake-availability, block-past-
   only) specifically because a hand-maintained file would go stale and fake
   availability actively loses real bookings.
3. **Operating hours deliberately left vague** in marketing copy ("Open daily") —
   hours are genuinely undecided. Do not add specific opening/closing times to any
   user-facing copy. (The booking grid's internal 06:00–24:00 range is an
   implementation detail, not a public claim.)
4. **No backend, ever, for this iteration.** The booking flow ends at a WhatsApp
   handoff. Confirmation, payment, and persistence are all handled by a human,
   off-platform. Do not propose adding a database/API to "complete" the booking
   flow — that was explicitly scoped out, twice (once for the whole flow, once
   again when review/payment UI was added — pay-mode selection is cosmetic, not
   wired to a payment processor).
5. **CTAs go to WhatsApp**, not a third-party listing (Turftown/Playo) and not a
   phone call — chosen because it keeps sport context in the message and needs no
   new infrastructure.
6. **Assets are used as delivered**, not re-encoded/optimized, *except* where an
   image actively contradicted approved copy (the "OPEN 24 HOURS" badge burned into
   `pickleball-action.webp` — that was cropped because it re-asserted a claim the
   hours-vagueness decision had just retired, not for file-size reasons). Don't
   go on a general image-optimization pass unprompted.
7. **Delivery process:** feature branch, local commits, **no auto-push** unless
   asked. This applied to the original `gravik-app` build and should be treated as
   the default going forward in `gravik-web` too — always ask before pushing.

## The redesign audit — what was approved, what wasn't

A `/taste-skill:redesign-skill` pass audited `gravik-web` against generic-AI-design
patterns. The user's explicit choice was **"The 9 concrete fixes"** — not the
top-2-3 minimal option, not "everything including stretch ideas." The 9:

1. Motion added to the entire booking flow (it had zero, while the home page had
   full scroll-reveal animation — a real asymmetry, not a taste opinion).
2. `font-variant-numeric: tabular-nums` on every live-updating number (booking
   totals, stepper) so digits don't jiggle the layout as they change.
3. De-duplicated repeated benefit icons (`Users` was reused 3×, `ShieldCheck` 2×) —
   swapped in `Award`, `GraduationCap`, `Shirt` where they fit the copy.
4. Standardized icon stroke width (dropped a lone `strokeWidth={1.5}` override so
   every icon site-wide renders at the lucide default of 2).
5. Recolored the favicon from a stale pre-rebrand `#FF3C00` to the current `--clay`
   `#D9603A`, and gave it the same paddle silhouette used in the live cursor
   (reused geometry from `PaddleCursor.tsx`, not new art).
6. Added `og:image`/`twitter:image` (pointing at the already-cropped
   `pickleball-action.webp`) — relevant specifically because the whole funnel
   routes through WhatsApp/social sharing, so a blank link-preview card matters
   more here than on a typical site.
7. Footer background changed from a literal `#000` to `var(--bg)` — it was the one
   place a pure-black broke from the rest of the page's warm-dark palette.
8. `text-wrap: balance` added to `.display` (the headline class) to stop orphaned
   words on headlines without a manual `<br/>`.
9. Skip-to-content link + `/privacy` and `/terms` placeholder routes + footer
   Privacy/Terms links. **The placeholder pages deliberately contain no real legal
   text** — just an honest "finalizing this, email us" notice — because inventing
   binding legal language wasn't something I was willing to fabricate. If asked to
   "finish" these pages later, that's a content/legal decision for the user to
   supply, not something to generate.

**Explicitly declined** (do not implement unless asked again): facilities-section
background depth treatment, a grain/noise overlay, cursor-tracked spotlight borders
on cards. Also explicitly *not* changed, on purpose, despite the redesign skill's
generic checklist flagging it: the `Space Grotesk` typeface. It's used only in a
secondary role (labels/buttons/nav) alongside the distinctive Anton display face,
traces back to the original Claude Design artboard the user chose, and was reviewed
in-session and judged a strength, not a generic-AI tell. Suppressed the linter
finding rather than "fixing" a non-problem — see `instructions.md`.

## Things that actually happened worth knowing about

- **GitHub repo creation:** I initially told the user I couldn't create a GitHub
  repo (no `gh` CLI, no token). The user pushed back — "you have a github connector,
  you have claude for chrome, you can't do this?" — and was right: I have access to
  Claude-in-Chrome, which drives the user's *real*, already-logged-in Chrome. I used
  that to actually create `github.com/NikilKrish/gravik-web` through the real GitHub
  UI, then pushed via the existing Windows credential-manager git auth. **Lesson:**
  when told "you can't," actually check what's available (`ToolSearch`) before
  repeating the claim — the user had already noticed a capability I'd dismissed.
- **Self-correction the user should know about:** during the redesign-fix
  verification, I initially flagged the mobile sticky CTA bar as visible at desktop
  width (a real-looking bug) — it turned out to be my own selector matching the
  wrong element (`<main class="... has-mobile-cta">`, not the actual bar). I caught
  it myself with a more precise query before reporting anything wrong. Worth
  knowing this pattern exists (verify your verification), not worth re-litigating.
- **Environment quirk, not a bug:** the browser-automation pane reports
  `document.visibilityState: "hidden"` regardless of which tab is "fronted," which
  throttles `requestAnimationFrame` and makes framer-motion animations appear stuck
  mid-fade when inspected via JS immediately after navigation. Confirmed this by
  showing the *pre-existing, already-shipped* hero animation exhibits the identical
  stall in the same environment — i.e., it affects all motion code uniformly, it's
  not something introduced by new work. A screenshot mid-throttle still shows the
  animation genuinely progressing (just slowed way down), which is the real
  evidence, not the DOM style snapshot. If this comes up again, don't re-diagnose
  from scratch — it's an artifact of this specific browser-pane tooling, not the
  site.
