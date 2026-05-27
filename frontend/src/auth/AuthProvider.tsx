import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onIdTokenChanged, type User } from "firebase/auth";
import { firebaseAuth } from "./firebase";

type AuthContextValue = {
  ready: boolean;
  idToken: string | null;
  user: User | null;
  refreshProfile: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [profileVersion, setProfileVersion] = useState(0);

  useEffect(() => {
    return onIdTokenChanged(firebaseAuth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setIdToken(null);
        setReady(true);
        return;
      }
      setIdToken(await nextUser.getIdToken());
      setReady(true);
    });
  }, []);

  function refreshProfile() {
    setProfileVersion((current) => current + 1);
  }

  const value = useMemo(
    () => ({ ready, idToken, user, refreshProfile }),
    [idToken, profileVersion, ready, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
