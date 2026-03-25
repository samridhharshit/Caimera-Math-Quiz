import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/state": "http://localhost:3001",
      "/stream": "http://localhost:3001",
      "/submit": "http://localhost:3001",
      "/leaderboard": "http://localhost:3001",
      "/health": "http://localhost:3001",
    },
  },
});

