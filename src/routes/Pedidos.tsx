import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { formatarPreco } from "../data/products";
import { EmptyState } from "../components/EmptyState";

export default function Pedidos() {
  useDocumentTitle("Meus pedidos | RELIC");
  const ok = useRequireAuth("Faça login para acessar seus pedidos.");
  const { sessao } = useAuth();
  const { pedidosDoUsuario } = useOrders();

  if (!ok || !sessao) return null;

  const pedidos = pedidosDoUsuario(sessao.email);

  return (
    <section className="carrinho-container">
      <div className="carrinho-header">
        <div>
          <span className="tag">Histórico</span>
          <h1>Meus pedidos</h1>
        </div>
        <p id="orders-count">Total de pedidos: {pedidos.length}</p>
      </div>

      {pedidos.length === 0 ? (
        <EmptyState
          titulo="Você ainda não realizou pedidos"
          descricao="Quando você concluir uma compra, o histórico aparecerá aqui."
          acao={
            <Link to="/" className="button-primary">
              Explorar itens
            </Link>
          }
        />
      ) : (
        <div className="lista-pedidos">
          {pedidos.map((pedido) => (
            <article className="pedido-card" key={pedido.id}>
              <div className="pedido-head">
                <div>
                  <span className="mini-tag">Pedido</span>
                  <h3>{pedido.id}</h3>
                </div>
                <strong>{formatarPreco(pedido.total)}</strong>
              </div>
              <p className="pedido-meta">
                {new Date(pedido.createdAt).toLocaleDateString("pt-BR")} • {pedido.items.length}{" "}
                item(ns) • {pedido.payment.toUpperCase()}
              </p>
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
