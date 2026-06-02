import { motion, useReducedMotion } from "motion/react";
import { containerStagger } from "../lib/motion";
import { ProductCard } from "./ProductCard";
import type { Product } from "../data/products";

interface Props {
  produtos: Product[];
  compacto?: boolean;
}

export function ProductGrid({ produtos, compacto = false }: Props) {
  const reduzir = useReducedMotion();

  const cards = produtos.map((p) => <ProductCard key={p.id} produto={p} compacto={compacto} />);

  if (reduzir) {
    return <div className="product-grid">{cards}</div>;
  }

  return (
    <motion.div
      className="product-grid"
      variants={containerStagger}
      initial="hidden"
      animate="show"
    >
      {cards}
    </motion.div>
  );
}
