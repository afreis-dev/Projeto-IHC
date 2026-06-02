import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/**
 * Garante sessão ativa; senão avisa e redireciona para /entrar.
 * `ativo` permite desligar o redirecionamento (ex.: após apagar os dados).
 */
export function useRequireAuth(mensagem: string, ativo = true): boolean {
  const { sessao } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (ativo && !sessao) {
      showToast(mensagem, "info");
      navigate("/entrar", { replace: true });
    }
  }, [sessao, mensagem, ativo, showToast, navigate]);

  return Boolean(sessao);
}
