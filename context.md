# GRAVIK — Project Context

Handoff doc for a fresh session. Read this + `memory.md` + `instructions.md` before doing anything.

## What GRAVIK is

A real pickleball + cricket-nets facility opening **6 Sept 2026** in Ambattur, Chennai
(Plot No. 28, VGN Victoria Park, Enford Street). Two courts/nets: Pickleball (3 courts,
₹750/hr flat) and Cricket Nets (1 net with bowling machine, ₹500/hr flat). No peak
pricing — that was a deliberate product decision, not an oversight.

Owner: Nikil Krishnan (nikil.june25@gmail.com). Contact numbers +91 6385 515521 /
515531, gravik0523@gmail.com, @gravikpadel on Instagram. Also listed on Turftown and
Playo (third-party booking platforms).

## The three local folders — what each one is

| Path | What it is | Status |
|---|---|---|
| `Documents/Projects/Gravik` | The **original Claude Design import** — `.dc.html` artboards (`Home Clay and Bone`, `Booking Calendar Clay and Bone`, `Gravik Design System`, `GravikMobileApp`, plus Teal/Ink-Amber palette variants), brand images, `github.md` (design-sync manifest), a PDF business spec. **Source of design truth**, not a working app. Belongs to Claude Design project `3b9b988f-831e-49bb-b9ae-c3df52f191e5`. |
| `Documents/Projects/gravik-app` | A **git clone of the Replit monorepo** `NikilKrish/Gravik-PickleBall-App-booking-slot` (pnpm workspace, also holds an unused `api-server` skeleton and `mockup-sandbox`). Branch `feat/clay-and-bone-booking`, 15 commits, HEAD `2238627`, clean, **not pushed**. **Retired per explicit user instruction — "no more using the Replit GitHub repo."** Kept only as historical record of how the build happened; do not develop here going forward. |
| `Documents/Projects/gravik-web` | **The canonical, standalone repo** — extracted from `gravik-app`'s `sk-pickleball-academy` package, all Replit/workspace-only tooling stripped. Pushed to `https://github.com/NikilKrish/gravik-web` (public). **This is where all future work happens.** |

## gravik-web — what's actually in it

Vite 7 + React 19 + TypeScript. No backend, no database, no auth — by design (see
below). Styling is plain CSS custom properties in `src/index.css` (not the Tailwind
utility approach, even though `tailwindcss`/`@tailwindcss/vite` are installed —
Tailwind is present for the `src/components/ui/**` shadcn scaffold, which is largely
unused boilerplate carried over from the Replit template and not part of the built
pages).

**Routes** (`src/App.tsx`, wouter):
- `/` — home page (`src/pages/home.tsx`)
- `/book`, `/book?sport=pickleball`, `/book?sport=cricket` — booking flow
  (`src/pages/booking.tsx` + `src/components/booking/*`)
- `/privacy`, `/terms` — placeholder pages (honest "coming soon, contact us" copy,
  **not real legal text** — do not fabricate legal language into these)
- anything else — branded 404 (`src/pages/not-found.tsx`)

**Design system** — "Clay & Bone": `--bg #14120F`, `--bg-off #1C1915`,
`--bg-light #24201A`, `--clay #D9603A`, `--bone #E8DCC8`, `--ink #F2ECE0`,
`--muted #A89F8E`, `--dim #6E6659`. Type: Anton (display, weight 400 only),
Space Grotesk (labels/buttons/nav — **weights 500/600/700 only, 800 is not loaded**),
Manrope (body). Sharp corners throughout (near-zero border-radius) — deliberate
neo-brutalist hard-shadow language, don't soften it. Breakpoints: 768px (nav/grid),
1120px (booking split-to-stacked layout).

**The booking flow, and why it has no backend:** GRAVIK has no reservation system.
The flow is sport → date → court → time (max 4 one-hour slots, `MAX_SLOTS` in
`src/lib/booking/catalog.ts`) → add-ons → payment preference → player count → a
pre-filled **WhatsApp message** (`wa.me/916385515521`) that the user sends. A human
at GRAVIK confirms manually. Because of this:
- **All slots are always available.** There is no availability data and none should
  ever be invented (no random "booked" slots, no fake scarcity).
- **Pricing is flat**, no time-of-day surcharge.
- **Nothing is ever "confirmed" or "paid" by the app.** Copy is deliberately worded
  as a *request* — "Awaiting confirmation," "Nothing is charged now," "We'll confirm
  on WhatsApp." This wording is load-bearing, not a style choice — do not let it
  drift toward implying a completed transaction.
- Domain logic (pricing, slot math, session merging, the WhatsApp message builder)
  lives in `src/lib/booking/*.ts` — pure functions, no React, no side effects. UI
  components must call into these, never reimplement pricing/formatting/slot logic
  inline.

## Build history (chronological, for context — not a to-do list)

1. Imported the Claude Design project into `Documents/Projects/Gravik`.
2. A long "grilling" Q&A resolved ~13 product/scope decisions (see `memory.md` for
   the ones that still matter going forward).
3. Cloned the Replit repo into `gravik-app`, built the whole site there via
   subagent-driven-development across 7 tasks (tokens/typography → routing → home
   content → booking domain → slot picker → review + WhatsApp handoff → final
   polish/a11y). Each task got an independent spec-compliance review and (for the
   risky ones) a code-quality review. Two real bugs were caught this way: a
   `padding` shorthand that silently wiped the page gutter, and a burned-in
   "OPEN 24 HOURS" badge inside `pickleball-action.webp` that contradicted the
   deliberately-vague-hours decision (cropped it out).
4. Verified responsive behavior with a full breakpoint sweep (320 → 1920px,
   including the exact 768/1120 boundary pixels) — all passed with zero horizontal
   overflow anywhere.
5. User asked for a clean break from Replit. Extracted `sk-pickleball-academy` into
   the new standalone `gravik-web` repo, resolved all `catalog:` pnpm-workspace
   version refs to literal versions, dropped 3 unused `@replit/vite-plugin-*`
   packages and the unused `@workspace/api-client-react` dependency. Verified the
   standalone build is functionally byte-identical to the monorepo build (only
   difference: minifier non-determinism in one unexported variable name). Pushed to
   a new GitHub repo, created live via the Claude-in-Chrome connector (the user's
   real logged-in Chrome session, not an API token) since no `gh` CLI or
   `GH_TOKEN` exists in this environment.
6. Ran a redesign/taste audit against `gravik-web` (evidence-based — every finding
   grounded in an actual file:line, not a generic checklist pass). User approved 9
   of the findings; **these 9 fixes are implemented but not yet committed** — see
   "Current uncommitted state" below.

## Current uncommitted state in gravik-web (as of this handoff)

Working tree is **dirty**. `git status --short` shows:
```
 M index.html
 M public/favicon.svg
 M src/App.tsx
 M src/components/booking/RequestSent.tsx
 M src/components/booking/ReviewStep.tsx
 M src/components/booking/SlotPicker.tsx
 M src/index.css
 M src/pages/booking.tsx
 M src/pages/home.tsx
 M src/pages/not-found.tsx
?? .impeccable/
?? src/pages/privacy.tsx
?? src/pages/terms.tsx
```
This is the complete 9-fix redesign polish pass (see `memory.md` for exactly what
each fix does). It has been typechecked, built, and browser-verified — it is
finished work, just not committed or pushed. **A new session should ask the user
whether to commit+push this before doing anything else that touches these files**,
so nothing gets silently squashed together with unrelated new work.

`.impeccable/config.json` is a design-lint tool config with one narrow suppression
(the "overused font: Space Grotesk" finding — see `instructions.md` for why it was
suppressed rather than fixed). It's a real file, not an accident — don't delete it.

## Not done / open items

- Nothing committed/pushed since `12f7c2a` (see above).
- No test framework exists anywhere in this project, and none should be added
  casually — it was a deliberate omission agreed with the user (no backend to test
  against, and the domain logic was verified by direct execution during the build,
  not unit tests).
- `/privacy` and `/terms` are placeholders. Real legal copy is the user's call, not
  something to generate.
- No production deployment target has been chosen yet (Vercel/Netlify/other — the
  standalone build has no opinion, `vite build` outputs to `dist/`).
- Redesign audit stretch items were explicitly declined by the user and are **not**
  pending — don't resurrect them without being asked: facilities-section background
  depth, a grain/noise overlay, and cursor-tracked spotlight borders on cards.
- `gravik-board.png` in `public/brand/` is ~2MB, used only as a low-opacity
  grayscaled background behind the map QR panel. Flagged once, user chose to leave
  it as-is — don't re-raise unless asked.
