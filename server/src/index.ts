import cors from "cors";
import express, { Request, Response } from "express";
import { GameEngine } from "./gameEngine.js";
import { SubmitRequestBody } from "./types.js";

const PORT = Number(process.env.PORT ?? 3001);
const app = express();
const game = new GameEngine();
const clients = new Set<Response>();

app.use(cors({ origin: true }));
app.use(express.json());

const broadcastSnapshot = (): void => {
  const payload = `data: ${JSON.stringify(game.snapshot())}\n\n`;
  clients.forEach((client) => {
    try {
      client.write(payload);
    } catch {
      clients.delete(client);
    }
  });
};

game.on("roundStarted", broadcastSnapshot);
game.on("roundSolved", broadcastSnapshot);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/state", (_req, res) => {
  res.json(game.snapshot());
});

app.get("/leaderboard", (_req, res) => {
  res.json(game.snapshot().leaderboard);
});

app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  clients.add(res);
  res.write(`data: ${JSON.stringify(game.snapshot())}\n\n`);

  const interval = setInterval(() => {
    // SSE comment keeps the connection alive through some proxies.
    res.write(`: ping\n\n`);
  }, 25000);

  req.on("close", () => {
    clearInterval(interval);
    clients.delete(res);
  });
});

app.post(
  "/submit",
  (req: Request<Record<string, never>, unknown, SubmitRequestBody>, res) => {
    const username = req.body.username?.trim();
    const answer = req.body.answer ?? "";
    const roundId = req.body.roundId ?? "";

    if (!username) {
      res.status(400).json({ message: "username is required" });
      return;
    }

    const result = game.submit(username, answer, roundId);
    res.json(result);
  },
);

app.listen(PORT);
