import { useEffect } from "react";

/** Atualiza o título da aba por rota (acessibilidade / orientação — WCAG 2.4.2). */
export function useDocumentTitle(titulo: string): void {
  useEffect(() => {
    document.title = titulo;
  }, [titulo]);
}
