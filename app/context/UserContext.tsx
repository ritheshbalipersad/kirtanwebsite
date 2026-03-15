"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export type User = {
  id: string;
  email: string;
  username: string;
  name: string;
  surname: string;
  birthDate?: string | null;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUser(null);
        return;
      }
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut({ redirect: false });
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, logout, refresh }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const c = useContext(UserContext);
  if (!c) throw new Error("useUser must be used within UserProvider");
  return c;
}
