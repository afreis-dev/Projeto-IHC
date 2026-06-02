import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useOrders } from "../context/OrdersContext";
import { formatarPreco } from "../data/products";
import type { FormaPagamento } from "../lib/storage";
import {
  buscarCep,
  formatarCartao,
  formatarCep,
  formatarCpf,
  formatarTelefone,
  formatarValidade,
  somenteDigitos,
} from "../lib/checkout";

const FORM_INICIAL = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  cep: "",
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  complemento: "",
  cartao: "",
  validade: "",
  cvv: "",
  titular: "",
  pixChave: "",
  pixNome: "",
  boletoEmail: "",
  boletoCpf: "",
};

const DICA_PAGAMENTO: Record<FormaPagamento, string> = {
  cartao: "Preencha os dados do cartão para concluir o pagamento.",
  pix: "Informe a chave Pix e os dados do pagador para seguir com a compra.",
  boleto: "Preencha os dados para receber o boleto e concluir o pedido.",
};

export default function Checkout() {
  useDocumentTitle("Finalizar compra | RELIC");
  const { itens, subtotal, limpar } = useCart();
  const { sessao, definirRedirect } = useAuth();
  const { showToast } = useToast();
  const { registrarPedido } = useOrders();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState(FORM_INICIAL);
  const [pagamento, setPagamento] = useState<FormaPagamento>("cartao");
  const [cepFeedback, setCepFeedback] = useState<{ msg: string; tipo: "" | "success" | "error" }>({
    msg: "Digite o CEP para preencher o endereço automaticamente.",
    tipo: "",
  });

  // Guarda: sem login, salva destino e redireciona para entrar.
  useEffect(() => {
    if (!sessao) {
      definirRedirect("/finalizar-compra");
      showToast("Você precisa fazer login antes de finalizar a compra.", "info");
      navigate("/entrar", { replace: true });
    }
  }, [sessao, definirRedirect, showToast, navigate]);

  // Pré-preenche dados a partir da sessão.
  useEffect(() => {
    if (!sessao) return;
    setForm((f) => ({
      ...f,
      nome: f.nome || sessao.name || "",
      email: f.email || sessao.email || "",
      pixNome: f.pixNome || sessao.name || "",
      boletoEmail: f.boletoEmail || sessao.email || "",
    }));
  }, [sessao]);

  function set<K extends keyof typeof form>(campo: K, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function aoSairDoCep() {
    const cepLimpo = somenteDigitos(form.cep);
    if (cepLimpo.length !== 8) {
      setCepFeedback({ msg: "Digite um CEP válido para preencher o endereço automaticamente.", tipo: "error" });
      return;
    }
    setCepFeedback({ msg: "Buscando endereço...", tipo: "success" });
    try {
      const dados = await buscarCep(cepLimpo);
      setForm((f) => ({
        ...f,
        rua: dados.logradouro || f.rua,
        bairro: dados.bairro || f.bairro,
        cidade: dados.localidade || f.cidade,
        estado: dados.uf || f.estado,
      }));
      setCepFeedback({ msg: "Endereço preenchido automaticamente pelo CEP.", tipo: "success" });
    } catch {
      setCepFeedback({ msg: "Não foi possível localizar esse CEP. Confira e tente novamente.", tipo: "error" });
      showToast("CEP não encontrado. Confira os números digitados.", "error");
    }
  }

  function aoEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formRef.current && !formRef.current.reportValidity()) {
      showToast("Preencha os campos obrigatórios antes de confirmar o pedido.", "error");
      return;
    }
    registrarPedido(itens, sessao, pagamento);
    limpar();
    showToast("Pedido confirmado com sucesso.", "success");
    navigate("/compra-realizada");
  }

  if (!sessao) return null;

  if (itens.length === 0) {
    return (
      <div className="checkout-guard is-visible" role="status">
        Seu carrinho está vazio. Adicione itens antes de finalizar a compra.{" "}
        <Link to="/carrinho">Voltar ao carrinho</Link>.
      </div>
    );
  }

  const frete = 25;

  return (
    <div className="checkout-container">
      <section className="checkout-form">
        <span className="tag">Checkout</span>
        <h1>Finalizar compra</h1>
        <p className="checkout-lead">Revise seus dados, escolha a forma de pagamento e confirme o pedido.</p>

        <form id="checkout-form" ref={formRef} onSubmit={aoEnviar} noValidate>
          <div className="bloco">
            <h2>Informações pessoais</h2>
            <div className="linha">
              <div className="campo">
                <label htmlFor="nome">Nome completo</label>
                <input id="nome" value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Digite seu nome" required />
              </div>
              <div className="campo">
                <label htmlFor="cpf">CPF</label>
                <input id="cpf" value={form.cpf} onChange={(e) => set("cpf", formatarCpf(e.target.value))} placeholder="000.000.000-00" required />
              </div>
            </div>
            <div className="linha">
              <div className="campo">
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="seuemail@email.com" required />
              </div>
              <div className="campo">
                <label htmlFor="telefone">Telefone</label>
                <input id="telefone" value={form.telefone} onChange={(e) => set("telefone", formatarTelefone(e.target.value))} placeholder="(00) 00000-0000" required />
              </div>
            </div>
          </div>

          <div className="bloco">
            <h2>Endereço de entrega</h2>
            <div className="linha">
              <div className="campo">
                <label htmlFor="cep">CEP</label>
                <input
                  id="cep"
                  value={form.cep}
                  onChange={(e) => set("cep", formatarCep(e.target.value))}
                  onBlur={aoSairDoCep}
                  placeholder="00000-000"
                  aria-describedby="cep-feedback"
                  required
                />
                <small className={`campo-feedback${cepFeedback.tipo ? ` is-${cepFeedback.tipo}` : ""}`} id="cep-feedback">
                  {cepFeedback.msg}
                </small>
              </div>
              <div className="campo campo-grande">
                <label htmlFor="rua">Rua</label>
                <input id="rua" value={form.rua} onChange={(e) => set("rua", e.target.value)} placeholder="Nome da rua" required />
              </div>
            </div>
            <div className="linha">
              <div className="campo">
                <label htmlFor="numero">Número</label>
                <input id="numero" value={form.numero} onChange={(e) => set("numero", e.target.value)} placeholder="123" required />
              </div>
              <div className="campo">
                <label htmlFor="bairro">Bairro</label>
                <input id="bairro" value={form.bairro} onChange={(e) => set("bairro", e.target.value)} placeholder="Seu bairro" required />
              </div>
              <div className="campo">
                <label htmlFor="cidade">Cidade</label>
                <input id="cidade" value={form.cidade} onChange={(e) => set("cidade", e.target.value)} placeholder="Sua cidade" required />
              </div>
            </div>
            <div className="linha">
              <div className="campo">
                <label htmlFor="estado">Estado</label>
                <input id="estado" value={form.estado} onChange={(e) => set("estado", e.target.value)} placeholder="UF" required />
              </div>
              <div className="campo campo-grande">
                <label htmlFor="complemento">Complemento</label>
                <input id="complemento" value={form.complemento} onChange={(e) => set("complemento", e.target.value)} placeholder="Apartamento, bloco, referência..." />
              </div>
            </div>
          </div>

          <div className="bloco">
            <h2>Pagamento</h2>
            <div className="linha radios" role="radiogroup" aria-label="Forma de pagamento">
              {(["cartao", "pix", "boleto"] as FormaPagamento[]).map((forma) => (
                <label key={forma}>
                  <input
                    type="radio"
                    name="pagamento"
                    value={forma}
                    checked={pagamento === forma}
                    onChange={() => setPagamento(forma)}
                  />{" "}
                  {forma === "cartao" ? "Cartão" : forma === "pix" ? "Pix" : "Boleto"}
                </label>
              ))}
            </div>

            <div className="payment-hint" role="status">
              {DICA_PAGAMENTO[pagamento]}
            </div>

            {pagamento === "cartao" && (
              <div className="checkout-payment-group">
                <div className="linha">
                  <div className="campo">
                    <label htmlFor="cartao">Número do cartão</label>
                    <input id="cartao" value={form.cartao} onChange={(e) => set("cartao", formatarCartao(e.target.value))} placeholder="0000 0000 0000 0000" required />
                  </div>
                </div>
                <div className="linha">
                  <div className="campo">
                    <label htmlFor="validade">Validade</label>
                    <input id="validade" value={form.validade} onChange={(e) => set("validade", formatarValidade(e.target.value))} placeholder="MM/AA" required />
                  </div>
                  <div className="campo">
                    <label htmlFor="cvv">CVV</label>
                    <input id="cvv" value={form.cvv} onChange={(e) => set("cvv", somenteDigitos(e.target.value).slice(0, 4))} placeholder="123" required />
                  </div>
                  <div className="campo campo-grande">
                    <label htmlFor="titular">Nome do titular</label>
                    <input id="titular" value={form.titular} onChange={(e) => set("titular", e.target.value)} placeholder="Nome no cartão" required />
                  </div>
                </div>
              </div>
            )}

            {pagamento === "pix" && (
              <div className="checkout-payment-group">
                <div className="linha">
                  <div className="campo">
                    <label htmlFor="pix-chave">Chave Pix</label>
                    <input id="pix-chave" value={form.pixChave} onChange={(e) => set("pixChave", e.target.value)} placeholder="CPF, e-mail ou telefone" required />
                  </div>
                  <div className="campo">
                    <label htmlFor="pix-nome">Nome do pagador</label>
                    <input id="pix-nome" value={form.pixNome} onChange={(e) => set("pixNome", e.target.value)} placeholder="Nome completo" required />
                  </div>
                </div>
              </div>
            )}

            {pagamento === "boleto" && (
              <div className="checkout-payment-group">
                <div className="linha">
                  <div className="campo">
                    <label htmlFor="boleto-email">E-mail para receber o boleto</label>
                    <input id="boleto-email" type="email" value={form.boletoEmail} onChange={(e) => set("boletoEmail", e.target.value)} placeholder="seuemail@exemplo.com" required />
                  </div>
                  <div className="campo">
                    <label htmlFor="boleto-cpf">CPF do pagador</label>
                    <input id="boleto-cpf" value={form.boletoCpf} onChange={(e) => set("boletoCpf", formatarCpf(e.target.value))} placeholder="000.000.000-00" required />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </section>

      <aside className="resumo-pedido">
        <h2>Resumo do pedido</h2>
        <div id="lista-resumo">
          {itens.map((item, i) => (
            <div className="item-resumo" key={`${item.id ?? item.nome}-${i}`}>
              <img src={item.imagem} alt={item.nome} />
              <div>
                <p>{item.nome}</p>
                <small>Quantidade: {item.quantidade}</small>
                <span>{formatarPreco(Number(item.preco) * Number(item.quantidade || 1))}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="linha-resumo">
          <p>Subtotal</p>
          <span>{formatarPreco(subtotal)}</span>
        </div>
        <div className="linha-resumo">
          <p>Frete</p>
          <span>{formatarPreco(frete)}</span>
        </div>
        <div className="linha-resumo total">
          <p>Total</p>
          <span>{formatarPreco(subtotal + frete)}</span>
        </div>

        <button className="btn-confirmar" type="submit" form="checkout-form">
          Confirmar pedido
        </button>
        <Link to="/carrinho" className="voltar">
          Voltar ao carrinho
        </Link>
      </aside>
    </div>
  );
}
