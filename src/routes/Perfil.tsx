import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Perfil() {
  useDocumentTitle("Meu perfil | RELIC");
  const ok = useRequireAuth("Faça login para acessar seu perfil.");
  const { sessao, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!ok || !sessao) return null;

  function sair() {
    logout();
    showToast("Você saiu da sua conta.", "info");
    navigate("/entrar");
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
            <dd id="profile-name">{sessao.name || "Usuário"}</dd>
          </div>
          <div>
            <dt>E-mail</dt>
            <dd id="profile-email">{sessao.email || "-"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd id="profile-status">Sessão ativa</dd>
          </div>
        </dl>
        <button type="button" className="button-secondary" id="profile-logout" onClick={sair}>
          Sair da conta
        </button>
      </div>
    </section>
  );
}
