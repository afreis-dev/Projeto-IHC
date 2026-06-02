// Persistência em localStorage — porta dos helpers de unidade-1/js/script.js.
// Mantém as MESMAS chaves para preservar dados de quem já usou o protótipo.

export const STORAGE_KEYS = {
  cart: "relic-cart",
  favorites: "relic-favorites",
  users: "relic-users",
  session: "relic-session",
  checkoutRedirect: "relic-checkout-redirect",
  theme: "relic-theme",
  orders: "relic-orders",
  lastOrder: "relic-last-order",
} as const;

export interface CartItem {
  id: string | null;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

export interface Favorite {
  nome: string;
  imagem: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface Session {
  id: number;
  name: string;
  email: string;
}

export type FormaPagamento = "cartao" | "pix" | "boleto";

export interface OrderItem {
  id: string | null;
  nome: string;
  imagem: string;
  preco: number;
  quantidade: number;
}

export interface Order {
  id: string;
  userEmail: string;
  createdAt: string;
  payment: FormaPagamento;
  subtotal: number;
  frete: number;
  total: number;
  items: OrderItem[];
}

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* armazenamento indisponível — ignora silenciosamente */
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignora */
  }
}
