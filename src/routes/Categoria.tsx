import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import {
  PRODUCTS,
  CATEGORIAS,
  CATEGORIA_LABEL,
  normalizarTexto,
  type Categoria as Cat,
  type Product,
} from "../data/products";
import { ProductGrid } from "../components/ProductGrid";
import { SkeletonGrid } from "../components/Skeleton";
import { EmptyState } from "../components/EmptyState";

type Ordem = "relevancia" | "menor" | "maior";

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
  const [estado, setEstado] = useState("");
  const [autenticidade, setAutenticidade] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("");
  const [ordem, setOrdem] = useState<Ordem>("relevancia");
  const [carregando, setCarregando] = useState(true);

  // Zera filtros e mostra o skeleton (aria-busy) a cada troca de categoria.
  useEffect(() => {
    setTermo("");
    setEstado("");
    setAutenticidade("");
    setDisponibilidade("");
    setOrdem("relevancia");
    setCarregando(true);
    const t = window.setTimeout(() => setCarregando(false), 350);
    return () => window.clearTimeout(t);
  }, [cat]);

  const base = useMemo(
    () => (categoria ? PRODUCTS.filter((p) => p.category === categoria) : []),
    [categoria],
  );

  // Opções derivadas dos itens reais da categoria — nunca exibe filtro sem resultado.
  const opcoes = useMemo(() => {
    const distintos = (sel: (p: Product) => string) =>
      [...new Set(base.map(sel))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    return {
      estado: distintos((p) => p.condition),
      autenticidade: distintos((p) => p.authenticity),
      disponibilidade: distintos((p) => p.availability),
    };
  }, [base]);

  const produtos = useMemo(() => {
    let lista = base;
    const t = normalizarTexto(termo);
    if (t) lista = lista.filter((p) => normalizarTexto(`${p.title} ${p.creator}`).includes(t));
    if (estado) lista = lista.filter((p) => p.condition === estado);
    if (autenticidade) lista = lista.filter((p) => p.authenticity === autenticidade);
    if (disponibilidade) lista = lista.filter((p) => p.availability === disponibilidade);
    if (ordem !== "relevancia") {
      lista = [...lista].sort((a, b) =>
        ordem === "menor" ? a.price - b.price : b.price - a.price,
      );
    }
    return lista;
  }, [base, termo, estado, autenticidade, disponibilidade, ordem]);

  const algumFiltro =
    termo !== "" ||
    estado !== "" ||
    autenticidade !== "" ||
    disponibilidade !== "" ||
    ordem !== "relevancia";

  function limparFiltros() {
    setTermo("");
    setEstado("");
    setAutenticidade("");
    setDisponibilidade("");
    setOrdem("relevancia");
  }

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
          {/* Chips para trocar de categoria (reconhecimento, não memorização). */}
          <div className="categoria-chips" role="group" aria-label="Trocar de categoria">
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

          {/* Filtros e ordenação dentro da categoria. */}
          <div className="catalogo-filtros" role="group" aria-label="Filtrar e ordenar itens">
            <div className="filtro-grupo">
              <label htmlFor="filtro-busca">Buscar nesta categoria</label>
              <input
                id="filtro-busca"
                type="search"
                data-filter="search"
                placeholder="Nome ou autor/artista"
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                enterKeyHint="search"
              />
            </div>

            <div className="filtro-grupo">
              <label htmlFor="filtro-estado">Estado</label>
              <select
                id="filtro-estado"
                data-filter="condition"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="">Todos</option>
                {opcoes.estado.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-grupo">
              <label htmlFor="filtro-autenticidade">Autenticidade</label>
              <select
                id="filtro-autenticidade"
                data-filter="authenticity"
                value={autenticidade}
                onChange={(e) => setAutenticidade(e.target.value)}
              >
                <option value="">Todas</option>
                {opcoes.autenticidade.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-grupo">
              <label htmlFor="filtro-disponibilidade">Disponibilidade</label>
              <select
                id="filtro-disponibilidade"
                data-filter="availability"
                value={disponibilidade}
                onChange={(e) => setDisponibilidade(e.target.value)}
              >
                <option value="">Todas</option>
                {opcoes.disponibilidade.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-grupo">
              <label htmlFor="filtro-ordem">Ordenar por</label>
              <select
                id="filtro-ordem"
                value={ordem}
                onChange={(e) => setOrdem(e.target.value as Ordem)}
              >
                <option value="relevancia">Relevância</option>
                <option value="menor">Menor preço</option>
                <option value="maior">Maior preço</option>
              </select>
            </div>
          </div>

          {algumFiltro && (
            <button type="button" className="filtros-reset" onClick={limparFiltros}>
              Limpar filtros
            </button>
          )}
        </div>

        {carregando ? (
          <SkeletonGrid count={4} />
        ) : produtos.length > 0 ? (
          <ProductGrid produtos={produtos} />
        ) : (
          <EmptyState
            titulo="Nenhum item corresponde aos filtros"
            descricao={`Ajuste a busca ou os filtros em ${CATEGORIA_LABEL[categoria]} para ver mais itens.`}
            acao={
              <button type="button" className="button-secondary" onClick={limparFiltros}>
                Limpar filtros
              </button>
            }
          />
        )}
      </section>
    </>
  );
}
