import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS, readJson, writeJson } from "../lib/storage";

type Tema = "light" | "dark";

interface ThemeContextValue {
  tema: Tema;
  alternarTema: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(() => readJson<Tema>(STORAGE_KEYS.theme, "light"));

  useEffect(() => {
    document.body.classList.toggle("theme-dark", tema === "dark");
    writeJson(STORAGE_KEYS.theme, tema);
  }, [tema]);

  const alternarTema = useCallback(() => {
    setTema((atual) => (atual === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(() => ({ tema, alternarTema }), [tema, alternarTema]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme precisa estar dentro de <ThemeProvider>");
  return ctx;
}
