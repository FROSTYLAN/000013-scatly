'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useNavStore } from '@/store/use-nav-store';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { activeNavId, activePath, setActiveNavId, setActivePath, navItems, removeNavItem } = useNavStore();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleClose = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (item.id === 1) {
      return;
    }
    removeNavItem(item);
    setActiveNavId(1);
    setActivePath('/');
    router.replace('/');
  };
  return (
    <div className='w-full h-12 border-b bg-muted flex items-center justify-between'>
      <div className='flex items-center'>
        <div className='w-14 flex items-center justify-center flex-shrink-0 font-bold'>
          SCAT 
        </div>
        <div className='flex items-center'>
        {navItems.map((item) => {
          const isActive = item.id === activeNavId && item.path === activePath;
          return (
            <div key={item.id} className="relative group">
              <Link
                href={item.path}
                scroll
                onClick={() => {
                  setActiveNavId(item.id);
                  setActivePath(item.path);
                }}
                className={cn(
                  'relative h-12 w-fit min-w-32 max-w-48 border-x flex items-center justify-start gap-2 text-muted-foreground hover:bg-background px-3 transition-colors duration-200',
                  isActive && 'text-foreground bg-background'
                )}
              >
                <item.icon size={16} className="flex-shrink-0" />
                <span className='text-sm truncate flex-1 min-w-0'>{item.name}</span>
                
                {/* Espacio para el botón de cerrar */}
                {item.id !== 1 && <div className="w-6 flex-shrink-0" />}
              </Link>
              
              {/* Botón de cerrar posicionado absolutamente */}
              {item.id !== 1 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClose(e, item);
                  }}
                  className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  title="Cerrar pestaña"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          );
        })}
        </div>
      </div>
      
      {/* Sección de autenticación */}
      <div className='flex items-center pr-4'>
        {user ? (
          <div className='relative'>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className='flex items-center gap-2 px-3 py-1 rounded-md hover:bg-background'
            >
              <span className='text-sm font-medium'>{user.username}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              </svg>
            </button>
            
            {showUserMenu && (
              <div className='absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg py-1 z-10'>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className='block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-muted'
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <Link 
              href='/login'
              className='text-sm px-3 py-1 rounded-md hover:bg-background'
            >
              Iniciar sesión
            </Link>
            <Link 
              href='/register'
              className='text-sm px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
