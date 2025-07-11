'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import LaptopAnimation from './laptop-animation';
import ProjectCard from './project-card';
// Eliminamos la importación de datos estáticos
// import data from '@/data';

export default function ProjectsSection() {
  // Estado para almacenar los proyectos
  const [projects, setProjects] = useState<Array<{
    id: number;
    title: string;
    description: string;
    date?: string;
  }>>([]);
  
  // Estado para manejar la carga
  const [loading, setLoading] = useState<boolean>(true);
  
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null);
  
  // Efecto para cargar los proyectos desde la API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verificamos la estructura de la respuesta
        console.log('Respuesta de la API:', data);
        
        // Transformamos los proyectos de la API al formato que espera nuestro componente
        const formattedProjects = data.projects.map((project: any) => ({
          id: project.id,
          title: project.nombre || 'Sin título',
          description: project.descripcion || 'Sin descripción',
          date: project.fecha || null,
        }));
        
        setProjects(formattedProjects);
        setError(null);
      } catch (err) {
        console.error('Error al cargar proyectos:', err);
        setError('No se pudieron cargar los proyectos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  return (
    <div
      id='projects'
      className='w-full px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col gap-8 md:gap-12 text-sm md:text-base'
    >
      <div>
        <div className='sticky top-8 text-center md:text-left'>
          {/* grid image behind */}
          <Image
            className='absolute -top-2 -left-5 -z-10 text-transparent opacity-30 w-full h-1/2 object-cover'
            src='/svgs/grid.svg'
            alt='grid image'
            width={0}
            height={0}
          />
          <h1 className='text-3xl md:text-4xl text-gradient-primary'>
            Proyectos
          </h1>
          <LaptopAnimation className='w-[300px] -scale-x-100 scale-y-100 mx-auto md:mx-0' />
        </div>
      </div>
      
      <div className='w-full'>
        {/* Mostramos un mensaje de carga mientras se obtienen los proyectos */}
        {loading && (
          <div className="text-center p-4 w-full">
            <div className="animate-pulse flex space-x-4 justify-center">
              <div className="rounded-full bg-slate-700 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1 max-w-md">
                <div className="h-2 bg-slate-700 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
            <p className="mt-4">Cargando proyectos...</p>
          </div>
        )}
        
        {/* Mostramos un mensaje de error si ocurre algún problema */}
        {error && (
          <div className="text-center p-4 text-red-500 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}
        
        {/* Mostramos los proyectos una vez cargados */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mx-auto max-w-7xl">
            {/* Siempre mostramos el botón de nuevo proyecto */}
            <ProjectCard key={"new-project"} project={{
              id: 0,
              title: "(New project)",
              description: "New Project Description",
            }} />
            
            {projects.map((project) => (
              <ProjectCard key={`project-${project.id}`} project={project} />
            ))}
            
            {projects.length === 0 && !loading && !error && (
              <div className="col-span-full text-center p-4 w-full">
                <p>No hay proyectos disponibles. ¡Crea uno nuevo!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
