# Competitive Math Quiz

Minimal fullstack implementation for a real-time competitive quiz:

- All users see the same active question.
- First correct answer wins.
- Next question starts automatically after a short delay.
- Leaderboard tracks high scores.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Realtime updates: SSE (`/stream`)

## Run Locally

Install dependencies:

```bash
npm install
```

Run backend:

```bash
npm --prefix server run dev
```

Run frontend (separate terminal):

```bash
npm --prefix frontend run dev
```

Frontend defaults to backend URL `http://localhost:3001`.
You can override with `VITE_API_URL`.

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

## Deploy (Cloudflare Pages + Railway)

Deploy the backend first and note its public URL.

### Backend (Railway)
1. Create a new Railway project from this repository.
2. Set the root directory to `server`.
3. Use:
   - Build command: `npm run build`
   - Start command: `npm start`
4. Railway will set `PORT` automatically.

### Frontend (Cloudflare Pages)
1. Create a Cloudflare Pages project connected to the repo.
2. Set Root Directory to `frontend`.
3. Build command: `npm install && npm run build`
4. Output directory: `dist`
5. Set `VITE_API_URL` to your Railway backend URL (example: `https://your-backend.up.railway.app`)

After deploy, open the Cloudflare frontend URL and test multiple browser tabs.
