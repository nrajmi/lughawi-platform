// vite.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart(),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
    tsconfigPaths: true
  },
  server: {
    port: 8080,
    host: "::"
  }
});
export {
  vite_config_default as default
};
