import { create } from 'zustand';
import { Home, FilePlus2, File } from 'lucide-react';

type NavItem = {
    id: number;
    name: string;
    path: string;
    icon: any;
};

type NavStore = {
    activeNavId: number;
    navItems: NavItem[];
    setActiveNavId: (id: number) => void;
    addNavItem: (item?: any) => number;
    removeNavItem: (item: NavItem) => void;
};

const defaultNavItems: NavItem[] = [
    {
        id: 1,
        name: 'Projects',
        path: '/',
        icon: Home,
    }
];

export const useNavStore = create<NavStore>((set) => ({
    activeNavId: 1,
    navItems: defaultNavItems,

    setActiveNavId: (id) => set({ activeNavId: id }),

    addNavItem: (item) => {
        let newId: number = 0;
        
        set((state) => {
            // Si el item tiene un ID, lo usamos; de lo contrario, generamos uno nuevo
            const itemId = item && item.id ? item.id : state.navItems.length + 1;
            newId = itemId;
            
            // Verificamos si ya existe un item con este ID
            const existingItemIndex = state.navItems.findIndex(navItem => navItem.id === itemId);
            
            // Si ya existe, solo actualizamos el activeNavId
            if (existingItemIndex !== -1) {
                return { activeNavId: itemId };
            }
            
            // Si no existe, lo añadimos
            // Determinar la ruta según si es un proyecto existente o nuevo
            const isExisting = item && item.isExisting;
            const path = isExisting ? `/project/${itemId}` : `/new/${itemId}`;
            
            const newNavItems = [...state.navItems, {
                id: itemId,
                name: item ? item.name : '(New project)',
                path: path,
                icon: item ? File : FilePlus2,
            }];
            
            return { 
                navItems: newNavItems,
                activeNavId: itemId
            };
        });

        return newId;
    },

    removeNavItem: (item) => {
        set((state) => ({
            navItems: state.navItems.filter((itemA) => itemA.id !== item.id),
            activeNavId: 1
        }))
    },
}));