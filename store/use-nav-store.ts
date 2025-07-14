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
    activePath: string;
    navItems: NavItem[];
    setActiveNavId: (id: number) => void;
    setActivePath: (path: string) => void;
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
    activePath: '/',
    navItems: defaultNavItems,

    setActiveNavId: (id) => set({ activeNavId: id }),
    setActivePath: (path) => set({ activePath: path }),

    addNavItem: (item) => {
        let newId: number = 0;
        
        set((state) => {
            // Si el item tiene un ID específico, lo usamos; de lo contrario, generamos uno nuevo
            let itemId: number;
            
            if (item && item.id === 0) {
                // Para nuevos proyectos, generar un ID negativo único
                // Encontrar el ID negativo más bajo (más negativo) actualmente en uso
                const negativeIds = state.navItems
                    .map(item => item.id)
                    .filter(id => id < 0);
                
                // Si no hay IDs negativos, comenzar con -1, de lo contrario usar el siguiente número
                itemId = negativeIds.length > 0 ? Math.min(...negativeIds) - 1 : -1;
                
                // Crear el nuevo item para el proyecto nuevo
                const newNavItems = [...state.navItems, {
                    id: itemId,
                    name: item ? item.name : '(New project)',
                    path: `/new/${Math.abs(itemId)}`,
                    icon: FilePlus2,
                }];
                
                newId = itemId;
                
                return { 
                    navItems: newNavItems,
                    activeNavId: itemId,
                    activePath: `/new/${Math.abs(itemId)}`
                };
            } else {
                // Si es un proyecto existente o tiene un ID específico
                itemId = item && item.id ? item.id : state.navItems.length + 1;
                newId = itemId;
                
                // Verificamos si ya existe un item con este ID
                const existingItemIndex = state.navItems.findIndex(navItem => navItem.id === itemId);
                
                // Si ya existe, verificamos si la ruta es diferente
                if (existingItemIndex !== -1) {
                    const existingItem = state.navItems[existingItemIndex];
                    const newPath = item && item.isExisting 
                        ? `/project/${itemId}` 
                        : `/new/${Math.abs(itemId)}`;
                    
                    // Si la ruta es la misma, solo actualizamos el activeNavId
                    if (existingItem.path === newPath) {
                        return { 
                            activeNavId: itemId,
                            activePath: newPath 
                        };
                    }
                    
                    // Si la ruta es diferente, creamos un nuevo elemento
                    if (!item || !item.isExisting) {
                        // Para proyectos nuevos, generamos un ID único para evitar conflictos
                        itemId = state.navItems.length + 1;
                        while (state.navItems.findIndex(navItem => navItem.id === itemId) !== -1) {
                            itemId++;
                        }
                    }
                    // Para proyectos existentes (item.isExisting = true), mantenemos el ID original
                }
                
                // Si no existe, lo añadimos
                // Determinar la ruta según si es un proyecto existente o nuevo
                const path = item && item.isExisting 
                    ? `/project/${itemId}` 
                    : `/new/${Math.abs(itemId)}`;
                
                const newNavItems = [...state.navItems, {
                    id: itemId,
                    name: item ? item.name : '(New project)',
                    path: path,
                    icon: item ? File : FilePlus2,
                }];
                
                return { 
                    navItems: newNavItems,
                    activeNavId: itemId,
                    activePath: path
                };
            }
        });

        return newId;
    },

    removeNavItem: (item) => {
        if (!item || typeof item.id === 'undefined' || !item.path) {
            console.error('Intento de eliminar un elemento de navegación inválido:', item);
            return;
        }
        
        set((state) => {
            // Verificar si el elemento existe antes de intentar eliminarlo
            const itemExists = state.navItems.some(navItem => 
                navItem.id === item.id && navItem.path === item.path
            );
            
            if (!itemExists) {
                console.warn('Intento de eliminar un elemento de navegación que no existe:', item.id, item.path);
                return state; // No modificar el estado si el elemento no existe
            }
            
            // Eliminar el elemento específico que coincide tanto en ID como en ruta
            return {
                navItems: state.navItems.filter((itemA) => 
                    !(itemA.id === item.id && itemA.path === item.path)
                ),
                activeNavId: 1,
                activePath: '/'
            };
        });
    },
}));