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
    addNavItem: (item?: NavItem) => void;
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
            newId = state.navItems.length + 1;
            const newNavItems = [...state.navItems, {
                id: newId,
                name: item ? item.name : '(New project)',
                path: '/project/' + newId,
                icon: item ? File : FilePlus2,
            }];
            return { 
                navItems: newNavItems,
                activeNavId: newId
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