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

## Deploy

Hosted on Vercel. The project is linked to this repository, so **every push to
`main` ships to production automatically** — there is no manual deploy step.

| Setting | Value |
|---|---|
| Project | `gravik-play` (team: Yenkay's projects) |
| Production branch | `main` |
| Framework preset | Vite |
| Build command | `pnpm build` |
| Output directory | `dist` |

`vercel.json` rewrites every path to `/index.html`. This is load-bearing: the
app routes on real paths, so without it a direct visit or refresh on `/book`,
`/privacy` or `/terms` returns a 404 from the CDN. Static files are matched
before rewrites, so `/assets`, `/brand`, `/favicon.svg` and `/robots.txt` are
unaffected. Do not remove it.
