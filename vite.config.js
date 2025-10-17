import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Enables network access
    port: 5173,
    strictPort: false,
    open: true, // Auto-opens browser on start
  },
});
