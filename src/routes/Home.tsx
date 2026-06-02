import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { PRODUCTS, obterDestaquesDaSemana, obterBadge, formatarPreco } from "../data/products";
import { ProductGrid } from "../components/ProductGrid";

export default function Home() {
  useDocumentTitle("RELIC | Marketplace de colecionáveis");
  const destaques = obterDestaquesDaSemana();
  const selecao = PRODUCTS.slice(0, 8);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="tag">Curadoria vintage</span>
          <h1>Raridades para quem coleciona memória e história.</h1>
          <p>Vinis, cartas, livros e jogos raros em uma vitrine visual.</p>
          <div className="hero-actions">
            <Link to="/categoria/vinil" className="button-primary">
              Ver destaques
            </Link>
            <Link to="/carrinho" className="button-secondary">
              Abrir carrinho
            </Link>
          </div>
        </div>

        <div className="hero-panel home-highlights">
          {destaques.map((p, i) => (
            <Link
              key={p.id}
              className={`featured-home-card${i === 0 ? " is-featured" : ""}`}
              to={`/produto/${p.id}`}
            >
              <div className="featured-home-thumb">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="featured-home-copy">
                <span className="tag">{i === 0 ? "Seleção da semana" : obterBadge(p)}</span>
                <strong>{p.title}</strong>
                <p>{p.summary}</p>
                <span className="featured-home-meta">
                  {p.creator} • {formatarPreco(p.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="catalogo" aria-labelledby="destaques-titulo">
        <div className="section-head">
          <div>
            <h2 id="destaques-titulo">Destaques da semana</h2>
            <p>Itens selecionados para explorar.</p>
          </div>
        </div>
        <ProductGrid produtos={selecao} compacto />
      </section>
    </>
  );
}
