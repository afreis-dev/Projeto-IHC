import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import {
  PRODUCTS,
  CATEGORIAS,
  CATEGORIA_LABEL,
  normalizarTexto,
  type Categoria as Cat,
} from "../data/products";
import { ProductGrid } from "../components/ProductGrid";
import { SkeletonGrid } from "../components/Skeleton";
import { EmptyState } from "../components/EmptyState";

const COPY: Record<Cat, { titulo: string; descricao: string }> = {
  vinil: {
    titulo: "Vinis para colecionar som e capa.",
    descricao: "Discos com apelo visual e autenticidade verificada.",
  },
  cartas: {
    titulo: "Cartas raras para coleções memoráveis.",
    descricao: "Peças desejadas, com raridade, estado e laudo.",
  },
  livros: {
    titulo: "Livros para montar sua estante clássica.",
    descricao: "Edições de colecionador com curadoria verificada.",
  },
  jogos: {
    titulo: "Jogos e consoles que marcaram época.",
    descricao: "Itens retrô com forte carga nostálgica.",
  },
};

export default function Categoria() {
  const { cat } = useParams<{ cat: string }>();
  const categoria = CATEGORIAS.find((c) => c.slug === cat)?.slug;

  useDocumentTitle(categoria ? `${CATEGORIA_LABEL[categoria]} | RELIC` : "Categoria | RELIC");

  const [termo, setTermo] = useState("");
  const [carregando, setCarregando] = useState(true);

  // Demonstra o estado "carregando" aprimorado (skeleton + aria-busy) a cada troca de categoria.
  useEffect(() => {
    setTermo("");
    setCarregando(true);
    const t = window.setTimeout(() => setCarregando(false), 350);
    return () => window.clearTimeout(t);
  }, [cat]);

  const produtos = useMemo(() => {
    if (!categoria) return [];
    const base = PRODUCTS.filter((p) => p.category === categoria);
    const t = normalizarTexto(termo);
    if (!t) return base;
    return base.filter((p) => normalizarTexto(`${p.title} ${p.creator}`).includes(t));
  }, [categoria, termo]);

  if (!categoria) {
    return (
      <EmptyState
        titulo="Categoria não encontrada"
        descricao="Escolha uma das categorias disponíveis para continuar explorando."
        acao={
          <Link to="/" className="button-primary">
            Voltar para o início
          </Link>
        }
      />
    );
  }

  return (
    <>
      <nav className="breadcrumb" aria-label="Você está em">
        <Link to="/">Início</Link> / <span aria-current="page">{CATEGORIA_LABEL[categoria]}</span>
      </nav>

      <section className="page-hero">
        <div className="page-hero-copy">
          <span className="tag">Categoria</span>
          <h1>{COPY[categoria].titulo}</h1>
          <p>{COPY[categoria].descricao}</p>
        </div>
      </section>

      <section
        className="catalogo"
        aria-label={`Produtos da categoria ${CATEGORIA_LABEL[categoria]}`}
      >
        <div className="catalogo-tools">
          {/* Chips para trocar de categoria rapidamente (reconhecimento, não memorização) */}
          <div className="categoria-chips" role="group" aria-label="Filtrar por categoria">
            {CATEGORIAS.map((c) => (
              <Link
                key={c.slug}
                to={`/categoria/${c.slug}`}
                className="chip"
                aria-pressed={c.slug === categoria}
              >
                {c.nome}
              </Link>
            ))}
          </div>

          <div className="filtro-grupo">
            <label htmlFor="filtro-busca">Buscar nesta categoria</label>
            <input
              id="filtro-busca"
              type="search"
              data-filter="search"
              placeholder="Nome ou autor/artista"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
            />
          </div>
        </div>

        {carregando ? (
          <SkeletonGrid count={4} />
        ) : produtos.length > 0 ? (
          <ProductGrid produtos={produtos} />
        ) : (
          <EmptyState
            titulo="Nenhum item corresponde à busca"
            descricao={`Não encontramos resultados para “${termo}” em ${CATEGORIA_LABEL[categoria]}. Tente outro termo ou limpe o filtro.`}
            acao={
              <button type="button" className="button-secondary" onClick={() => setTermo("")}>
                Limpar busca
              </button>
            }
          />
        )}
      </section>
    </>
  );
}
