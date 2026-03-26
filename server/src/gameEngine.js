import { EventEmitter } from "node:events";
import { RoundStatus, SubmissionResult } from "./enums.js";
import { generateProblem } from "./problemGenerator.js";

const NEXT_ROUND_DELAY_MS = 3000;

const createRoundId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toPublicRound = (round) => ({
  id: round.id,
  text: round.text,
  startedAt: round.startedAt,
  status: round.status,
  winner: round.winner,
  solvedAt: round.solvedAt,
});

export class GameEngine extends EventEmitter {
  constructor() {
    super();
    this.currentRound = this.createRound();
    this.wins = new Map();
  }

  snapshot() {
    return {
      round: toPublicRound(this.currentRound),
      leaderboard: this.leaderboard(),
    };
  }

  submit(username, answer, roundId) {
    const cleanName = username.trim();
    const cleanAnswer = (answer ?? "").trim();

    if (!cleanAnswer) {
      return { result: SubmissionResult.EMPTY_ANSWER, round: toPublicRound(this.currentRound) };
    }

    if (roundId !== this.currentRound.id) {
      return { result: SubmissionResult.INVALID_ROUND, round: toPublicRound(this.currentRound) };
    }

    if (this.currentRound.status === RoundStatus.SOLVED) {
      const result =
        cleanAnswer === this.currentRound.answer
          ? SubmissionResult.CORRECT_BUT_LATE
          : SubmissionResult.INVALID_ROUND;
      return { result, round: toPublicRound(this.currentRound) };
    }

    if (cleanAnswer !== this.currentRound.answer) {
      return { result: SubmissionResult.WRONG, round: toPublicRound(this.currentRound) };
    }

    this.currentRound = {
      ...this.currentRound,
      status: RoundStatus.SOLVED,
      winner: cleanName,
      solvedAt: new Date().toISOString(),
    };

    this.wins.set(cleanName, (this.wins.get(cleanName) ?? 0) + 1);
    this.emit("roundSolved", this.snapshot());
    this.queueNextRound();

    return { result: SubmissionResult.WON, round: toPublicRound(this.currentRound) };
  }

  queueNextRound() {
    setTimeout(() => {
      this.currentRound = this.createRound();
      this.emit("roundStarted", this.snapshot());
    }, NEXT_ROUND_DELAY_MS);
  }

  leaderboard() {
    return [...this.wins.entries()]
      .map(([username, wins]) => ({ username, wins }))
      .sort((a, b) => b.wins - a.wins || a.username.localeCompare(b.username))
      .slice(0, 10);
  }

  createRound() {
    const draft = generateProblem();
    return {
      id: createRoundId(),
      text: draft.text,
      answer: draft.answer,
      startedAt: new Date().toISOString(),
      status: RoundStatus.OPEN,
    };
  }
}

