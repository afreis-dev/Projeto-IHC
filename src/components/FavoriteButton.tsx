import { motion, useReducedMotion } from "motion/react";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../data/products";

interface Props {
  produto: Product;
  className?: string;
}

export function FavoriteButton({ produto, className = "produto-acao secundario" }: Props) {
  const { alternar, ehFavorito } = useFavorites();
  const { sessao } = useAuth();
  const reduzir = useReducedMotion();
  const favorito = ehFavorito(produto.title);

  const rotulo = !sessao ? "Entrar para salvar" : favorito ? "❤ Salvo" : "♡ Favoritar";

  return (
    <motion.button
      type="button"
      className={`${className}${favorito ? " is-favorited" : ""}`}
      aria-pressed={favorito}
      whileTap={reduzir ? undefined : { scale: 0.96 }}
      onClick={() => alternar(produto)}
    >
      {rotulo}
    </motion.button>
  );
}
