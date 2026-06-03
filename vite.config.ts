import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Em produção o site é publicado em https://cc-2025-2-cesar.github.io/RELIC/,
// então no build o base recebe o nome do repositório (/RELIC/). Em dev fica em "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/RELIC/" : "/",
  plugins: [react()],
}));
