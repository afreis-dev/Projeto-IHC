import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Em produção o site é publicado em https://<usuario>.github.io/Projeto-IHC/
// então o base só recebe o nome do repositório no build. Em dev fica em "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Projeto-IHC/" : "/",
  plugins: [react()],
}));
