import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS, readJson, writeJson, type Favorite } from "../lib/storage";
import { normalizarTexto, type Product } from "../data/products";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

interface FavoritesContextValue {
  favoritos: Favorite[];
  alternar: (produto: Product) => boolean;
  remover: (index: number) => void;
  ehFavorito: (nome: string) => boolean;
  total: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { sessao } = useAuth();
  const { showToast } = useToast();
  const [favoritos, setFavoritos] = useState<Favorite[]>(() =>
    readJson<Favorite[]>(STORAGE_KEYS.favorites, [])
  );

  const aplicar = useCallback((novo: Favorite[]) => {
    setFavoritos(novo);
    writeJson(STORAGE_KEYS.favorites, novo);
  }, []);

  const ehFavorito = useCallback(
    (nome: string) => favoritos.some((item) => normalizarTexto(item.nome) === normalizarTexto(nome)),
    [favoritos]
  );

  const alternar = useCallback(
    (produto: Product): boolean => {
      if (!sessao) {
        showToast("Faça login para salvar itens nos favoritos.", "info");
        return false;
      }
      const idx = favoritos.findIndex(
        (item) => normalizarTexto(item.nome) === normalizarTexto(produto.title)
      );
      if (idx >= 0) {
        aplicar(favoritos.filter((_, i) => i !== idx));
        showToast(`${produto.title} foi removido dos favoritos.`, "info");
        return true;
      }
      aplicar([...favoritos, { nome: produto.title, imagem: produto.image }]);
      showToast(`${produto.title} foi salvo nos favoritos.`, "success");
      return true;
    },
    [sessao, favoritos, aplicar, showToast]
  );

  const remover = useCallback(
    (index: number) => {
      aplicar(favoritos.filter((_, i) => i !== index));
    },
    [favoritos, aplicar]
  );

  const value = useMemo(
    () => ({ favoritos, alternar, remover, ehFavorito, total: favoritos.length }),
    [favoritos, alternar, remover, ehFavorito]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites precisa estar dentro de <FavoritesProvider>");
  return ctx;
}
