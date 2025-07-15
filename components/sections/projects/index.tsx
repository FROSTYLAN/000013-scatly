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
        // Obtener token de localStorage
        const token = localStorage.getItem('auth_token');
        console.log('🔍 ProjectsSection - Token desde localStorage:', token ? token.substring(0, 20) + '...' : 'NO ENCONTRADO');
        
        if (!token) {
          console.log('No hay token, mostrando mensaje de login');
          setError('Inicia sesión para ver tus proyectos');
          setLoading(false);
          return;
        }
        
        console.log('📤 ProjectsSection - Enviando petición con Authorization header:', `Bearer ${token.substring(0, 20)}...`);
        const response = await fetch('/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('📥 ProjectsSection - Respuesta recibida, status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Token inválido, limpiando localStorage');
            localStorage.removeItem('auth_token');
            setError('Tu sesión ha expirado. Inicia sesión nuevamente.');
            setLoading(false);
            return;
          }
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
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mx-auto max-w-7xl">
              {/* Skeleton para el botón de nuevo proyecto */}
              <div className="animate-pulse">
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-600/30 rounded-xl p-6 h-48 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-600/50 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-600/30 rounded"></div>
                      <div className="h-3 bg-slate-600/30 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-slate-600/30 rounded w-1/3"></div>
                    <div className="h-8 w-8 bg-slate-600/50 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Skeletons para proyectos */}
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gradient-to-br from-slate-800/30 to-slate-700/30 border border-slate-600/20 rounded-xl p-6 h-48 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-600/40 rounded w-4/5"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-600/25 rounded"></div>
                        <div className="h-3 bg-slate-600/25 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-600/25 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-3 bg-slate-600/25 rounded w-1/4"></div>
                      <div className="h-8 w-8 bg-slate-600/40 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Indicador de carga con texto */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <p className="text-slate-400">Cargando proyectos...</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Mostramos un mensaje de error si ocurre algún problema */}
        {error && (
          <div className="text-center p-4 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-300 mb-4">{error}</p>
            {(error.includes('Inicia sesión') || error.includes('sesión ha expirado')) && (
              <button 
                onClick={() => window.location.href = '/login'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Iniciar Sesión
              </button>
            )}
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
