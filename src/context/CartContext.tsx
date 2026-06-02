import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS, readJson, writeJson, removeKey, type CartItem } from "../lib/storage";
import {
  buscarProdutoPorId,
  buscarProdutoPorNome,
  obterEstoque,
  type Product,
} from "../data/products";
import { useToast } from "./ToastContext";

interface CartContextValue {
  itens: CartItem[];
  adicionar: (produto: Product) => boolean;
  removerItem: (index: number) => CartItem | null;
  inserirItem: (index: number, item: CartItem) => void;
  definirQuantidade: (index: number, quantidade: number) => void;
  alterarQuantidade: (index: number, variacao: number) => void;
  limpar: () => void;
  total: number;
  subtotal: number;
  quantidadeDe: (produtoId: string | null) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

function estoqueDoItem(item: CartItem): number {
  const produto = item.id ? buscarProdutoPorId(item.id) : buscarProdutoPorNome(item.nome);
  return obterEstoque(produto);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [itens, setItens] = useState<CartItem[]>(() =>
    readJson<CartItem[]>(STORAGE_KEYS.cart, [])
  );

  const aplicar = useCallback((novo: CartItem[]) => {
    setItens(novo);
    writeJson(STORAGE_KEYS.cart, novo);
  }, []);

  const quantidadeDe = useCallback(
    (produtoId: string | null) =>
      itens
        .filter((item) => item.id === produtoId)
        .reduce((soma, item) => soma + Number(item.quantidade || 1), 0),
    [itens]
  );

  const adicionar = useCallback(
    (produto: Product): boolean => {
      const estoque = obterEstoque(produto);
      const carrinho = readJson<CartItem[]>(STORAGE_KEYS.cart, []);
      const noCarrinho = carrinho
        .filter((item) => item.id === produto.id)
        .reduce((soma, item) => soma + Number(item.quantidade || 1), 0);

      if (estoque > 0 && noCarrinho >= estoque) {
        showToast(`Não há mais unidades disponíveis de ${produto.title}.`, "error");
        return false;
      }

      const existente = carrinho.find((item) => item.id === produto.id);
      if (existente) {
        existente.quantidade += 1;
      } else {
        carrinho.push({
          id: produto.id,
          nome: produto.title,
          preco: produto.price,
          imagem: produto.image,
          quantidade: 1,
        });
      }

      aplicar([...carrinho]);
      showToast(`${produto.title} foi adicionado ao carrinho.`, "success");
      return true;
    },
    [aplicar, showToast]
  );

  const removerItem = useCallback(
    (index: number): CartItem | null => {
      const removido = itens[index] ?? null;
      aplicar(itens.filter((_, i) => i !== index));
      return removido;
    },
    [itens, aplicar]
  );

  const inserirItem = useCallback(
    (index: number, item: CartItem) => {
      const novo = [...itens];
      novo.splice(index, 0, item);
      aplicar(novo);
    },
    [itens, aplicar]
  );

  const definirQuantidade = useCallback(
    (index: number, quantidade: number) => {
      const item = itens[index];
      if (!item) return;
      const estoque = estoqueDoItem(item);
      const qtd = Math.max(1, Number(quantidade || 1));
      if (estoque > 0 && qtd > estoque) {
        showToast(`O limite para ${item.nome} é ${estoque} unidade(s).`, "error");
        return;
      }
      const novo = itens.map((it, i) => (i === index ? { ...it, quantidade: qtd } : it));
      aplicar(novo);
    },
    [itens, aplicar, showToast]
  );

  const alterarQuantidade = useCallback(
    (index: number, variacao: number) => {
      const item = itens[index];
      if (!item) return;
      definirQuantidade(index, Number(item.quantidade || 1) + variacao);
    },
    [itens, definirQuantidade]
  );

  const limpar = useCallback(() => {
    setItens([]);
    removeKey(STORAGE_KEYS.cart);
  }, []);

  const subtotal = useMemo(
    () => itens.reduce((soma, item) => soma + Number(item.preco) * Number(item.quantidade || 1), 0),
    [itens]
  );

  const total = useMemo(
    () => itens.reduce((soma, item) => soma + Number(item.quantidade || 1), 0),
    [itens]
  );

  const value = useMemo(
    () => ({
      itens,
      adicionar,
      removerItem,
      inserirItem,
      definirQuantidade,
      alterarQuantidade,
      limpar,
      total,
      subtotal,
      quantidadeDe,
    }),
    [
      itens,
      adicionar,
      removerItem,
      inserirItem,
      definirQuantidade,
      alterarQuantidade,
      limpar,
      total,
      subtotal,
      quantidadeDe,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
