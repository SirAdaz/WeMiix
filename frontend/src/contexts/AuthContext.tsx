"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  BASE_URL,
  clearTokens,
  fetchWithAuth,
  getAccessToken,
  isGuestMode,
  saveTokens,
  setGuestMode,
  type User,
} from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, username: string) => Promise<void>;
  loginWithSpotify: () => void;
  logout: () => Promise<void>;
  isGuest: boolean;
  setIsGuest: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  login: async () => {},
  loginWithSpotify: () => {},
  logout: async () => {},
  isGuest: false,
  setIsGuest: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuestState] = useState(false);

  const setIsGuest = useCallback((value: boolean) => {
    setGuestMode(value);
    setIsGuestState(value);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetchWithAuth("/api/auth/me");
      if (res.ok) {
        const data = (await res.json()) as User;
        setUser(data);
      } else {
        clearTokens();
      }
    } catch {
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsGuestState(isGuestMode());
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = useCallback(async (email: string, username: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(data.message ?? `Erreur ${res.status}`);
    }

    const data = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
      user: User;
    };

    saveTokens(data.accessToken, data.refreshToken);
    setGuestMode(false);
    setIsGuestState(false);
    setUser(data.user);
  }, []);

  const loginWithSpotify = useCallback(() => {
    void (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/auth/spotify/authorize`);
        if (!res.ok) throw new Error("Impossible de contacter Spotify");
        const data = (await res.json()) as { url: string };
        window.location.href = data.url;
      } catch (err) {
        console.error("loginWithSpotify:", err);
      }
    })();
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetchWithAuth("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore errors on logout
    } finally {
      clearTokens();
      setGuestMode(false);
      setUser(null);
      setIsGuestState(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, loginWithSpotify, logout, isGuest, setIsGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
