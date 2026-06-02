import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { ToastProvider } from "./ToastContext";
import { AuthProvider } from "./AuthContext";
import { OrdersProvider } from "./OrdersContext";
import { CartProvider } from "./CartContext";
import { FavoritesProvider } from "./FavoritesContext";

// Ordem importa: Cart/Favorites usam Toast; Favorites usa Auth.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <OrdersProvider>
            <CartProvider>
              <FavoritesProvider>{children}</FavoritesProvider>
            </CartProvider>
          </OrdersProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
