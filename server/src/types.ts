import { RoundStatus, SubmissionResult } from "./enums.js";

export interface Problem {
  id: string;
  text: string;
  answer: string;
  status: RoundStatus;
  startedAt: string;
  winner?: string;
  solvedAt?: string;
}

export interface LeaderboardEntry {
  username: string;
  wins: number;
}

export interface GameSnapshot {
  round: Omit<Problem, "answer">;
  leaderboard: LeaderboardEntry[];
}

export interface SubmitRequestBody {
  username?: string;
  answer?: string;
  roundId?: string;
}

export interface SubmitResponse {
  result: SubmissionResult;
  round: Omit<Problem, "answer">;
}
