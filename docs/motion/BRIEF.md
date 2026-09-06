# Home motion brief

Source: user-supplied five-phase motion plan, Task 2 brief, `context.md` and `memory.md`. Authored implementation decisions within that approved scope, not a new interview. Scroll-craft's `references/feel.md` and `references/taste.md` inform pacing and differential layer movement; the existing React/Framer Motion stack and brand remain authoritative.

## Direction

- Subject / audience: GRAVIK's existing Chennai pickleball and cricket-practice landing page; players choosing a sport and making a booking request.
- Vibe: existing Clay & Bone, sharp court markings, Anton display type and delivered brand photography.
- Sequence: hero, sports, facilities, visit, contact. Existing navigation and copy stay intact.
- Energy: one dimensional hero peak, a short sports pulse, then a calm practical finish.
- Signature: a regulation-proportioned pickleball court resolves into separated planes behind the steady headline, then shifts with the visitor's scroll.
- Aesthetic range: the established neo-brutalist brand, not a visual redesign.
- Grammar: distinct editorial sections in ordinary document flow; no pinning, artificial scroll span or full-page film.
- Assets: existing brand assets only; court geometry is decorative SVG, with no new imagery, grain, spotlight or facilities depth.

## Feeling curve (before implementation)

1. Anticipation → energy: quiet navigation gives way to a court surface resolving behind the headline.
2. Intent: the two sports arrive with a quick, once-only stagger; prices and booking actions stay readable.
3. Reassurance: facilities settle as one calm group, without competing background movement.
4. Arrival: the address and directions settle with a small upward move beside the existing location panel.
5. Resolve: contact and footer hold still, remaining a dependable end state.

Peak / tell-someone sentence: “It's the site where the court opens out beneath the words as you arrive, then moves with you into the games.” The hero is the only layered scene and receives the largest motion range. It uses the existing compact hero footprint; no filler is added to satisfy a cinematic length quota.

Authored silence: navigation, semantic headline, controls and footer remain steady. There are no empty scroll screens.

## Layer contract and score

| Beat | Treatment | Limit / reason |
| --- | --- | --- |
| Hero | Ground, court markings, raised net plane; once-only entrance plus differential scroll displacement | Decorative, aria-hidden, pointer-events none; text and controls above a local contrast scrim |
| Sports | Long-distance reveal and tight card stagger | One entrance; direct navigation or focus settles the whole destination immediately |
| Facilities | Short-distance grouped reveal | Calm, no depth, no individual trailing card delays |
| Visit | Short-distance purposeful arrival | Address and useful controls stay together |
| Footer | Static held ending | No fade-out or delayed contact information |
| Ticker | One short pass, 4.4 seconds total; explicit pause/resume | Paused offscreen, in a hidden tab, on hover/focus and under reduced motion; duplicated words hidden from assistive technology |

Reduced motion renders the entire scene static and readable. Scroll work is event-driven, with at most one scheduled frame and no idle animation loop; listeners and observers clean up on unmount. The mobile disclosure uses native links, Escape, focus return, and breakpoint cleanup. Its closed links are removed from keyboard access by CSS display.

Verification evidence is recorded in `task-2-report.md` and the controller's shared browser matrix. The pre-existing decorative fake QR/location background is outside this task's scope.
