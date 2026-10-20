"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { apiFetch, ApiError } from "./api";

/**
 * AUTH_LOADING -> AUTHENTICATED / UNAUTHENTICATED
 * Single source of truth for the session so the header and pages never show
 * Login/Register while authentication is still being checked.
 */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthUser {
  _id: string;
  username: string;
  email?: string;
  age?: number;
  gender?: string;
}

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await apiFetch<any>("/api/auth/user");
      if (data?._id) {
        setUser({ _id: String(data._id), username: data.username, email: data.email, age: data.age, gender: data.gender });
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("unauthenticated");
      }
    } catch (error) {
      // 401/404 -> not signed in; network errors -> treat as signed out too
      // (never leave the app stuck on the auth loader).
      if (mounted.current) {
        setUser(null);
        setStatus("unauthenticated");
      }
      if (!(error instanceof ApiError)) {
        console.error("Auth check failed:", error);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* cookie may already be gone */
    }
    if (mounted.current) {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ status, user, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
