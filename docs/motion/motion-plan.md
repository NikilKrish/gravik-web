# GRAVIK motion plan
Source: user-provided five-phase motion plan, 2026-09-05. Existing brand and content are the design authority.

## Global Constraints
- No backend, availability service, payment processor, new legal copy, specific operating hours, new stock imagery, grain, facilities depth, or cursor spotlight borders.
- All controls remain editable; motion never delays state updates or keyboard input.
- Booking calculations, formatting, session merging and WhatsApp wording remain in src/lib/booking. Final state awaits confirmation.
- Only transform/opacity for interaction animations; no layout-property animation. Reduced motion renders static, readable content. Tab-hidden and offscreen loops stop.
- Preserve existing copy and semantic CSS/brand typography. No new test framework. No commits or pushes without user approval.

## Task 1: Motion foundations
Create src/lib/motion.ts shared duration/easing/spring/distance/stagger tokens, reduced-motion and visibility helpers. Create reusable reveal, stagger, route transition, masked text reveal and animated-number components in src/components/motion. Use installed Framer Motion. Default markup readable, avoid opacity-zero content waiting on delayed JS or hidden-tab frames. Numbers show actual new values immediately, animate digit change without intermediate false totals or shifting alignment. Dev-only bounded PerformanceObserver diagnostics for unexpected layout shift and long tasks, cleanup observers. Add motion CSS variables and global reduced-motion fallbacks before effects; wire foundations into App where needed without changing routes or interactions. No court-field implementation yet. Verify typecheck/build.

## Task 2: Hero, navigation and home choreography
Use Task 1 primitives. Build layered decorative court-field hero with existing Clay & Bone brand; meaningful court geometry and restrained independent planes behind stable semantic headline and controls. No new imagery or marketing copy. Responsive 375,768,1120,1440 hero and navigation. Accessible menu with expanded/controls labels, Escape, focus, breakpoint cleanup and no hidden focusable links. Sports energetic once-only reveal, facilities calm grouping (NO background depth), visit purposeful arrival, footer stable resolution. Deep links/focus settle readable content. No long-running offscreen/hidden loops, ticker pause/reduced behavior. Retain current brand assets. Create concise docs/motion/BRIEF.md with source-backed design choices, feeling curve, peak, layer contract and score. Verify browser pixels and responsive layout (controller can run matrix).

## Task 3: Booking motion
Animate completed sections into compact locked-in visual treatment without hiding/editing controls or animating layout properties. Moving clay selection indicator for sport,date,court,slot,add-on,payment. Immediate selections/keyboard. Slots reveal by daypart; connected adjacent selected hours consume existing merged sessions, never duplicate domain merging. Summary rail stays spatially stable: row enter/exit and digit changes, not rail motion. Step routes review/request-sent use focused forward progression and focus handling; final wording still request awaiting confirmation. Drive real selections and verify math (controller browser matrix supplements). Modify pages/booking.tsx and components/booking; shared motion/css only as needed. Do not change domain functions.

## Task 4: Hardening
Production typecheck/build; matrix 320,375,767,768,769,1119,1120,1121,1440,1920 with scrollWidth===clientWidth. Full and reduced motion, keyboard, touch, rapid selections, single/adjacent/removal/add-ons/both payment modes/player counts/WhatsApp wording. Initial/back/forward/hidden/restored lifecycle. CPU-throttled headless measurements and screenshots desktop/mobile; report limits honestly, no unmeasured 60fps claims. Fix real findings. No new test framework.
