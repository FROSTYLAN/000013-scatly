'use client';
import { motion } from 'framer-motion';
import { useNavStore } from '@/store/use-nav-store';
import { useRouter } from 'next/navigation';

type props = {
  project: {
    id: number;
    title: string;
    description: string;
    date?: string | null;
  };
};

export default function ProjectCard({ project }: props) {
  const router = useRouter();
  const { addNavItem, setActiveNavId, setActivePath } = useNavStore();

  const handleAddProject = (item: any) => {
    if (project.id === 0) {
      // Es un nuevo proyecto
      // Limpiar localStorage para asegurar que se inicie con un proyecto vacío
      if (typeof window !== 'undefined') {
        // Reiniciar el proyecto vacío en localStorage
        const emptyProjectStr = localStorage.getItem('empty_project');
        if (emptyProjectStr) {
          try {
            // Obtener el proyecto vacío actual
            const emptyProject = JSON.parse(emptyProjectStr);
            // Reiniciar los arrays
            emptyProject.correctiveActions = [];
            emptyProject.nacCategories = [];
            // Guardar el proyecto vacío reiniciado
            localStorage.setItem('empty_project', JSON.stringify(emptyProject));
          } catch (e) {
            console.error('Error al reiniciar proyecto vacío:', e);
          }
        }
      }
      
      // Añadir el nuevo proyecto (addNavItem generará un ID negativo)
      const newId = addNavItem(item);
      // Actualizar manualmente la ruta activa
      setActiveNavId(newId);
      setActivePath(`/new/${Math.abs(newId)}`);
      // Usar el valor absoluto del ID para la ruta
      router.push(`/new/${Math.abs(newId)}`);
    } else {
      // Si es un proyecto existente, usamos su ID real y marcamos que es existente
      const newId = addNavItem({
        ...item,
        id: project.id,
        isExisting: true
      });
      // Actualizar manualmente la ruta activa
      setActiveNavId(project.id);
      setActivePath(`/project/${project.id}`);
      router.push(`/project/${project.id}`);
    }
  };

  return (
    <motion.div
      onClick={() => handleAddProject({
        name: project.title
      })}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className='w-full max-w-[350px] h-[280px] rounded-2xl bg-muted border overflow-hidden shadow-sm hover:shadow-md'
    >
      <div className='px-6 py-4 h-full flex flex-col justify-between'>
        {
          project.title == '(New project)' ? (
            <div className='h-full flex flex-col justify-center items-center'>
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className='rounded-full w-16 h-16 bg-primary/10 flex justify-center items-center'
              >
                <span className='text-5xl text-primary'>+</span>
              </motion.div>
              <p className='mt-4 text-sm text-muted-foreground'>Crear nuevo proyecto</p>
            </div>
          ) : (
            <>
              <div>
                <motion.h2
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className='text-xl capitalize font-bold mb-2 text-primary'
                >
                  {project.title}
                </motion.h2>
                
                <p className='text-sm overflow-hidden text-ellipsis line-clamp-4 mb-4'>
                  {project.description}
                </p>
              </div>
              
              <div className='mt-auto'>
                {project.date && (
                  <div className='flex items-center text-xs text-muted-foreground'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(project.date).toLocaleDateString()}
                  </div>
                )}
                
                <div className='flex justify-between items-center mt-2'>
                  <span className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full'>ID: {project.id}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className='text-xs bg-primary/10 text-primary px-2 py-1 rounded-full'
                  >
                    Ver detalles
                  </motion.button>
                </div>
              </div>
            </>
          )
        }
      </div>
    </motion.div>
  );
}
