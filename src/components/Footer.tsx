import { Link } from "react-router-dom";
import { CATEGORIAS } from "../data/products";

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-shell site-footer-inner">
        <div className="site-footer-brand">
          <strong>RELIC</strong>
          <p>Rare Editions &amp; Legendary Items Collection — marketplace de itens colecionáveis.</p>
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
        <div className="site-footer-meta">
          <p>Projeto acadêmico — Interação Humano-Computador (IHC).</p>
          <p>Unidade 2: aprimoramento e validação da interface.</p>
        </div>
      </div>
    </footer>
  );
}
