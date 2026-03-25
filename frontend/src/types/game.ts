export const RoundStatus = {
  OPEN: "OPEN",
  SOLVED: "SOLVED",
} as const;

export const SubmissionResult = {
  WON: "WON",
  CORRECT_BUT_LATE: "CORRECT_BUT_LATE",
  WRONG: "WRONG",
  INVALID_ROUND: "INVALID_ROUND",
  EMPTY_ANSWER: "EMPTY_ANSWER",
} as const;

export type RoundStatus = (typeof RoundStatus)[keyof typeof RoundStatus];
export type SubmissionResult =
  (typeof SubmissionResult)[keyof typeof SubmissionResult];

export interface Round {
  id: string;
  text: string;
  startedAt: string;
  status: RoundStatus;
  winner?: string;
  solvedAt?: string;
}

export interface LeaderboardEntry {
  username: string;
  wins: number;
}

export interface GameSnapshot {
  round: Round;
  leaderboard: LeaderboardEntry[];
}

export interface SubmitPayload {
  username: string;
  answer: string;
  roundId: string;
}

