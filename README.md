# Competitive Math Quiz

Minimal fullstack implementation for a real-time competitive quiz:

- All users see the same active question.
- First correct answer wins.
- Next question starts automatically after a short delay.
- Leaderboard tracks high scores.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Realtime updates: SSE (`/stream`)

## Run Locally
Install dependencies (installs both frontend + backend):

```bash
npm install
```

Build and start the monolithic app (backend serves the built frontend):

```bash
npm start
```

Open:
`http://localhost:3001`

Optional (for hot reload): run backend dev server + frontend dev server (Vite proxies API routes):

Terminal 1:
```bash
npm --prefix server run dev
```

Terminal 2:
```bash
npm --prefix frontend run dev
```

## Build

```bash
npm run build
```
This command builds both `frontend` and `server`.

## API

- `GET /state` current round + leaderboard
- `GET /stream` SSE live updates
- `POST /submit` submit answer
- `GET /leaderboard` top winners

## Notes / Tradeoffs

- Winner concurrency is handled in-process for this single-instance MVP.
- For production multi-instance deployment, move round state to Postgres/Redis with atomic update/lock for first-winner correctness.
- Question generation is template-based and intentionally simple.

## Deploy (Render) - Single Monolithic App

This repo is deployable as one Render service. The backend serves the built frontend from `frontend/dist`.

1. Create a Render **Web Service** from this repo.
2. Root directory: `/` (repo root)
3. Build command: `npm run build`
4. Start command: `npm start`

After deploy, open the Render URL and test multiple tabs to confirm first-winner behavior.
