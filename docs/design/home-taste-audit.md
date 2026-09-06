# Home page design audit — implemented

Session date: 2026-09-06. Audit of `src/pages/home.tsx` + `src/index.css` using the
`design-taste-frontend` skill as a lens, with the findings implemented rather than
just reported. Companion to `docs/motion/motion-plan.md`, whose constraints were
treated as binding throughout.

## Defects fixed

| Finding | Where |
|---|---|
| "Scan for directions" QR was `Math.random()` — a different meaningless grid every render, under a label promising it worked | `home.tsx` visit panel |
| `gravik-board.png` was 2.0 MB for a texture drawn at 40% opacity behind a scrim → 118 KB webp, 94% saving | `public/brand/` |
| `.map-overlay` used pure `rgba(0,0,0,.7)`, the mistake `memory.md` #7 already removed from the footer | `index.css` |
| Google Fonts `@import` inside the CSS, so the font request waited on the CSS download | `index.css` → `index.html` |
| `.home-header` carried `.shell`, capping its background at 1280px — past that width the page scrolled through the header's edges | `index.css` |
| `.benefit-icon` set 48px in CSS while JSX passed `size={40}`; the prop was dead | both |
| Footer logo `filter: brightness(2)` clipped the mark's internal detail | `home.tsx` |
| `alt="Map Background"` described the file's role, on decorative texture | `home.tsx` |
| Dead `scale(1.02)` on `.ticker`, overridden away for the only page that renders it | `index.css` |
| `--dim` documented as `#6E6659` but coded `#A09583` | `context.md` |

On `--dim`: the code value was kept and the doc corrected. `#6E6659` scores 3.30:1
on `--bg` and fails AA for body text; `#A09583` scores 6.34:1 and passes.

## Nav

Was sticky, flat and identical at the top of the page and two thousand pixels down it.

- **Condensed glass on scroll.** An `IntersectionObserver` sentinel (no scroll
  listener) flips the header to a tinted frosted pane once it detaches: the Clay &
  Bone ground at 72%, a **bone-tinted 1px inner edge** standing in for the refraction
  at the lip of real glass, and a clay baseline. Behind `@supports`, falling back to
  the opaque bar. Corners stay sharp, the resting state is unchanged — a scroll
  state, not a change of material.
- **Active-section rail.** A second observer marks whichever section crosses the
  middle of the viewport. One rail slides between links on a single transform rather
  than four borders cross-fading; ties resolve in document order so it cannot
  flicker. `aria-current` rides along and survives reduced motion.
- **Mobile menu arrives.** `display:none → flex` cannot transition, so the open state
  animates on arrival with items staggered 45ms apart.
- **One button physics.** `.button` moved 3px into a shadow that only appeared on
  hover; `.button.clay` never moved and shrank its shadow instead. Side by side in
  the hero they read as two different design systems. Both now travel toward their
  own resting shadow while it contracts by the same amount, expressed as custom
  properties. Adds the `:active` press the whole site lacked.
- Dropped the 4px radius on `.icon-button` — the one soft corner in a deliberately
  sharp system, already being re-zeroed locally.
- `scroll-margin-top` equalled the nav height exactly, so deep-linked headings landed
  flush against it. Now `--nav-h + 24px`.

## Sections

- **Facilities**: ten identically-boxed cards in a 5x2 grid with hover switched off —
  the flattest surface on the page. Boxes replaced with shared hairline rules. The
  motion plan's *"calm grouping, NO background depth"* is a constraint on material,
  not structure; no depth and no hover motion were added.
- **Sport cards**: hover was a 2px border colour change on a 400px-tall image, on the
  primary conversion surface. Now lifts into a hard shadow with a 4% image scale.
- **Price block**: aligned on box bottoms, so the 64px offer price sat visibly below
  the struck list price. Now `last baseline` with `line-height: 1`.
- **Anton tracking**: `+.005em` reads loose on a condensed face at 60–140px. Display
  sizes take `-.012em`; the small uppercase labels sharing `.display` are untouched.
- **Rhythm**: `.section` 120 / `#facilities` 88 / `.visit-text` 100 were three
  unrelated scales; collapsed to two tokens.
- Ticker pauses on hover/focus. Partner names are links. Copyright year derived.
- All 13 inline `style={{}}` objects in `home.tsx` migrated to semantic classes, per
  the repo's own convention. The one that remains is the dynamic stagger index.

## Considered and rejected

`design-taste-frontend` is stack-opinionated in ways that contradict this repo's
deliberately chosen system. Precedent: `memory.md` records the Space Grotesk finding
being correctly suppressed in `.impeccable/config.json`. **These were not actioned,
on purpose — do not re-litigate them:**

| Skill rule | Why it does not apply here |
|---|---|
| Tailwind for 90% of styling | Repo is semantic CSS + custom properties by convention |
| Phosphor / Radix icons only | Repo standardises on `lucide-react` at stroke width 2 |
| Centred heroes banned | Short brand statement over a symmetric `CourtField` scene |
| Oversized H1 banned | Brand landing page, not a dashboard |
| Custom cursors banned | `PaddleCursor` is brand-specific, gated to `pointer: fine`, off under reduced motion |
| Geist / Satoshi font stack | Anton + Space Grotesk + Manrope trace to the approved Claude Design artboard |

Also **not changed**: `body::before`'s fixed grid, so content slides over a static
texture rather than the texture belonging to the page. It is a real observation, but
it sits adjacent to the declined "background depth" constraint and is a whole-site
call rather than a home-page one.

## Corrected mid-audit

Two findings did not survive verification and were dropped rather than softened:

1. **Image CLS.** Claimed every `<img>` lacked intrinsic dimensions and shifted
   layout. Every image already has a CSS-fixed height, so there was no shift. The
   `loading`/`decoding`/`fetchPriority` hints that shipped are about network
   priority, not layout stability.
2. **Price baseline measurement.** The first probe reported a 2.8px delta, but it was
   measuring line-box bottoms rather than text baselines and was not trustworthy. The
   misalignment is real — it was confirmed by screenshot instead.

## Verification performed

- `pnpm run typecheck` clean, `pnpm run build` succeeds.
- No horizontal overflow at 320 / 375 / 767 / 768 / 769 / 1119 / 1120 / 1121 / 1440 /
  1920, scrolled to the document bottom.
- Booking flow driven for real: two adjacent pickleball slots total ₹1,500 with ₹500
  saved, and the handoff opens `wa.me/919150293767` with the request wording intact.
- The QR was decoded with an independent decoder and resolves to the venue Maps URL.
  No QR library ships — the generator was installed, used once, and removed.
- Reduced motion: ticker and rail static, `aria-current` still applied, content
  readable. Escape closes the menu and returns focus to the toggle; the collapsed
  menu is `inert`; the focus ring stays visible over the glass.
