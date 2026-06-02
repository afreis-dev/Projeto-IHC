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
  removeKey,
  type Session,
  type User,
} from "../lib/storage";
import { normalizarTexto } from "../data/products";

interface RegistroDados {
  name: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  sessao: Session | null;
  /** Tenta autenticar; retorna o usuário ou null se inválido. */
  login: (email: string, senha: string) => Session | null;
  /** Cria conta e já abre sessão; retorna ok/mensagem de erro. */
  registrar: (dados: RegistroDados) => { ok: boolean; mensagem?: string };
  logout: () => void;
  definirRedirect: (destino: string) => void;
  consumirRedirect: () => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Session | null>(() =>
    readJson<Session | null>(STORAGE_KEYS.session, null)
  );

  const login = useCallback((email: string, senha: string): Session | null => {
    const usuarios = readJson<User[]>(STORAGE_KEYS.users, []);
    const usuario = usuarios.find(
      (u) => normalizarTexto(u.email) === normalizarTexto(email) && u.password === senha
    );
    if (!usuario) return null;

    const nova: Session = { id: usuario.id, name: usuario.name, email: usuario.email };
    writeJson(STORAGE_KEYS.session, nova);
    setSessao(nova);
    return nova;
  }, []);

  const registrar = useCallback((dados: RegistroDados) => {
    const usuarios = readJson<User[]>(STORAGE_KEYS.users, []);
    const email = normalizarTexto(dados.email);
    if (usuarios.some((u) => normalizarTexto(u.email) === email)) {
      return { ok: false, mensagem: "Já existe uma conta cadastrada com este e-mail." };
    }

    const novo: User = {
      id: Date.now(),
      name: dados.name.trim(),
      email: dados.email.trim(),
      password: dados.password,
    };
    usuarios.push(novo);
    writeJson(STORAGE_KEYS.users, usuarios);

    const nova: Session = { id: novo.id, name: novo.name, email: novo.email };
    writeJson(STORAGE_KEYS.session, nova);
    setSessao(nova);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    removeKey(STORAGE_KEYS.session);
    setSessao(null);
  }, []);

  const definirRedirect = useCallback((destino: string) => {
    writeJson(STORAGE_KEYS.checkoutRedirect, destino);
  }, []);

  const consumirRedirect = useCallback((): string | null => {
    const destino = readJson<string | null>(STORAGE_KEYS.checkoutRedirect, null);
    removeKey(STORAGE_KEYS.checkoutRedirect);
    return destino;
  }, []);

  const value = useMemo(
    () => ({ sessao, login, registrar, logout, definirRedirect, consumirRedirect }),
    [sessao, login, registrar, logout, definirRedirect, consumirRedirect]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
