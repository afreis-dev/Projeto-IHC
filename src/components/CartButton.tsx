import { motion, useReducedMotion } from "motion/react";
import { useCart } from "../context/CartContext";
import type { Product } from "../data/products";

interface Props {
  produto: Product;
  className?: string;
}

export function CartButton({ produto, className = "produto-acao" }: Props) {
  const { adicionar, quantidadeDe } = useCart();
  const reduzir = useReducedMotion();
  const qtd = quantidadeDe(produto.id);

  return (
    <motion.button
      type="button"
      className={`${className}${qtd > 0 ? " is-in-cart" : ""}`}
      aria-pressed={qtd > 0}
      whileTap={reduzir ? undefined : { scale: 0.96 }}
      onClick={() => adicionar(produto)}
    >
      {qtd > 0 ? `No carrinho (${qtd})` : "Adicionar ao carrinho"}
    </motion.button>
  );
}
