import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Privacidade() {
  useDocumentTitle("Privacidade | RELIC");

  return (
    <>
      <nav className="breadcrumb" aria-label="Você está em">
        <Link to="/">Início</Link> / <span aria-current="page">Privacidade</span>
      </nav>

      <section className="carrinho-container">
        <span className="tag">Privacidade e dados</span>
        <h1 style={{ margin: "8px 0 4px" }}>Como o RELIC trata seus dados</h1>

        <div className="aviso-simulacao" role="note" style={{ marginTop: "16px" }}>
          <strong>Protótipo acadêmico.</strong> O RELIC é um projeto de Interação Humano-Computador,
          sem backend ou banco de dados. Nenhuma informação sai do seu navegador. Não insira dados
          reais (CPF, cartão ou senha de verdade).
        </div>

        <div className="privacidade-section">
          <h2>Quais dados usamos</h2>
          <p>Apenas o mínimo para simular a experiência de compra:</p>
          <ul className="prose-list">
            <li>Nome e e-mail informados no cadastro</li>
            <li>Itens favoritados e itens no carrinho</li>
            <li>Histórico simulado de pedidos</li>
          </ul>
        </div>

        <div className="privacidade-section">
          <h2>Para que usamos</h2>
          <ul className="prose-list">
            <li>Simular cadastro e login</li>
            <li>Manter seu carrinho e seus favoritos entre as telas</li>
            <li>Demonstrar o fluxo de finalização de compra</li>
          </ul>
        </div>

        <div className="privacidade-section">
          <h2>Onde ficam e por quanto tempo</h2>
          <p>
            Os dados ficam <strong>apenas no seu navegador</strong>, com a tecnologia{" "}
            <code>localStorage</code>, até você apagá-los ou limpar o navegador. O protótipo{" "}
            <strong>não envia nada</strong> para servidores externos.
          </p>
        </div>

        <div className="privacidade-section">
          <h2>Com quem compartilhamos</h2>
          <p>Com ninguém. Não há integração com terceiros nem rastreadores.</p>
        </div>

        <div className="privacidade-section">
          <h2>Seu controle</h2>
          <p>
            Você pode visualizar, baixar (formato JSON) e apagar seus dados a qualquer momento na
            área <Link to="/perfil">Perfil &gt; Meus dados e privacidade</Link>. Carrinho e favoritos
            também podem ser esvaziados nas próprias telas.
          </p>
        </div>

        <Link to="/perfil" className="button-primary">
          Gerenciar meus dados
        </Link>
      </section>
    </>
  );
}
