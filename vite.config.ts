// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { build } from "esbuild";

// Load environment variables from .env files
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      "process.env": {
        ...env,
      },
    },
  };
});
