"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<any>(null);

  // ✅ load from storage on refresh
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) setAuth(JSON.parse(saved));
  }, []);

  // ✅ save whenever auth changes
  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
