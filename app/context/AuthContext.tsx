"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ADMIN_STORAGE_KEY } from "@/lib/admin";

type AuthContextType = {
  adminEmail: string | null;
  isAdmin: boolean;
  mounted: boolean;
  loginAdmin: (email: string) => void;
  logoutAdmin: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(ADMIN_STORAGE_KEY) : null;
    if (stored?.trim()) setAdminEmail(stored.trim());
    setMounted(true);
  }, []);

  const loginAdmin = (email: string) => {
    const n = email.trim().toLowerCase();
    if (!n) return;
    if (typeof window !== "undefined") localStorage.setItem(ADMIN_STORAGE_KEY, n);
    setAdminEmail(n);
  };

  const logoutAdmin = () => {
    if (typeof window !== "undefined") localStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminEmail(null);
  };

  const isAdmin = mounted && !!adminEmail;

  return (
    <AuthContext.Provider value={{ adminEmail, isAdmin, mounted, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
