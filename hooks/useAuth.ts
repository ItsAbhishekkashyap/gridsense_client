'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, createElement } from 'react';
import { User, AuthContextType } from '../types';
import { loginUser, signupUser, logoutUser, tryRefreshToken } from '../lib/auth';
import { setAccessToken, getAccessToken } from '../lib/api';
import { disconnectSocket } from '../lib/socket';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const result = await tryRefreshToken();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);

        const expiry = getTokenExpiry(result.accessToken);
        scheduleRefresh(expiry);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  function getTokenExpiry(token: string): number {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch {
      return Date.now() + 15 * 60 * 1000;
    }
  }

  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  function scheduleRefresh(expiry: number) {
    if (refreshTimer) clearTimeout(refreshTimer);
    const delay = expiry - Date.now() - 60 * 1000;
    if (delay > 0) {
      refreshTimer = setTimeout(async () => {
        const result = await tryRefreshToken();
        if (result) {
          setUser(result.user);
          setToken(result.accessToken);
          scheduleRefresh(getTokenExpiry(result.accessToken));
        }
      }, delay);
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser(email, password);
    setUser(result.user);
    setToken(result.accessToken);
    scheduleRefresh(getTokenExpiry(result.accessToken));
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const result = await signupUser(name, email, password);
    setUser(result.user);
    setToken(result.accessToken);
    scheduleRefresh(getTokenExpiry(result.accessToken));
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setToken(null);
    disconnectSocket();
    if (refreshTimer) clearTimeout(refreshTimer);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const result = await tryRefreshToken();
    if (result) {
      setUser(result.user);
      setToken(result.accessToken);
      return result.accessToken;
    }
    return null;
  }, []);

  return createElement(
    AuthContext.Provider,
    { value: { user, accessToken, isLoading, login, signup, logout, refreshAccessToken } },
    children
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
