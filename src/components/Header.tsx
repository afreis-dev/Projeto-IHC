import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { CATEGORIAS } from "../data/products";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { SearchBox } from "./SearchBox";

export function Header() {
  const { total } = useCart();
  const { sessao, logout } = useAuth();
  const { tema, alternarTema } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const prefereMenosMovimento = useReducedMotion();

  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    function aoClicarFora(e: globalThis.MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    }
    function aoTeclar(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setMenuAberto(false);
    }
    document.addEventListener("click", aoClicarFora);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("click", aoClicarFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, []);

  function aoSair() {
    setMenuAberto(false);
    logout();
    showToast("Você saiu da sua conta.", "info");
    navigate("/entrar");
  }

  // Efeito de "flash" circular ao trocar de tema (porta de animarTrocaDeTema).
  function trocarTema(e: MouseEvent<HTMLButtonElement>) {
    const novoTema = tema === "dark" ? "light" : "dark";
    if (prefereMenosMovimento) {
      alternarTema();
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const overlay = document.createElement("div");
    overlay.className = `theme-flash theme-flash--${novoTema}`;
    overlay.style.setProperty("--theme-flash-x", `${rect.left + rect.width / 2}px`);
    overlay.style.setProperty("--theme-flash-y", `${rect.top + rect.height / 2}px`);
    document.body.appendChild(overlay);
    document.body.classList.add("theme-transitioning");

    requestAnimationFrame(() => {
      overlay.classList.add("is-active");
      alternarTema();
    });

    window.setTimeout(() => {
      overlay.classList.remove("is-active");
      document.body.classList.remove("theme-transitioning");
      window.setTimeout(() => overlay.remove(), 420);
    }, 320);
  }

  const primeiroNome = sessao?.name?.split(" ")[0] ?? "";

  return (
    <header className="header">
      <div className="site-shell">
        <nav className="barNavegacao" aria-label="Navegação principal">
          <Link to="/" className="nav-brand">
            RELIC
          </Link>

          <div className="nav-links">
            {CATEGORIAS.map((c) => (
              <NavLink
                key={c.slug}
                to={`/categoria/${c.slug}`}
                className={({ isActive }) => (isActive ? "ativo" : undefined)}
              >
                {c.nome}
              </NavLink>
            ))}
          </div>

          <div className="nav-actions">
            <SearchBox />

            <Link to="/carrinho" className="cart-link">
              Carrinho
              {total > 0 && (
                <span className="cart-count" aria-label={`${total} item(ns) no carrinho`}>
                  {total}
                </span>
              )}
            </Link>

            {sessao ? (
              <div className="account-wrap" ref={menuRef}>
                <button
                  type="button"
                  className="ativo account-trigger"
                  aria-haspopup="menu"
                  aria-expanded={menuAberto}
                  aria-controls={menuId}
                  onClick={() => setMenuAberto((v) => !v)}
                >
                  Olá, {primeiroNome} ▾
                </button>
                {menuAberto && (
                  <div className="account-menu is-open" id={menuId} role="menu">
                    <Link to="/perfil" role="menuitem" onClick={() => setMenuAberto(false)}>
                      Meu perfil
                    </Link>
                    <Link to="/favoritos" role="menuitem" onClick={() => setMenuAberto(false)}>
                      Favoritos
                    </Link>
                    <Link to="/pedidos" role="menuitem" onClick={() => setMenuAberto(false)}>
                      Pedidos
                    </Link>
                    <button type="button" role="menuitem" onClick={aoSair}>
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/entrar">Entrar</Link>
            )}

            <button
              type="button"
              className="theme-toggle"
              aria-pressed={tema === "dark"}
              aria-label={
                tema === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro"
              }
              title={tema === "dark" ? "Modo escuro ativo" : "Modo claro ativo"}
              onClick={trocarTema}
            >
              {tema === "dark" ? "🌙" : "☀️"}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
