import { EventEmitter } from "node:events";
import { RoundStatus, SubmissionResult } from "./enums.js";
import { generateProblem } from "./problemGenerator.js";
import { GameSnapshot, LeaderboardEntry, Problem, SubmitResponse } from "./types.js";

const NEXT_ROUND_DELAY_MS = 3000;

const createRoundId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const toPublicRound = (round: Problem): Omit<Problem, "answer"> => ({
  id: round.id,
  text: round.text,
  startedAt: round.startedAt,
  status: round.status,
  winner: round.winner,
  solvedAt: round.solvedAt,
});

export class GameEngine extends EventEmitter {
  private currentRound: Problem;
  private readonly wins = new Map<string, number>();

  constructor() {
    super();
    this.currentRound = this.createRound();
  }

  public snapshot(): GameSnapshot {
    return {
      round: toPublicRound(this.currentRound),
      leaderboard: this.leaderboard(),
    };
  }

  public submit(username: string, answer: string, roundId: string): SubmitResponse {
    const cleanName = username.trim();
    const cleanAnswer = answer.trim();

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

  private queueNextRound(): void {
    setTimeout(() => {
      this.currentRound = this.createRound();
      this.emit("roundStarted", this.snapshot());
    }, NEXT_ROUND_DELAY_MS);
  }

  private leaderboard(): LeaderboardEntry[] {
    return [...this.wins.entries()]
      .map(([username, wins]) => ({ username, wins }))
      .sort((a, b) => b.wins - a.wins || a.username.localeCompare(b.username))
      .slice(0, 10);
  }

  private createRound(): Problem {
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
