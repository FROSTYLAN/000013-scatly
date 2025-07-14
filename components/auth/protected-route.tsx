'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      console.log('🔒 ProtectedRoute - Verificando autenticación...');
      console.log('🔒 ProtectedRoute - Token en localStorage:', !!token);
      console.log('🔒 ProtectedRoute - Usuario en contexto:', !!user);
      
      if (!token && !loading) {
        console.log('❌ ProtectedRoute - No hay token, redirigiendo al login');
        const currentPath = window.location.pathname;
        router.push(`/login?from=${encodeURIComponent(currentPath)}`);
        return;
      }
      
      setIsChecking(false);
    };

    // Pequeño delay para asegurar que el contexto de auth se haya inicializado
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [user, loading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Si hay token, mostrar el contenido
  const token = localStorage.getItem('auth_token');
  if (token) {
    return <>{children}</>;
  }

  // Si no hay token, no mostrar nada (se está redirigiendo)
  return null;
}