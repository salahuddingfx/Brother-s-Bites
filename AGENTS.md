# Brother's Bites — Agent Guide

Two independent apps, each with its own `node_modules` and `package.json`. They are not a monorepo — no shared tooling, no workspace config.

## Structure

- `client/` — Next.js 16 + React 19 + TypeScript + Tailwind. Serves public site and admin dashboard.
- `server/` — Express.js + TypeScript + Mongoose. REST API at `/api/v1`.

## Commands

### Client (`client/`)
```bash
npm run dev      # Next.js dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint (flat config, eslint-config-next)
```

### Server (`server/`)
```bash
npm run dev      # tsx watch src/app.ts (port 5000)
npm run build    # tsc → dist/
npm run start    # node dist/app.js
npm run seed     # Seeds DB with admin + sample data (admin@brothersbites.com / admin123)
```

## Env Vars

Server needs `.env` (see `.env.example`). Client needs `.env.local` with `NEXT_PUBLIC_API_URL`.

## Key Facts

- API base path: `/api/v1` (server) and `/api` (rate-limited, 100 req/15min).
- Client uses `@/*` path alias → `src/*`.
- Images: Cloudinary (`res.cloudinary.com`) and Unsplash are whitelisted in `next.config.ts`.
- Server entrypoint: `src/app.ts`. Routes mounted in `src/routes/index.ts`.
- Auth: JWT via cookies. CORS origin set to `CLIENT_URL`.
- DB: MongoDB Atlas (Mongoose). Connection in `src/config/db.ts`.

## Conventions

- No root-level lockfile or workspace config — install deps separately in `client/` and `server/`.
- Server uses `tsx` for dev (no nodemon). Builds with plain `tsc`.
- Client ESLint flat config at `client/eslint.config.mjs`.
- `client/AGENTS.md` is auto-managed by `next dev` — do not manually edit.
