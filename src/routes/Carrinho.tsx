import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  buscarProdutoPorId,
  buscarProdutoPorNome,
  obterEstoque,
  formatarPreco,
} from "../data/products";
import { EmptyState } from "../components/EmptyState";
import type { CartItem } from "../lib/storage";

export default function Carrinho() {
  useDocumentTitle("Carrinho | RELIC");
  const { itens, alterarQuantidade, definirQuantidade, removerItem, inserirItem, subtotal } =
    useCart();
  const { sessao, definirRedirect } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const reduzir = useReducedMotion();

  const [removido, setRemovido] = useState<{ item: CartItem; index: number } | null>(null);

  useEffect(() => {
    if (!removido) return;
    const t = window.setTimeout(() => setRemovido(null), 7000);
    return () => window.clearTimeout(t);
  }, [removido]);

  function remover(index: number) {
    const item = removerItem(index);
    if (item) setRemovido({ item, index });
  }

  function desfazer() {
    if (removido) {
      inserirItem(removido.index, removido.item);
      setRemovido(null);
      showToast(`${removido.item.nome} foi restaurado no carrinho.`, "success");
    }
  }

  function finalizar() {
    if (itens.length === 0) {
      showToast("Seu carrinho está vazio.", "info");
      return;
    }
    if (!sessao) {
      definirRedirect("/finalizar-compra");
      showToast("Para finalizar a compra, faça login primeiro.", "info");
      navigate("/entrar");
      return;
    }
    navigate("/finalizar-compra");
  }

  return (
    <section className="carrinho-container">
      <div className="carrinho-header">
        <div>
          <span className="tag">Resumo</span>
          <h1>Seu carrinho</h1>
        </div>
        <Link to="/" className="button-secondary">
          Continuar comprando
        </Link>
      </div>

      <AnimatePresence>
        {removido && (
          <motion.div
            className="undo-banner"
            role="status"
            initial={reduzir ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span>“{removido.item.nome}” foi removido do carrinho.</span>
            <button type="button" className="button-secondary" onClick={desfazer}>
              Desfazer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {itens.length === 0 ? (
        <EmptyState
          titulo="Seu carrinho está vazio"
          descricao="Adicione alguns itens das categorias para visualizar o resumo aqui."
          acao={
            <Link to="/categoria/vinil" className="button-primary">
              Explorar itens
            </Link>
          }
        />
      ) : (
        <>
          <div className="lista-carrinho">
            {itens.map((item, index) => {
              const produto = item.id
                ? buscarProdutoPorId(item.id)
                : buscarProdutoPorNome(item.nome);
              const estoque = obterEstoque(produto);
              const quantidade = Number(item.quantidade || 1);
              const subtotalItem = Number(item.preco) * quantidade;

              return (
                <div className="item-carrinho" key={`${item.id ?? item.nome}-${index}`}>
                  <img src={item.imagem} alt={item.nome} />
                  <div className="info">
                    <h3>{item.nome}</h3>
                    <div className="item-carrinho-meta">
                      <span>{formatarPreco(item.preco)} cada</span>
                      <small>
                        {estoque > 0
                          ? `${estoque} unidade(s) disponível(is)`
                          : "Estoque sob consulta"}
                      </small>
                    </div>
                  </div>
                  <div className="item-carrinho-acoes">
                    <div className="quantity-control">
                      <button
                        type="button"
                        className="quantity-button"
                        aria-label={`Diminuir quantidade de ${item.nome}`}
                        onClick={() => alterarQuantidade(index, -1)}
                        disabled={quantidade <= 1}
                      >
                        −
                      </button>
                      <input
                        className="quantity-input"
                        type="number"
                        min={1}
                        max={estoque || quantidade}
                        value={quantidade}
                        aria-label={`Quantidade de ${item.nome}`}
                        onChange={(e) => definirQuantidade(index, Number(e.target.value))}
                      />
                      <button
                        type="button"
                        className="quantity-button"
                        aria-label={`Aumentar quantidade de ${item.nome}`}
                        onClick={() => alterarQuantidade(index, 1)}
                        disabled={estoque > 0 && quantidade >= estoque}
                      >
                        +
                      </button>
                    </div>
                    <strong className="item-carrinho-subtotal">
                      {formatarPreco(subtotalItem)}
                    </strong>
                  </div>
                  <button type="button" className="remover" onClick={() => remover(index)}>
                    Remover
                  </button>
                </div>
              );
            })}
          </div>

          <div className="total">
            <h2>Total: {formatarPreco(subtotal)}</h2>
            <button type="button" className="btn-finalizar" onClick={finalizar}>
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </section>
  );
}
