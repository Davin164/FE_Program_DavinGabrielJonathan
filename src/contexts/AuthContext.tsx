import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Role } from '../types';
import { STORAGE_KEYS } from '../constants';
import api from '../lib/axios';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: Role | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    nim?: string;
    phone?: string;
    division_id?: string;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  refetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cachedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to store tokens and user
  const setAuthData = (token: string, refreshToken?: string, userData?: User) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    if (refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    if (userData) {
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    }
  };

  // Helper to clear tokens and user
  const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  // Fetch current user from /auth/me
  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      const userData = response.data.data || response.data;
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } catch (error) {
      console.warn('Failed to fetch current user profile:', error);
      // If 401 or invalid token, axios interceptor handles or token removed
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    // Listen for Supabase OAuth redirect if applicable
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          // Exchange Supabase token with our backend
          const res = await api.post('/auth/google', {
            supabase_token: session.access_token,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          });
          const authPayload = res.data.data || res.data;
          setAuthData(
            authPayload.access_token || session.access_token,
            authPayload.refresh_token,
            authPayload.user
          );
          toast.success('Logged in with Google successfully!');
        } catch {
          // Fallback if backend does not yet support /auth/google endpoint:
          // Synthesize user object from Supabase session
          const fallbackUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Member',
            role: 'MEMBER',
            created_at: session.user.created_at,
          };
          setAuthData(session.access_token, session.refresh_token || '', fallbackUser);
          toast.success('Signed in via Google account');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { data } = response.data;
      const token = data.access_token || data.token;
      const refreshToken = data.refresh_token;
      const userData: User = data.user;

      setAuthData(token, refreshToken, userData);
      toast.success(`Welcome back, ${userData.name}!`);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    nim?: string;
    phone?: string;
    division_id?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', payload);
      const { data } = response.data;
      const token = data.access_token || data.token;
      const refreshToken = data.refresh_token;
      const userData: User = data.user;

      setAuthData(token, refreshToken, userData);
      toast.success('Registration successful! Welcome to GDGoC UNSRI.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google OAuth failed';
      toast.error(msg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout').catch(() => {});
      await supabase.auth.signOut().catch(() => {});
    } finally {
      clearAuthData();
      toast.info('You have been logged out.');
      window.location.href = '/login';
    }
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUser,
        refetchUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
