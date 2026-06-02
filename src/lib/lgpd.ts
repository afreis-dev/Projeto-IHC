// LGPD — exportação dos dados pessoais simulados (localStorage).
// O apagamento é coordenado pelos contexts (storage + estado em memória).
// Por minimização, a exportação NÃO inclui a senha simulada.

import {
  STORAGE_KEYS,
  readJson,
  type CartItem,
  type Favorite,
  type Order,
  type Session,
  type User,
} from "./storage";

export interface DadosExportados {
  geradoEm: string;
  observacao: string;
  conta: { name: string; email: string } | null;
  favoritos: Favorite[];
  carrinho: CartItem[];
  pedidos: Order[];
  ultimoPedido: Order | null;
}

/** Lê todas as informações pessoais guardadas neste navegador. */
export function coletarDados(): DadosExportados {
  const sessao = readJson<Session | null>(STORAGE_KEYS.session, null);
  const usuarios = readJson<User[]>(STORAGE_KEYS.users, []);
  const registro = sessao ? usuarios.find((u) => u.email === sessao.email) : undefined;
  const conta = registro
    ? { name: registro.name, email: registro.email }
    : sessao
      ? { name: sessao.name, email: sessao.email }
      : null;

  return {
    geradoEm: new Date().toISOString(),
    observacao:
      "Dados simulados do protótipo RELIC, armazenados apenas neste navegador (localStorage). A senha não é exportada.",
    conta,
    favoritos: readJson<Favorite[]>(STORAGE_KEYS.favorites, []),
    carrinho: readJson<CartItem[]>(STORAGE_KEYS.cart, []),
    pedidos: readJson<Order[]>(STORAGE_KEYS.orders, []),
    ultimoPedido: readJson<Order | null>(STORAGE_KEYS.lastOrder, null),
  };
}

/** Gera e baixa um arquivo JSON com os dados do titular (direito de portabilidade). */
export function exportarDados(): void {
  const dados = coletarDados();
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "meus-dados-relic.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
