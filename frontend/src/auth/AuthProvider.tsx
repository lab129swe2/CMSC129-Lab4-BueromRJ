import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { firebaseAuth } from "./firebase";

type AuthContextValue = {
  idToken: string | null;
  user: User | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setIdToken(null);
        return;
      }
      setIdToken(await nextUser.getIdToken());
    });
  }, []);

  const value = useMemo(() => ({ idToken, user }), [idToken, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

