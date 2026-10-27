import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { api } from "../lib/api";
import type { AuthResponse, Session, User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  signup: (details: { fullname: string; email: string; password: string }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = "bookstore_session";

function readStoredSession(): Session | null {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "null") as Session | null;
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readStoredSession);
  const [loading, setLoading] = useState(Boolean(session?.token));

  const saveSession = useCallback((nextSession: Session | null) => {
    setSession(nextSession);
    if (nextSession) localStorage.setItem(storageKey, JSON.stringify(nextSession));
    else localStorage.removeItem(storageKey);
    localStorage.removeItem("Users");
  }, []);

  useEffect(() => {
    if (!session?.token) {
      setLoading(false);
      return;
    }

    let active = true;
    api<{ user: User }>("/user/me", { token: session.token })
      .then(({ user }) => {
        if (active) saveSession({ token: session.token, user });
      })
      .catch(() => {
        if (active) saveSession(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [saveSession, session?.token]);

  const authenticate = useCallback(
    async (endpoint: "login" | "signup", credentials: object) => {
      const response = await api<AuthResponse>(`/user/${endpoint}`, {
        method: "POST",
        body: credentials,
      });
      saveSession({ token: response.token, user: response.user });
      return response.user;
    },
    [saveSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user || null,
      token: session?.token || null,
      loading,
      login: (credentials) => authenticate("login", credentials),
      signup: (details) => authenticate("signup", details),
      logout: () => saveSession(null),
    }),
    [authenticate, loading, saveSession, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
