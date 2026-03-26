import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import { GameEngine } from "./gameEngine.js";

const PORT = Number(process.env.PORT ?? 3001);
const app = express();
const game = new GameEngine();
const clients = new Set();

app.use(cors({ origin: true }));
app.use(express.json());

// Whenever game state changes, this function broadcasts the latest state to all connected users and cleans up dead connections.
const broadcastSnapshot = () => { 
  const payload = `data: ${JSON.stringify(game.snapshot())}\n\n`; // create the payload that contains the current question and the leaderboard to send to the clients
  for (const client of clients) { // send the payload to all the clients
    try {
      client.write(payload); // send the payload to the client
    } catch {
      clients.delete(client); // if the client is not alive, remove it from the set
    }
  }
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
  res.flushHeaders(); // send the headers to the user

  clients.add(res); // register the user as a live listener
  res.write(`data: ${JSON.stringify(game.snapshot())}\n\n`); // send the latest question and the leaderboard

  const interval = setInterval(() => {
    res.write(`: ping\n\n`); // keep the connection alive
  }, 25000);

  req.on("close", () => { // when the user closes the connection
    clearInterval(interval);
    clients.delete(res); // unregister the user
  });
});

app.post("/submit", (req, res) => {
  const username = (req.body?.username ?? "").trim();
  const answer = req.body?.answer ?? "";
  const roundId = req.body?.roundId ?? "";

  if (!username) {
    res.status(400).json({ message: "username is required" });
    return;
  }

  const result = game.submit(username, answer, roundId);
  res.json(result);
});

const currentFilePath = fileURLToPath(import.meta.url); // get the path to the current file
const repoRoot = path.resolve(path.dirname(currentFilePath), "..", ".."); // get the root of the repository
const frontendDist = path.join(repoRoot, "frontend", "dist"); // get the path to the frontend dist directory

if (fs.existsSync(frontendDist)) { // if the frontend dist directory exists
  app.use(express.static(frontendDist)); // serve the frontend dist directory
  app.use((_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.listen(PORT);

