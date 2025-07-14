'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Project } from '@/types/database-types';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useNavStore } from '@/store/use-nav-store';

export function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const { addNavItem, setActiveNavId, setActivePath } = useNavStore();
  const projectId = params?.id ? Number(params.id) : null;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId || projectId <= 1) {
        setError('ID de proyecto no válido');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.project) {
          setProject(data.project);
        } else {
          setError('No se encontraron datos del proyecto');
        }
      } catch (err) {
        console.error('Error al cargar el proyecto:', err);
        setError('No se pudo cargar la información del proyecto');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col min-h-screen justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Cargando detalles del proyecto...</p>
      </div>
    );
  }

  // Mostrar mensaje de error
  if (error) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col min-h-screen justify-center items-center">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200 max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/')}
            className="mt-2 w-full"
          >
            Volver a Proyectos
          </Button>
        </div>
      </div>
    );
  }

  // Si no hay proyecto
  if (!project) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col min-h-screen justify-center items-center">
        <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200 max-w-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Proyecto no encontrado</h3>
          <p className="text-yellow-600 mb-4">No se pudo encontrar el proyecto solicitado.</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/')}
            className="mt-2 w-full"
          >
            Volver a Proyectos
          </Button>
        </div>
      </div>
    );
  }

  // Formatear la fecha
  const formattedDate = project.fecha ? new Date(project.fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Fecha no disponible';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-primary/10 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{project.nombre}</h1>
              <div className="flex items-center text-sm text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </div>
            </div>
            <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
              ID: {project.id}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-primary/80">Descripción</h2>
            <p className="text-muted-foreground whitespace-pre-line">{project.descripcion || 'Sin descripción'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2 text-primary/70">Información del Proyecto</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Creado:</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Última actualización:</span>
                  <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2 text-primary/70">Acciones</h3>
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    // Navegar a la página de edición del proyecto
                    // Añadir el proyecto al store de navegación antes de navegar
                    const newId = addNavItem({
                      name: project.nombre,
                      id: projectId,
                      isExisting: false // Marcamos como false para que use la ruta /new/
                    });
                    // Actualizar manualmente la ruta activa
                    setActivePath(`/new/${projectId}`);
                    router.push(`/new/${projectId}`);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Editar Proyecto
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={async () => {
                    if (confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
                      try {
                        const response = await fetch(`/api/projects/${projectId}`, {
                          method: 'DELETE',
                        });
                        
                        if (response.ok) {
                          // Redirigir a la página principal después de eliminar
                          router.push('/');
                        } else {
                          const data = await response.json();
                          alert(`Error al eliminar: ${data.error || 'Error desconocido'}`);
                        }
                      } catch (err) {
                        console.error('Error al eliminar el proyecto:', err);
                        alert('No se pudo eliminar el proyecto. Inténtalo de nuevo más tarde.');
                      }
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar Proyecto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}