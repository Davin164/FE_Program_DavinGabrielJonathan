import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Role } from '../types';
import { STORAGE_KEYS } from '../constants';
import { supabase } from '../lib/supabase';
import { supabaseService } from '../services/supabaseService';
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
        const parsed = JSON.parse(cachedUser);
        // Otomatis hapus sesi lama (@gdgoc.unsri.ac.id) agar tidak terjadi konflik ID di database
        if (parsed?.email?.includes('@gdgoc.unsri.ac.id')) {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  const fetchCurrentUser = useCallback(async () => {
    const cached = localStorage.getItem(STORAGE_KEYS.USER);
    if (!cached) {
      setIsLoading(false);
      return;
    }

    try {
      const parsed: User = JSON.parse(cached);
      if (parsed.id) {
        const freshUser = await supabaseService.auth.getMe(parsed.id);
        setUser(freshUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(freshUser));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('not found') || msg.includes('inactive')) {
        clearAuthData();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    // Listener login OAuth Google
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select('*, division:divisions(id, name)')
            .eq('email', session.user.email)
            .maybeSingle();

          let appUser: User;
          if (existingUser) {
            appUser = {
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              role: existingUser.role as Role,
              division_id: existingUser.division_id,
              division_name: existingUser.division?.name || null,
              nim: existingUser.nim,
              phone: existingUser.phone,
              created_at: existingUser.created_at,
              updated_at: existingUser.updated_at,
            };
          } else {
            // User Google baru otomatis terdaftar sebagai MEMBER
            const { data: newUser } = await supabase
              .from('users')
              .insert({
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
                password_hash: 'GOOGLE_OAUTH_LOGIN',
                role: 'MEMBER',
              })
              .select('*, division:divisions(id, name)')
              .single();

            appUser = {
              id: newUser?.id || session.user.id,
              email: newUser?.email || session.user.email,
              name: newUser?.name || 'Member',
              role: (newUser?.role as Role) || 'MEMBER',
              division_id: newUser?.division_id,
              division_name: newUser?.division?.name || null,
              created_at: newUser?.created_at || session.user.created_at,
            };
          }

          setAuthData(session.access_token, session.refresh_token, appUser);
          toast.success(`Signed in with Google as ${appUser.name}`);
        } catch (err: unknown) {
          console.error('Google OAuth sync error:', err);
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
      const { user: userData, token } = await supabaseService.auth.login(email, password);
      setAuthData(token, undefined, userData);
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
      const { user: userData, token } = await supabaseService.auth.register(payload);
      setAuthData(token, undefined, userData);
      toast.success('Registration successful! Welcome to GDGoC UNSRI.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google login failed';
      toast.error(msg);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    clearAuthData();
    await supabase.auth.signOut().catch(() => {});
    toast.success('You have been signed out.');
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merged));
  };

  const refetchUser = async () => {
    if (!user?.id) return;
    try {
      const freshUser = await supabaseService.auth.getMe(user.id);
      setUser(freshUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(freshUser));
    } catch (error) {
      console.warn('Failed to refetch user:', error);
    }
  };

  const isAuthenticated = Boolean(user && localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
  const role: Role | null = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        role,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUser,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
