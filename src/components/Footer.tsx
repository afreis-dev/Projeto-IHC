import { Link } from "react-router-dom";
import { CATEGORIAS } from "../data/products";

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-shell">
        <div className="site-footer-inner">
          <div className="site-footer-brand">
            <strong>RELIC</strong>
            <p>Marketplace de itens colecionáveis raros e vintage.</p>
          </div>
          <nav className="site-footer-nav" aria-label="Categorias no rodapé">
            <h2>Categorias</h2>
            <ul>
              {CATEGORIAS.map((c) => (
                <li key={c.slug}>
                  <Link to={`/categoria/${c.slug}`}>{c.nome}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="site-footer-nav" aria-label="Sobre e privacidade">
            <h2>Sobre</h2>
            <ul>
              <li>
                <Link to="/privacidade">Privacidade</Link>
              </li>
              <li>
                <Link to="/perfil">Meus dados</Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="proto-banner">
          Protótipo acadêmico de Interação Humano-Computador (Unidade 2). Os dados ficam apenas
          neste navegador e podem ser apagados em <Link to="/privacidade">Privacidade</Link>. Não
          insira dados reais.
        </p>
      </div>
    </footer>
  );
}
