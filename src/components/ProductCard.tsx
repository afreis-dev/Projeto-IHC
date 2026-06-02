import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { formatarPreco, obterBadge, obterEstoque, type Product } from "../data/products";
import { itemRise } from "../lib/motion";
import { CartButton } from "./CartButton";
import { FavoriteButton } from "./FavoriteButton";

interface Props {
  produto: Product;
  /** Quando true, esconde a lista de metadados (uso em destaques da home). */
  compacto?: boolean;
}

export function ProductCard({ produto, compacto = false }: Props) {
  const reduzir = useReducedMotion();
  const estoque = obterEstoque(produto);

  return (
    <motion.article
      className="produto-card produto-card--showcase"
      variants={reduzir ? undefined : itemRise}
      whileHover={reduzir ? undefined : { y: -6 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/produto/${produto.id}`}
        className="produto-imagem produto-imagem--link"
        aria-label={`Ver ${produto.title}`}
      >
        <img src={produto.image} alt={produto.title} loading="lazy" />
      </Link>

      <div className="produto-info">
        <div className="produto-badges">
          <span className="produto-badge">{obterBadge(produto)}</span>
          {estoque === 1 && <span className="produto-badge status-ultimo">Última unidade</span>}
        </div>

        <h3>
          <Link to={`/produto/${produto.id}`} className="produto-titulo--link">
            {produto.title}
          </Link>
        </h3>
        <p className="produto-resumo-curto">{produto.summary}</p>

        {!compacto && (
          <ul className="produto-meta">
            <li>
              <strong>Estado:</strong> {produto.condition}
            </li>
            <li>
              <strong>Autenticidade:</strong> {produto.authenticity}
            </li>
            <li>
              <strong>Disponibilidade:</strong> {produto.availability}
            </li>
          </ul>
        )}

        <span className="produto-preco">{formatarPreco(produto.price)}</span>

        <div className="produto-card-acoes">
          <CartButton produto={produto} />
          <FavoriteButton produto={produto} />
        </div>

        <Link to={`/produto/${produto.id}`} className="button-secondary produto-detalhe-link">
          Ver detalhes
        </Link>
      </div>
    </motion.article>
  );
}
