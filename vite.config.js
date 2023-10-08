import { defineConfig } from "vite";

export default defineConfig({
  base: globalThis.process?.env.VITE_BASE ?? "/",
  build: {
    chunkSizeWarningLimit: 3500,
  }
});
