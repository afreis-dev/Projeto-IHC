import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  STORAGE_KEYS,
  readJson,
  writeJson,
  type CartItem,
  type FormaPagamento,
  type Order,
  type Session,
} from "../lib/storage";

interface OrdersContextValue {
  ultimoPedido: Order | null;
  registrarPedido: (
    itens: CartItem[],
    sessao: Session | null,
    pagamento: FormaPagamento
  ) => Order;
  pedidosDoUsuario: (email: string) => Order[];
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [ultimoPedido, setUltimoPedido] = useState<Order | null>(() =>
    readJson<Order | null>(STORAGE_KEYS.lastOrder, null)
  );

  const registrarPedido = useCallback(
    (itens: CartItem[], sessao: Session | null, pagamento: FormaPagamento): Order => {
      const subtotal = itens.reduce(
        (total, item) => total + Number(item.preco) * Number(item.quantidade || 1),
        0
      );
      const frete = itens.length > 0 ? 25 : 0;
      const pedido: Order = {
        id: `pedido-${Date.now()}`,
        userEmail: sessao?.email || "",
        createdAt: new Date().toISOString(),
        payment: pagamento,
        subtotal,
        frete,
        total: subtotal + frete,
        items: itens.map((item) => ({
          id: item.id,
          nome: item.nome,
          imagem: item.imagem,
          preco: Number(item.preco),
          quantidade: Number(item.quantidade || 1),
        })),
      };

      const pedidos = readJson<Order[]>(STORAGE_KEYS.orders, []);
      pedidos.unshift(pedido);
      writeJson(STORAGE_KEYS.orders, pedidos);
      writeJson(STORAGE_KEYS.lastOrder, pedido);
      setUltimoPedido(pedido);
      return pedido;
    },
    []
  );

  const pedidosDoUsuario = useCallback((email: string): Order[] => {
    return readJson<Order[]>(STORAGE_KEYS.orders, []).filter((p) => p.userEmail === email);
  }, []);

  const value = useMemo(
    () => ({ ultimoPedido, registrarPedido, pedidosDoUsuario }),
    [ultimoPedido, registrarPedido, pedidosDoUsuario]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders precisa estar dentro de <OrdersProvider>");
  return ctx;
}
