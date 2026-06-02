import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import {
  buscarProdutoPorId,
  obterRelacionados,
  formatarPreco,
  CATEGORIA_LABEL,
} from "../data/products";
import { useCart } from "../context/CartContext";
import { CartButton } from "../components/CartButton";
import { FavoriteButton } from "../components/FavoriteButton";
import { EmptyState } from "../components/EmptyState";

export default function Produto() {
  const { id } = useParams<{ id: string }>();
  const produto = buscarProdutoPorId(id);
  const navigate = useNavigate();
  const { adicionar } = useCart();
  const reduzir = useReducedMotion();

  useDocumentTitle(produto ? `${produto.title} | RELIC` : "Produto | RELIC");

  if (!produto) {
    return (
      <EmptyState
        titulo="Produto não encontrado"
        descricao="Volte para o catálogo e selecione outro item."
        acao={
          <Link to="/" className="button-primary">
            Voltar ao início
          </Link>
        }
      />
    );
  }

  const relacionados = obterRelacionados(produto);

  function comprarAgora() {
    if (produto && adicionar(produto)) {
      navigate("/carrinho");
    }
  }

  return (
    <>
      <nav className="breadcrumb" aria-label="Você está em">
        <Link to="/">Início</Link> /{" "}
        <Link to={`/categoria/${produto.category}`}>{CATEGORIA_LABEL[produto.category]}</Link> /{" "}
        <span aria-current="page">{produto.title}</span>
      </nav>

      <section className="produto-detalhe-layout">
        <motion.article
          className="produto-detalhe-main"
          initial={reduzir ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="produto-detalhe-galeria">
            <div className="produto-detalhe-imagem">
              <img src={produto.image} alt={produto.title} />
            </div>
          </div>

          <div className="produto-detalhe-conteudo">
            <span className="tag">{CATEGORIA_LABEL[produto.category]}</span>
            <h1>{produto.title}</h1>
            <p className="produto-detalhe-criador">
              <strong>{produto.creatorLabel}:</strong> {produto.creator}
            </p>
            <p className="produto-detalhe-resumo">{produto.summary}</p>

            <div className="produto-detalhe-info">
              <div className="detalhe-chip">
                <strong>Estado:</strong> {produto.condition}
              </div>
              <div className="detalhe-chip">
                <strong>Autenticidade:</strong> {produto.authenticity}
              </div>
              <div className="detalhe-chip">
                <strong>Disponibilidade:</strong> {produto.availability}
              </div>
            </div>

            <section className="produto-detalhe-texto">
              <h2>Sobre o item</h2>
              <p>{produto.details}</p>
            </section>
          </div>
        </motion.article>

        <aside className="produto-detalhe-compra">
          <div className="produto-detalhe-box">
            <span className="produto-preco produto-preco-destaque">
              {formatarPreco(produto.price)}
            </span>
            <p className="produto-detalhe-disponibilidade">
              Disponibilidade: {produto.availability}
            </p>
            <button
              type="button"
              className="button-primary produto-detalhe-botao"
              onClick={comprarAgora}
            >
              Comprar agora
            </button>
            <CartButton produto={produto} className="button-secondary produto-detalhe-botao" />
            <FavoriteButton produto={produto} className="button-secondary produto-detalhe-botao" />
          </div>

          {relacionados.length > 0 && (
            <div className="produto-relacionados">
              <div className="section-head">
                <div>
                  <h2>Relacionados</h2>
                  <p>Outros itens da mesma categoria.</p>
                </div>
              </div>
              <div className="produto-relacionados-grid">
                {relacionados.map((item) => (
                  <Link
                    key={item.id}
                    className="produto-relacionado-card"
                    to={`/produto/${item.id}`}
                  >
                    <div className="produto-relacionado-imagem">
                      <img src={item.image} alt={item.title} loading="lazy" />
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.creator}</p>
                      <span>{formatarPreco(item.price)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </>
  );
}
