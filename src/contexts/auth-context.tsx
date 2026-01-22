"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  login as loginAction,
  logout as logoutAction,
} from "@/app/actions/auth";
import {
  type User,
  type LoginCredentials,
} from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, initialUser = null }: { children: ReactNode; initialUser?: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Sync internal state with initialUser when it changes (e.g. after router.refresh())
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const checkAuth = useCallback(async () => {
    // Check auth is now primarily done via Server Components passing initialUser
    // deeper re-verification can be done here if needed.
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const result = await loginAction(credentials);

      if (result && 'error' in result) {
        throw new Error(result.error);
      }

      router.refresh();
    } catch (err: any) {
      if (err.name === 'NEXT_REDIRECT' || err.digest?.includes('NEXT_REDIRECT') || err.message === 'NEXT_REDIRECT') {
        throw err;
      }
      const errorMessage = err.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await logoutAction();
      setUser(null);
      setError(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, error, login, logout, checkAuth }),
    [user, loading, error, login, logout, checkAuth]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
