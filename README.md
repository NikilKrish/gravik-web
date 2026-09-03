# GRAVIK — Pickleball & Cricket Nets, Chennai

Marketing site and court-booking flow for GRAVIK, opening 6 Sept 2026 in Ambattur, Chennai.

Vite + React 19 + TypeScript. No backend — the booking flow ends with a pre-filled
WhatsApp request; a person at GRAVIK confirms.

## Run locally

```bash
pnpm install
pnpm dev
```

Opens at `http://localhost:5173`. Set `PORT`/`BASE_PATH` env vars to override.

## Build

```bash
pnpm build   # outputs to dist/
pnpm serve   # preview the production build
```

## Routes

- `/` — home page
- `/book`, `/book?sport=pickleball`, `/book?sport=cricket` — booking flow
