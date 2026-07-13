import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

import { nitro } from 'nitro/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart(),
    nitro({ preset: 'vercel' }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    tsconfigPaths: true,
  },
  server: {
    port: 8080,
    host: "::",
  },
});
