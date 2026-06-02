import { useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

type Aba = "login" | "cadastro";
interface Feedback {
  msg: string;
  tipo: "" | "success" | "error";
}

export default function Entrar() {
  useDocumentTitle("Entrar | RELIC");
  const { sessao, login, registrar, logout, consumirRedirect } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [aba, setAba] = useState<Aba>("login");
  const [feedback, setFeedback] = useState<Feedback>({ msg: "", tipo: "" });

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [loginInvalido, setLoginInvalido] = useState(false);
  const loginEmailRef = useRef<HTMLInputElement>(null);

  // Cadastro
  const [regNome, setRegNome] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regSenha, setRegSenha] = useState("");
  const [regConfirma, setRegConfirma] = useState("");
  const [confirmaInvalida, setConfirmaInvalida] = useState(false);
  const confirmaRef = useRef<HTMLInputElement>(null);

  // LGPD / boas práticas de login
  const [verLoginSenha, setVerLoginSenha] = useState(false);
  const [verRegSenha, setVerRegSenha] = useState(false);
  const [verRegConfirma, setVerRegConfirma] = useState(false);
  const [consentido, setConsentido] = useState(false);

  const feedbackId = useId();
  const loginTabId = useId();
  const cadastroTabId = useId();
  const loginPanelId = useId();
  const cadastroPanelId = useId();

  function trocarAba(nova: Aba) {
    setAba(nova);
    setFeedback({ msg: "", tipo: "" });
    setLoginInvalido(false);
    setConfirmaInvalida(false);
  }

  function destinoPosLogin() {
    return consumirRedirect() || "/";
  }

  function enviarLogin(e: React.FormEvent) {
    e.preventDefault();
    const usuario = login(loginEmail, loginSenha);
    if (!usuario) {
      setLoginInvalido(true);
      setFeedback({
        msg: "E-mail ou senha inválidos. Confira os dados e tente novamente.",
        tipo: "error",
      });
      showToast("Login não realizado. Verifique seu e-mail e sua senha.", "error");
      loginEmailRef.current?.focus();
      return;
    }
    setLoginInvalido(false);
    setFeedback({ msg: "Login realizado com sucesso. Redirecionando...", tipo: "success" });
    showToast(`Bem-vindo de volta, ${usuario.name.split(" ")[0]}.`, "success");
    navigate(destinoPosLogin());
  }

  function enviarCadastro(e: React.FormEvent) {
    e.preventDefault();
    if (!consentido) {
      setFeedback({
        msg: "Para criar a conta, confirme que leu o aviso de privacidade.",
        tipo: "error",
      });
      showToast("Confirme o aviso de privacidade para continuar.", "error");
      return;
    }
    if (regSenha !== regConfirma) {
      setConfirmaInvalida(true);
      setFeedback({ msg: "As senhas não coincidem. Tente novamente.", tipo: "error" });
      showToast("As senhas não conferem. Ajuste o cadastro.", "error");
      confirmaRef.current?.focus();
      return;
    }
    const resultado = registrar({ name: regNome, email: regEmail, password: regSenha });
    if (!resultado.ok) {
      setFeedback({ msg: resultado.mensagem ?? "Não foi possível cadastrar.", tipo: "error" });
      showToast(resultado.mensagem ?? "Não foi possível cadastrar.", "error");
      return;
    }
    setConfirmaInvalida(false);
    setFeedback({
      msg: "Conta criada com sucesso. Você será levado para a loja.",
      tipo: "success",
    });
    showToast("Cadastro realizado com sucesso.", "success");
    navigate(destinoPosLogin());
  }

  function sair() {
    logout();
    setFeedback({ msg: "Sessão encerrada com sucesso.", tipo: "success" });
    showToast("Você saiu da sua conta.", "info");
  }

  return (
    <section className="login-container">
      <div className="login-destaque">
        <span className="selo-vintage">Sua conta</span>
        <h1>Entre ou crie sua conta.</h1>
        <p>
          É preciso estar logado para finalizar a compra, salvar o carrinho e acompanhar pedidos.
        </p>
      </div>

      <div className="login-box">
        <h2>Sua conta na RELIC</h2>

        {/* Feedback acessível anunciado a leitores de tela */}
        <div
          className={`auth-feedback${feedback.msg ? " is-visible" : ""}${feedback.tipo ? ` is-${feedback.tipo}` : ""}`}
          id={feedbackId}
          role="status"
          aria-live="polite"
        >
          {feedback.msg}
        </div>

        {sessao ? (
          <section className="auth-session-card">
            <h3>Você já está logado.</h3>
            <p>
              {sessao.name} está logado com {sessao.email}. Se quiser, siga direto para a
              finalização da compra.
            </p>
            <div className="auth-session-actions">
              <Link to="/finalizar-compra" className="button-primary">
                Ir para o checkout
              </Link>
              <button type="button" className="button-secondary" onClick={sair}>
                Sair da conta
              </button>
            </div>
          </section>
        ) : (
          <>
            <div
              className="auth-switch"
              role="tablist"
              aria-label="Alternar entre login e cadastro"
            >
              <button
                type="button"
                role="tab"
                id={loginTabId}
                aria-selected={aba === "login"}
                aria-controls={loginPanelId}
                className={`auth-tab${aba === "login" ? " is-active" : ""}`}
                onClick={() => trocarAba("login")}
              >
                Entrar
              </button>
              <button
                type="button"
                role="tab"
                id={cadastroTabId}
                aria-selected={aba === "cadastro"}
                aria-controls={cadastroPanelId}
                className={`auth-tab${aba === "cadastro" ? " is-active" : ""}`}
                onClick={() => trocarAba("cadastro")}
              >
                Cadastrar
              </button>
            </div>

            {aba === "login" ? (
              <section
                id={loginPanelId}
                role="tabpanel"
                aria-labelledby={loginTabId}
                className="auth-panel"
              >
                <form className="form-login" onSubmit={enviarLogin} noValidate>
                  <label htmlFor="login-email">E-mail</label>
                  <input
                    id="login-email"
                    ref={loginEmailRef}
                    type="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginInvalido(false);
                    }}
                    placeholder="seuemail@exemplo.com"
                    inputMode="email"
                    autoComplete="email"
                    aria-invalid={loginInvalido}
                    aria-describedby={loginInvalido ? feedbackId : undefined}
                    required
                  />

                  <label htmlFor="login-password">Senha</label>
                  <div className="campo-senha">
                    <input
                      id="login-password"
                      type={verLoginSenha ? "text" : "password"}
                      autoComplete="current-password"
                      value={loginSenha}
                      onChange={(e) => {
                        setLoginSenha(e.target.value);
                        setLoginInvalido(false);
                      }}
                      placeholder="Digite sua senha"
                      aria-invalid={loginInvalido}
                      aria-describedby={loginInvalido ? feedbackId : undefined}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-senha"
                      aria-pressed={verLoginSenha}
                      aria-label={verLoginSenha ? "Ocultar senha" : "Mostrar senha"}
                      onClick={() => setVerLoginSenha((v) => !v)}
                    >
                      {verLoginSenha ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>

                  <div className="login-opcoes">
                    <label className="lembrar">
                      <input type="checkbox" name="remember" /> Lembrar de mim
                    </label>
                    <span className="auth-hint">Após o login, você volta para a compra.</span>
                  </div>

                  <button type="submit" className="botao-login">
                    Entrar na conta
                  </button>
                </form>
              </section>
            ) : (
              <section
                id={cadastroPanelId}
                role="tabpanel"
                aria-labelledby={cadastroTabId}
                className="auth-panel"
              >
                <form className="form-login" onSubmit={enviarCadastro} noValidate>
                  <label htmlFor="register-name">Nome completo</label>
                  <input
                    id="register-name"
                    value={regNome}
                    onChange={(e) => setRegNome(e.target.value)}
                    placeholder="Digite seu nome"
                    autoComplete="name"
                    required
                  />

                  <label htmlFor="register-email">E-mail</label>
                  <input
                    id="register-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    inputMode="email"
                    autoComplete="email"
                    required
                  />

                  <label htmlFor="register-password">Senha</label>
                  <div className="campo-senha">
                    <input
                      id="register-password"
                      type={verRegSenha ? "text" : "password"}
                      value={regSenha}
                      onChange={(e) => setRegSenha(e.target.value)}
                      placeholder="Crie uma senha fictícia"
                      minLength={6}
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-senha"
                      aria-pressed={verRegSenha}
                      aria-label={verRegSenha ? "Ocultar senha" : "Mostrar senha"}
                      onClick={() => setVerRegSenha((v) => !v)}
                    >
                      {verRegSenha ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>

                  <label htmlFor="register-confirm-password">Confirmar senha</label>
                  <div className="campo-senha">
                    <input
                      id="register-confirm-password"
                      ref={confirmaRef}
                      type={verRegConfirma ? "text" : "password"}
                      autoComplete="new-password"
                      value={regConfirma}
                      onChange={(e) => {
                        setRegConfirma(e.target.value);
                        setConfirmaInvalida(false);
                      }}
                      placeholder="Digite a senha novamente"
                      minLength={6}
                      aria-invalid={confirmaInvalida}
                      aria-describedby={confirmaInvalida ? feedbackId : undefined}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-senha"
                      aria-pressed={verRegConfirma}
                      aria-label={verRegConfirma ? "Ocultar senha" : "Mostrar senha"}
                      onClick={() => setVerRegConfirma((v) => !v)}
                    >
                      {verRegConfirma ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>

                  <label className="consent">
                    <input
                      type="checkbox"
                      checked={consentido}
                      onChange={(e) => setConsentido(e.target.checked)}
                    />
                    <span>
                      Li e entendi que meus dados são usados apenas para simular o protótipo e ficam
                      só neste navegador. <Link to="/privacidade">Ver aviso de privacidade</Link>.
                    </span>
                  </label>

                  <button type="submit" className="botao-login">
                    Criar conta
                  </button>
                </form>
              </section>
            )}
          </>
        )}
      </div>
    </section>
  );
}
