'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserResponse } from '@/types/user-types';

interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated when page loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 useAuth - Verificando autenticación...');
        
        // Obtener token de localStorage
        const token = localStorage.getItem('auth_token');
        console.log('🔍 useAuth - Token en localStorage:', !!token);
        
        if (!token) {
          console.log('❌ useAuth - No hay token en localStorage');
          setUser(null);
          setLoading(false);
          return;
        }
        
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('📡 useAuth - Respuesta recibida:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ useAuth - Datos recibidos:', data.success);
          if (data.success) {
            setUser(data.user);
            console.log('👤 useAuth - Usuario autenticado:', data.user.email);
          } else {
            console.log('❌ useAuth - Token inválido, limpiando localStorage');
            localStorage.removeItem('auth_token');
            setUser(null);
            // Solo redirigir si estamos en una ruta protegida
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
              router.push('/login');
            }
          }
        } else {
          console.log('❌ useAuth - Error en la respuesta:', response.status);
          localStorage.removeItem('auth_token');
          setUser(null);
          // Solo redirigir si estamos en una ruta protegida
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
            router.push('/login');
          }
        }
      } catch (err) {
        console.error('❌ useAuth - Error checking authentication:', err);
        localStorage.removeItem('auth_token');
        setUser(null);
        // Solo redirigir si estamos en una ruta protegida
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Function to login
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('📥 useAuth - Respuesta del login:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error logging in');
      }

      // Verificar que el token existe
      if (!data.token) {
        console.error('❌ useAuth - No se recibió token del servidor');
        throw new Error('No se recibió token del servidor');
      }

      // Guardar token en localStorage
      console.log('💾 useAuth - Guardando token en localStorage:', data.token.substring(0, 20) + '...');
      localStorage.setItem('auth_token', data.token);
      
      // Verificar que se guardó correctamente
      const savedToken = localStorage.getItem('auth_token');
      console.log('✅ useAuth - Token guardado verificado:', savedToken ? savedToken.substring(0, 20) + '...' : 'NO ENCONTRADO');
      
      setUser(data.user);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  // Function to register a new user
  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();
      console.log('📥 useAuth - Respuesta del registro:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error registering user');
      }

      // Verificar que el token existe
      if (!data.token) {
        console.error('❌ useAuth - No se recibió token del servidor en registro');
        throw new Error('No se recibió token del servidor');
      }

      // Guardar token en localStorage
      console.log('💾 useAuth - Guardando token en localStorage después del registro:', data.token.substring(0, 20) + '...');
      localStorage.setItem('auth_token', data.token);
      
      // Verificar que se guardó correctamente
      const savedToken = localStorage.getItem('auth_token');
      console.log('✅ useAuth - Token guardado verificado en registro:', savedToken ? savedToken.substring(0, 20) + '...' : 'NO ENCONTRADO');
      
      // Establecer usuario
      setUser(data.user);
      
      // Redirigir a la página principal
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error registering user');
    } finally {
      setLoading(false);
    }
  };

  // Function to logout
  const logout = async () => {
    setLoading(true);

    try {
      // Eliminar token de localStorage
      console.log('🗑️ useAuth - Eliminando token de localStorage');
      localStorage.removeItem('auth_token');
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error logging out');
      }

      setUser(null);
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error logging out');
    } finally {
      setLoading(false);
    }
  };

  // Function to clear errors
  const clearError = () => {
    setError(null);
  };

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError
      }
    },
    children
  );
}

// Custom hook to use the authentication context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}