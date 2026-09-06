# GRAVIK — Operating Instructions

Concrete, actionable rules for working in this repo. Read `contexts.md` (what exists)
and `memory.md` (why it's built this way) first — this file is *how* to work here.

## First thing to do in a new session

The active motion task is in
`C:\Users\Nikil Krishnan\.codex\worktrees\gravik-motion`, not the original
checkout. Read `contexts.md`, run `git status`, and confirm the branch is
`codex/motion-choreography` at baseline `99b93ed` with the documented uncommitted
changes. When the user asks to resume, continue the six open final-review fixes
without asking to commit first. Ask before committing or pushing only after the
implementation and independent rereview are clean.

Use the explicitly requested `superpowers:subagent-driven-development` and
`nateherk-design:scroll-craft` workflows. Any new implementer or reviewer for the
remaining task must use GPT-5.6 Sol with medium reasoning, as requested by the
user. Do not resume before the user starts the new session/task.

## Resume checklist for the active motion task

1. Work only in the motion worktree and preserve all uncommitted project changes.
2. Read `.superpowers/sdd/motion-plan/progress.md` and `final-review.md`.
3. Fix the six findings recorded in `contexts.md`; do not restart phases 1–4.
4. Keep booking rules in `src/lib/booking/` and preserve request/confirmation copy.
5. Rebuild a fresh production preview and rerun the full acceptance matrix plus
   targeted daypart, row-exit, mask, live-region, reduced-motion, and performance
   checks.
6. Regenerate the SDD diff packages and obtain a GPT-5.6 Sol medium whole-branch
   PASS before calling the work complete.
7. Do not commit or push without explicit user authorization.

## Commands

```bash
# from Documents/Projects/gravik-web
pnpm install
pnpm run typecheck   # tsc --noEmit
pnpm run dev         # http://localhost:5173
pnpm run build       # -> dist/
pnpm run serve       # preview the production build
```

`vite.config.ts` defaults `PORT` to `5173` and `BASE_PATH` to `/`, so all of the
above work with **no env vars needed**. Only set `PORT=<n>` / `BASE_PATH=<path>`
explicitly if you need a specific port or a sub-path deployment — and if you do,
prefix with `MSYS_NO_PATHCONV=1` on Windows Git Bash, or MSYS mangles `BASE_PATH=/`
into a Windows filesystem path and the build throws or warns.

No `gh` CLI and no `GITHUB_TOKEN`/`GH_TOKEN` exist in this environment. For any
GitHub action (create repo, open PR, etc.) beyond plain `git push` (which works via
the Windows credential manager's cached auth), use the Claude-in-Chrome connector
against the user's real, logged-in Chrome — don't declare it impossible without
checking `ToolSearch` for it first.

## GateGuard

This environment runs a "fact-forcing gate" on `Bash`, `Edit`, and `Write`. Before
the *first* touch of any given file in a session, and before certain Bash commands,
it demands: importers/callers, affected API, data-schema notes if relevant, and the
user's verbatim instruction. This is not optional and does not mean something is
wrong — just answer it (grep for real importers rather than guessing) and retry the
same call. Never try to bypass it with `ECC_GATEGUARD=off` unless the user
explicitly says to.

## Coding conventions

- **Styling:** semantic classes in `src/index.css`, driven by the `--*` custom
  properties. Don't introduce a second styling system (styled-components, CSS
  modules, Tailwind-utility-heavy JSX) for new work — match the existing idiom.
- **Never use a 4-value `padding`/`margin` shorthand on an element that also
  carries a shared class** (e.g. `.shell`). A real bug shipped once from exactly
  this: `.booking-page { padding: 60px 0 100px }` silently zeroed `.shell`'s
  horizontal gutter because the shorthand's `0` for the inline axis won the
  cascade. Use longhand `padding-top`/`padding-bottom` when you only mean to set
  one axis.
- **Domain logic lives in `src/lib/booking/*.ts`.** Pure functions only — no
  React, no DOM, no side effects at import time. UI components import from there;
  never reimplement pricing, slot-time formatting, session-merging, or the
  WhatsApp message text inline in a component.
- **Respect `prefers-reduced-motion`.** Every `framer-motion` usage in this repo
  gates on `useReducedMotion()` and skips the animation (empty props, not just a
  shorter duration) when true. Match that pattern for any new motion.
- **Icons:** `lucide-react`, one consistent stroke width (the library default, 2 —
  don't add per-icon overrides). Don't reuse the same icon for two different
  concepts on the same screen (this was a real, fixed issue — see `memory.md` #3).
- **Space Grotesk stays at weights 500/600/700 only** — the Google Fonts `@import`
  in `index.css` doesn't load 800. If a design calls for a heavier label, use
  Manrope 800 or bump `Anton` for that spot, don't request an unloaded weight.
- **Booking copy wording is load-bearing** (see `memory.md` #4) — "request,"
  "awaiting confirmation," "we'll confirm on WhatsApp," never "confirmed," "paid,"
  "booking ID," or anything implying the transaction is complete. This applies to
  any new copy touching the booking flow, not just the existing strings.
- **`/privacy` and `/terms`:** don't write real legal text into these without the
  user explicitly supplying it or explicitly asking you to draft it as a real
  policy (as opposed to updating the placeholder wording).

## Verification bar — what "done" means here

This project has been built and re-verified multiple times with a specific standard
that should carry forward:

1. `pnpm run typecheck` clean.
2. `pnpm run build` succeeds.
3. **Actual browser verification**, not just "the build passed." For anything
   touching layout: check `document.documentElement.scrollWidth ===
   document.documentElement.clientWidth` (zero horizontal overflow) at real
   viewport widths — and specifically at the *exact* CSS breakpoint boundaries
   (767/768/769, 1119/1120/1121), since that's where bugs actually hide, not in
   the middle of a range.
4. For anything involving live-computed values (booking totals, slot picks), drive
   the actual interaction (click buttons via `javascript_exec`, not just read
   static markup) and check the resulting numbers are arithmetically correct, not
   just "a number appeared."
5. If a finding looks alarming, verify the *verification* before reporting it as a
   bug — a broad selector or a stale assumption can produce a false alarm (see
   `memory.md`'s self-correction note). Prefer a more specific query over
   concluding "it's broken."
6. Screenshots in this browser-pane tooling are unreliable at desktop widths
   (cropped/rescaled) and reflect throttled-tab behavior for anything animated
   (see `memory.md`'s visibilityState note). Prefer `getComputedStyle`/
   `getBoundingClientRect`/`scrollWidth` measurement over screenshots for anything
   that needs to be trustworthy; use screenshots as a supplementary sanity check
   only.

## What not to do without being asked again

- Don't touch `Documents/Projects/gravik-app` or push to
  `NikilKrish/Gravik-PickleBall-App-booking-slot` — retired.
- Don't add a test framework.
- Don't add a backend, database, or real payment integration to the booking flow.
- Don't reintroduce peak pricing or fake slot availability.
- Don't re-run the redesign-audit "stretch" items (grain overlay, spotlight
  borders, facilities-section depth treatment) — they were seen and declined.
- Don't "fix" the `Space Grotesk` font choice — it's intentional, see `memory.md`.
- Don't commit or push in this repo without asking first, even though earlier work
  here has been pushed before — treat each push as needing fresh confirmation.
