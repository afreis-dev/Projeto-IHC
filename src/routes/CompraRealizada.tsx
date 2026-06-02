import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useOrders } from "../context/OrdersContext";
import { formatarPreco } from "../data/products";
import { EmptyState } from "../components/EmptyState";

export default function CompraRealizada() {
  useDocumentTitle("Compra realizada | RELIC");
  const { ultimoPedido } = useOrders();
  const reduzir = useReducedMotion();

  if (!ultimoPedido) {
    return (
      <EmptyState
        titulo="Nenhum pedido recente"
        descricao="Finalize uma compra para ver a confirmação aqui."
        acao={
          <Link to="/" className="button-primary">
            Voltar ao início
          </Link>
        }
      />
    );
  }

  const pedido = ultimoPedido;

  return (
    <section className="success-shell">
      <div className="success-hero">
        <motion.div
          className="success-check"
          aria-hidden="true"
          initial={reduzir ? false : { scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
        >
          ✓
        </motion.div>
        <span className="tag">Pedido confirmado</span>
        <h1>Compra realizada com sucesso.</h1>
        <p>Seu pedido foi registrado e já faz parte da sua coleção na RELIC.</p>
        <div className="hero-actions">
          <Link to="/pedidos" className="button-primary">
            Ver pedidos
          </Link>
          <Link to="/" className="button-secondary">
            Continuar explorando
          </Link>
        </div>
      </div>

      <div className="success-panel">
        <div className="success-summary">
          <div className="success-stat">
            <span>Pedido</span>
            <strong>{pedido.id}</strong>
          </div>
          <div className="success-stat">
            <span>Total</span>
            <strong>{formatarPreco(pedido.total)}</strong>
          </div>
          <div className="success-stat">
            <span>Pagamento</span>
            <strong>{pedido.payment.toUpperCase()}</strong>
          </div>
        </div>

        <div className="success-items-wrap">
          <h2>Itens do pedido</h2>
          <div className="pedido-items">
            {pedido.items.map((item, i) => (
              <Link
                key={`${item.id ?? item.nome}-${i}`}
                className="pedido-item"
                to={item.id ? `/produto/${item.id}` : "/"}
              >
                <img src={item.imagem} alt={item.nome} />
                <div>
                  <strong>{item.nome}</strong>
                  <span>Quantidade: {item.quantidade}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
