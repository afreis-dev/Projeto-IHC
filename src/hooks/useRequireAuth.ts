import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/** Garante sessão ativa; senão avisa e redireciona para /entrar. */
export function useRequireAuth(mensagem: string): boolean {
  const { sessao } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessao) {
      showToast(mensagem, "info");
      navigate("/entrar", { replace: true });
    }
  }, [sessao, mensagem, showToast, navigate]);

  return Boolean(sessao);
}
