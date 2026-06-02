import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type TipoToast = "success" | "error" | "info";

interface Toast {
  id: number;
  mensagem: string;
  tipo: TipoToast;
  titulo: string;
}

interface ToastContextValue {
  showToast: (mensagem: string, tipo?: TipoToast) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TITULOS: Record<TipoToast, string> = {
  success: "Tudo certo",
  error: "Algo deu errado",
  info: "Aviso",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const proximoId = useRef(1);
  const prefereMenosMovimento = useReducedMotion();

  const remover = useCallback((id: number) => {
    setToasts((atual) => atual.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (mensagem: string, tipo: TipoToast = "success") => {
      const id = proximoId.current++;
      setToasts((atual) => [...atual, { id, mensagem, tipo, titulo: TITULOS[tipo] }]);
      window.setTimeout(() => remover(id), 3000);
    },
    [remover]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Região aria-live: feedback acessível anunciado por leitores de tela (Unidade 2) */}
      <div className="toast-container" role="region" aria-label="Notificações" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`toast toast-${toast.tipo}`}
              role="status"
              initial={prefereMenosMovimento ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefereMenosMovimento ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
            >
              <strong>{toast.titulo}</strong>
              <span>{toast.mensagem}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de <ToastProvider>");
  return ctx;
}
