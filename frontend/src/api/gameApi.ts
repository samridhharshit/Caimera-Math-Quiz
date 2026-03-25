import type { GameSnapshot, SubmitPayload } from "../types/game";

export const gameApi = {
  stateUrl: "/state",
  streamUrl: "/stream",
  async getState(): Promise<GameSnapshot> {
    const response = await fetch(`/state`);
    if (!response.ok) {
      throw new Error("Failed to fetch state");
    }
    return response.json();
  },
  async submit(payload: SubmitPayload): Promise<{ result: string }> {
    const response = await fetch(`/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Failed to submit answer");
    }
    return response.json();
  },
};

