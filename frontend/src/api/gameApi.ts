import type { GameSnapshot, SubmitPayload } from "../types/game";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export const gameApi = {
  stateUrl: `${API_BASE}/state`,
  streamUrl: `${API_BASE}/stream`,
  async getState(): Promise<GameSnapshot> {
    const response = await fetch(`${API_BASE}/state`);
    if (!response.ok) {
      throw new Error("Failed to fetch state");
    }
    return response.json();
  },
  async submit(payload: SubmitPayload): Promise<{ result: string }> {
    const response = await fetch(`${API_BASE}/submit`, {
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

