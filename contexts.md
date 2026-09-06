# GRAVIK motion choreography — resume context

Last updated: 6 September 2026. The user explicitly stopped the task after the
final broad review hit the GPT-5.6 Sol usage limit. Do not continue automatically
in the session that wrote this file. In a new session, resume from the open
findings below; do not restart the implementation.

## Workspace and git state

- Original checkout: `C:\Users\Nikil Krishnan\Documents\Projects\gravik-web`
  on `main` at baseline commit
  `99b93edd2c7a4ec98444e884a69cd91ba00030ed`. Its product source remains
  untouched; only these requested resume documents were mirrored there so a new
  session starting in the original checkout can find them.
- Active isolated worktree:
  `C:\Users\Nikil Krishnan\.codex\worktrees\gravik-motion`.
- Active branch: `codex/motion-choreography`.
- All motion work is deliberately uncommitted. Repository instructions require
  asking before any commit or push. Do not commit or push while resuming unless
  the user authorizes it.
- The user required remaining implementation and review agents to use
  **GPT-5.6 Sol, medium reasoning**.
- The user explicitly invoked `superpowers:subagent-driven-development` and
  `nateherk-design:scroll-craft`; keep using their workflow on resume.

Current changed project files include `index.html`, `src/App.tsx`,
`src/components/PaddleCursor.tsx`, booking UI components, `src/index.css`,
`src/pages/booking.tsx`, and `src/pages/home.tsx`. New files include
`src/lib/motion.ts`, `src/components/motion/*`,
`src/components/booking/BookingMotion.tsx`, and `docs/motion/*`. Run `git status`
before editing and preserve all of these changes.

## Implemented and accepted work

Phases 1–4 were implemented and individually reviewed after fix rounds:

- Shared motion tokens, a live reduced-motion/visibility store, one-time WAAPI
  entrances, reveal/stagger/route/masked-text/animated-number primitives, and
  development-only CLS/long-task diagnostics.
- Responsive home navigation with keyboard/Escape/focus behavior, a layered
  court-field hero, one-time home section choreography, bounded/pauseable ticker,
  settled deep links, and motion lifecycle cleanup.
- Booking selection markers for sport/date/court/slot/add-on/payment; compact
  completed headings; domain-derived adjacent slot connections; stable summary
  rail; animated totals; review/request route progression; preserved WhatsApp
  request wording and `Awaiting confirmation` final state.
- Hardening for live preference changes, no replay after preference/visibility
  restoration, native cursor fallback, cursor rAF/cleanup, contrast, pinch zoom,
  stable keys/routes, focus rings, and booking interaction performance.
- Booking domain code under `src/lib/booking/` was not changed.

Task evidence and the SDD ledger are under
`.superpowers/sdd/motion-plan/`. Read, in order:

1. `progress.md`
2. `task-1-report.md` through `task-4-report.md`
3. each task review/rereview
4. `final-review.md`
5. `final-diff.md`

## Verification completed on the current source

The current source passed:

- `pnpm run typecheck` and `pnpm run build` (latest bundle before the final
  review: CSS `index-CIZ2U8BS.css`, JS `index-Dh9sHCyE.js`).
- Full/reduced-motion overflow checks on `/`, `/book`, review, and request states
  at 320, 375, 767, 768, 769, 1119, 1120, 1121, 1440, and 1920 px.
- Booking math for single, adjacent/merged, separate and removed slots, four-hour
  cap, add-ons, player count, advance/full payment, cricket pricing, and WhatsApp
  wording.
- Keyboard menu, Escape/focus return, deep links, slot input, rapid toggles,
  review/back/request focus, and browser back/forward.
- Runtime reduced-motion and hidden/restored lifecycle checks with no completed
  entrance replay.
- Axe checks with zero violations on home, booking, review, and request.
- Animated-number containment: 24 checks / 576 frames / no failures.
- Hero colors at 375 and 1440 in full and reduced motion: `Play. Compete.` uses
  ink and only `Connect.` uses clay.
- Final targeted replay/focus checks: all five pass.
- Latest controller 4x-CPU headless interaction sample: median 8.3 ms, p95
  16.7 ms, max 83.3 ms, one isolated 84 ms long task, exact rail geometry.
  Independent final Task 4 sample was median 8.3 ms, p95 16.6 ms, max 66.7 ms,
  one 65 ms long task. These are synthetic measurements, not real-device 60-fps
  certification.

Evidence screenshots and JSON are in
`.superpowers/sdd/motion-plan/evidence/`. The last preview used port 5182, but a
new session should rebuild and start a fresh production preview rather than rely
on old processes.

## Exact open findings — resume here

The required whole-branch GPT-5.6 Sol review ended **FAIL** and wrote
`.superpowers/sdd/motion-plan/final-review.md`. Six findings remain. The assigned
Sol implementer and reviewer both hit the usage limit before applying these
fixes, so the current source still reflects the failing review state.

1. **P1: restore slot/daypart reveals.** The performance refactor left dayparts
   as plain divs in `src/components/booking/SlotPicker.tsx`. Add a lightweight,
   once-only reveal per daypart using the existing reduced-motion-safe stagger
   primitives. Keep settled markup readable and domain logic unchanged.
2. **P1: animate row removal.** `BookingRows` is a fragment and `BookingRow` is a
   plain div. Add a transform/opacity exit for removed session/add-on rows. The
   outgoing row should leave layout and the accessibility tree immediately while
   its visual exit completes; `AnimatePresence` with pop-layout semantics plus
   `useIsPresent()`/`aria-hidden` is one candidate. Do not animate the rail.
3. **P2: restore required touch motion.** Remove the blanket coarse-pointer CSS
   rule that disables `.animated-number-digit`, completed values, and booking
   rows. Retain cheap required motion on full-motion touch layouts. Keep the
   existing memoization and off-commit geometry work, then profile again.
4. **P2: make `MaskedText` a true mask.** Keep a stationary overflow-hidden outer
   wrapper and animate a nested inner span. Currently the clip and content move
   together.
5. **P2: remove duplicate live announcements.** Make `AnimatedNumber` neutral
   rather than assigning `aria-live` to every instance. Add exactly one
   contextual `aria-live="polite"`, `aria-atomic="true"` booking-total status.
6. **P3: remove the ignored `Reveal.once` option** because there are no callers
   and the implementation is always once-only. Do not add replay behavior.

After implementation, run typecheck/build; booking math; full/reduced runtime
toggle and no-replay checks; keyboard/axe checks; targeted daypart, row-exit,
masked-text and single-live-region checks; number containment; the full width
matrix; and three clean production 4x-CPU mobile profiles. Regenerate
`task-4-diff.md` and `final-diff.md`. Then reactivate the GPT-5.6 Sol final reviewer
for a scoped rereview of all six findings plus regressions. Only after a clean
PASS should the task be reported complete.

## Scope guardrails and recorded rulings

Do not add a backend, availability service, payment processor, legal copy,
specific operating hours, new imagery, grain, facilities depth treatment, or
cursor-tracked spotlight borders.

The SDD ledger contains four rulings that must be preserved in the final report:

- Use existing React/Framer Motion and the brand with authored court geometry,
  rather than a second scroll engine or generated assets.
- Keep worktree changes uncommitted until the user authorizes commits; reviews use
  working-tree snapshot diffs.
- Treat design approval and 60 fps as evidence to present, never as approval or
  real-device certification that did not occur.
- FFmpeg preflight failure does not block this no-video implementation; bundled
  Playwright is the browser verification path.
