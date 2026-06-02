import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { filtrarPorTermo, formatarPreco, type Product } from "../data/products";

/**
 * Busca como combobox acessível (WAI-ARIA): aria-expanded, aria-controls,
 * aria-activedescendant e navegação por setas/Enter/Esc.
 * Responde ao achado do teste da Unidade 1 (busca difícil / nome completo).
 */
export function SearchBox() {
  const navigate = useNavigate();
  const [termo, setTermo] = useState("");
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const inputId = useId();

  const resultados = filtrarPorTermo(termo).slice(0, 6);
  const semResultados = termo.trim().length > 0 && resultados.length === 0;
  const mostrarPainel = aberto && (resultados.length > 0 || semResultados);

  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setAberto(false);
        setAtivo(-1);
      }
    }
    document.addEventListener("click", aoClicarFora);
    return () => document.removeEventListener("click", aoClicarFora);
  }, []);

  function selecionar(p: Product) {
    setAberto(false);
    setTermo("");
    setAtivo(-1);
    inputRef.current?.blur();
    navigate(`/produto/${p.id}`);
  }

  function aoTeclar(e: KeyboardEvent<HTMLInputElement>) {
    if (!aberto && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setAberto(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAtivo((i) => Math.min(i + 1, resultados.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAtivo((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && ativo >= 0 && resultados[ativo]) {
      e.preventDefault();
      selecionar(resultados[ativo]);
    } else if (e.key === "Escape") {
      setAberto(false);
      setAtivo(-1);
    }
  }

  return (
    <div className="search-box" ref={wrapperRef}>
      <label htmlFor={inputId} className="sr-only">
        Pesquisar item raro
      </label>
      <input
        id={inputId}
        ref={inputRef}
        type="search"
        className="search-input"
        placeholder="Pesquisar item raro"
        role="combobox"
        aria-expanded={mostrarPainel}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={ativo >= 0 ? `${listId}-opt-${ativo}` : undefined}
        value={termo}
        onChange={(e) => {
          setTermo(e.target.value);
          setAberto(true);
          setAtivo(-1);
        }}
        onFocus={() => setAberto(true)}
        onKeyDown={aoTeclar}
      />
      {mostrarPainel && (
        <div
          className="search-suggestions is-visible"
          id={listId}
          role="listbox"
          aria-label="Sugestões de produtos"
        >
          <div className="search-suggestions-title">
            {termo.trim() ? "Resultados de busca" : "Sugestões da loja"}
          </div>
          {semResultados ? (
            <p className="search-empty">
              Nenhum item encontrado para “{termo}”. Tente outro termo ou navegue pelas categorias.
            </p>
          ) : (
            resultados.map((p, i) => (
              <button
                type="button"
                key={p.id}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={i === ativo}
                className={`search-suggestion-item${i === ativo ? " is-active" : ""}`}
                onMouseEnter={() => setAtivo(i)}
                onClick={() => selecionar(p)}
              >
                <div className="search-suggestion-thumb">
                  <img src={p.image} alt="" />
                </div>
                <div className="search-suggestion-copy">
                  <strong>{p.title}</strong>
                  <span>{p.creator}</span>
                  <small>{formatarPreco(p.price)}</small>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
