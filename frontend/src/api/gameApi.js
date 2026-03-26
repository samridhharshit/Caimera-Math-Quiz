const API_BASE = "";
export const gameApi = {
  stateUrl: `${API_BASE}/state`,
  streamUrl: `${API_BASE}/stream`,
  async getState() {
    const response = await fetch(`${API_BASE}/state`);
    if (!response.ok) {
      throw new Error("Failed to fetch state");
    }
    return response.json();
  },
  async submit(payload) {
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

