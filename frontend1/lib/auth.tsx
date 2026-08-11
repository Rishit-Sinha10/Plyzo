"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
export type AppUser = {
  name: string;
  email: string;
  role?: "admin" | "member";
};
type AuthContextValue = {
  currentUser: AppUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(false);
  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      loading,
      login: async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 250));
        setCurrentUser({
          name: "Plyzo Member",
          email: "member@plyzo.app",
          role: "member",
        });
        setLoading(false);
      },
      logout: async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 150));
        setCurrentUser(null);
        setLoading(false);
      },
    }),
    [currentUser, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: null,
      loading: false,
      login: async () => {},
      logout: async () => {},
    } satisfies AuthContextValue;
  }

  return context;
}
export function authErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Authentication failed";
}
