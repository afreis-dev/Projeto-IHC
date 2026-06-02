import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useOrders } from "../context/OrdersContext";
import { useToast } from "../context/ToastContext";
import { exportarDados } from "../lib/lgpd";

export default function Perfil() {
  useDocumentTitle("Meu perfil | RELIC");
  const [removido, setRemovido] = useState(false);
  const ok = useRequireAuth("Faça login para acessar seu perfil.", !removido);
  const { sessao, logout, apagarConta } = useAuth();
  const { total: itensCarrinho, limpar } = useCart();
  const { favoritos, limparFavoritos } = useFavorites();
  const { pedidosDoUsuario, limparPedidos } = useOrders();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Tela de confirmação após apagar os dados (não exige sessão).
  if (removido) {
    return (
      <section className="carrinho-container" aria-live="polite">
        <span className="tag">Privacidade</span>
        <h1>Seus dados foram removidos.</h1>
        <p style={{ color: "var(--muted)", margin: "10px 0 18px" }}>
          Apagamos deste navegador sua conta simulada, carrinho, favoritos e histórico de pedidos.
        </p>
        <div className="auth-session-actions">
          <Link to="/" className="button-primary">
            Voltar ao início
          </Link>
          <Link to="/entrar" className="button-secondary">
            Criar nova conta
          </Link>
        </div>
      </section>
    );
  }

  if (!ok || !sessao) return null;

  const totalPedidos = pedidosDoUsuario(sessao.email).length;

  function sair() {
    logout();
    showToast("Você saiu da sua conta.", "info");
    navigate("/entrar");
  }

  function baixarDados() {
    exportarDados();
    showToast("Download dos seus dados iniciado (meus-dados-relic.json).", "success");
  }

  function apagarTudo() {
    const confirmado = window.confirm(
      "Apagar todos os seus dados deste navegador? Esta ação é permanente e não pode ser desfeita."
    );
    if (!confirmado) return;
    apagarConta();
    limpar();
    limparFavoritos();
    limparPedidos();
    setRemovido(true);
    showToast("Seus dados foram removidos deste navegador.", "success");
  }

  return (
    <section className="carrinho-container">
      <div className="carrinho-header">
        <div>
          <span className="tag">Conta</span>
          <h1>Meu perfil</h1>
        </div>
      </div>

      <div className="perfil-card">
        <dl className="perfil-dados">
          <div>
            <dt>Nome</dt>
            <dd>{sessao.name || "Usuário"}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd>{sessao.email || "-"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>Sessão ativa</dd>
          </div>
        </dl>
        <button type="button" className="button-secondary" onClick={sair}>
          Sair da conta
        </button>
      </div>

      {/* Meus dados e privacidade (LGPD) */}
      <div className="perfil-card" style={{ marginTop: "18px" }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "6px" }}>Meus dados e privacidade</h2>
        <p style={{ color: "var(--muted)", marginBottom: "16px" }}>
          Estes dados ficam apenas neste navegador (localStorage). Você pode baixá-los ou apagá-los
          quando quiser. <Link to="/privacidade">Saiba como tratamos seus dados</Link>.
        </p>

        <dl className="perfil-dados">
          <div>
            <dt>Favoritos</dt>
            <dd>{favoritos.length} item(ns)</dd>
          </div>
          <div>
            <dt>Itens no carrinho</dt>
            <dd>{itensCarrinho} item(ns)</dd>
          </div>
          <div>
            <dt>Pedidos simulados</dt>
            <dd>{totalPedidos} pedido(s)</dd>
          </div>
        </dl>

        <div className="auth-session-actions">
          <button type="button" className="button-secondary" onClick={baixarDados}>
            Baixar meus dados
          </button>
          <button
            type="button"
            className="button-secondary"
            style={{ color: "var(--err)", borderColor: "var(--err)" }}
            onClick={apagarTudo}
          >
            Apagar meus dados
          </button>
        </div>
      </div>
    </section>
  );
}
