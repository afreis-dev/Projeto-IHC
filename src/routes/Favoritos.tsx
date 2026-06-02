import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { buscarProdutoPorNome, formatarPreco } from "../data/products";
import { CartButton } from "../components/CartButton";
import { EmptyState } from "../components/EmptyState";

export default function Favoritos() {
  useDocumentTitle("Favoritos | RELIC");
  const { sessao } = useAuth();
  const { favoritos, remover } = useFavorites();

  return (
    <section className="carrinho-container">
      <div className="carrinho-header">
        <div>
          <span className="tag">Sua seleção</span>
          <h1>Favoritos</h1>
        </div>
        <p>Total de itens: {sessao ? favoritos.length : 0}</p>
      </div>

      {!sessao ? (
        <EmptyState
          titulo="Faça login para ver seus favoritos"
          descricao="Entre na sua conta para salvar e acompanhar seus itens favoritos."
          acao={
            <Link to="/entrar" className="button-primary">
              Entrar
            </Link>
          }
        />
      ) : favoritos.length === 0 ? (
        <EmptyState
          titulo="Você ainda não salvou favoritos"
          descricao="Use o botão de favoritar nas páginas de produtos para montar sua seleção."
          acao={
            <Link to="/categoria/cartas" className="button-primary">
              Descobrir itens
            </Link>
          }
        />
      ) : (
        <div className="lista-favoritos">
          {favoritos.map((item, index) => {
            const produto = buscarProdutoPorNome(item.nome);
            return (
              <div className="item-carrinho item-favorito" key={`${item.nome}-${index}`}>
                <img src={item.imagem} alt={item.nome} />
                <div className="info">
                  <h3>{item.nome}</h3>
                  <span>{produto ? formatarPreco(produto.price) : "Produto indisponível"}</span>
                </div>
                <div className="item-carrinho-acoes">
                  {produto && (
                    <Link className="button-secondary" to={`/produto/${produto.id}`}>
                      Ver produto
                    </Link>
                  )}
                  {produto && <CartButton produto={produto} />}
                </div>
                <button type="button" className="remover" onClick={() => remover(index)}>
                  Remover
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
