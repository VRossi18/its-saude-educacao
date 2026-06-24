"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getMe,
  login as supabaseLogin,
  logout as supabaseLogout,
  mapSupabaseUser,
  signup as supabaseSignup,
} from "@/lib/supabase/auth";
import { parseApiError } from "@/lib/errors";
import { createClient } from "@/utils/supabase/client";
import type {
  AuthSession,
  AuthUser,
  LoginPayload,
  SignupPayload,
  UserProfile,
} from "@/lib/types/api";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<AuthSession>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      setUser(authUser ? mapSupabaseUser(authUser) : null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapSupabaseUser(session.user) : null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const login = useCallback(async (payload: LoginPayload) => {
    await supabaseLogin(payload);
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    return supabaseSignup(payload);
  }, []);

  const logout = useCallback(async () => {
    await supabaseLogout();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getMe();
      setUser({
        id: profile.id,
        email: profile.email,
        nome: profile.nome,
      });
      return profile;
    } catch (error) {
      throw new Error(parseApiError(error));
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      signup,
      logout,
      refreshProfile,
    }),
    [user, isLoading, login, signup, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }
  return context;
}
