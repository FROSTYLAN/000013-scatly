'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/imgs/logo.webp';
import { useNavStore } from '@/store/use-nav-store';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const { activeNavId, activePath, setActiveNavId, setActivePath, navItems, removeNavItem } = useNavStore();

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
    <div className='w-full h-12 border-b bg-muted flex items-center'>
      <div className='w-14 flex items-center justify-center flex-shrink-0 font-bold'>
       SCAT 
      </div>
      <div className='flex items-center size-full'>
        {navItems.map((item) => {
          const isActive = item.id === activeNavId && item.path === activePath;
          return (
            <Link
              key={item.id}
              href={item.path}
              scroll
              onClick={() => {
                setActiveNavId(item.id);
                setActivePath(item.path);
              }}
              className={cn(
                'relative h-full w-fit md:min-w-40 border-x flex items-center justify-start gap-2 text-muted-foreground hover:bg-background px-4',
                isActive && 'text-foreground bg-background'
              )}
            >
              <item.icon size={18} />
              <span className='text-sm pr-3'>{item.name}</span>

              {item.id !== 1 &&
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleClose(e, item);
                  }}
                  className="absolute top-3 right-2 rounded-full hover:bg-red-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-300"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              }
            </Link>
          );
        })}
      </div>
    </div>
  );
}
