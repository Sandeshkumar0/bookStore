import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { api } from "../lib/api";

const AuthContext = createContext(null);
const storageKey = "bookstore_session";

const readStoredSession = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || null;
  } catch {
    return null;
  }
};

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [loading, setLoading] = useState(Boolean(session?.token));

  const saveSession = (nextSession) => {
    setSession(nextSession);
    if (nextSession) localStorage.setItem(storageKey, JSON.stringify(nextSession));
    else localStorage.removeItem(storageKey);
    localStorage.removeItem("Users");
  };

  useEffect(() => {
    if (!session?.token) {
      setLoading(false);
      return;
    }

    let active = true;
    api("/user/me", { token: session.token })
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
  }, [session?.token]);

  const authenticate = async (endpoint, credentials) => {
    const nextSession = await api(`/user/${endpoint}`, {
      method: "POST",
      body: credentials,
    });
    saveSession({ token: nextSession.token, user: nextSession.user });
    return nextSession.user;
  };

  const value = useMemo(
    () => ({
      user: session?.user || null,
      token: session?.token || null,
      loading,
      login: (credentials) => authenticate("login", credentials),
      signup: (details) => authenticate("signup", details),
      logout: () => saveSession(null),
    }),
    // The actions intentionally capture the latest session setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
