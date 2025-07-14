'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProjectData, projectEmpty, CorrectiveAction, BasicFactorItem } from '@/types/form-types';

export const useProjectForm = () => {
  const params = useParams();
  const projectId = params?.id ? Number(params.id) : null;
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectData>(() => {
    // Verificar si estamos en la ruta /new/[id] o /project/[id]
    const isNewRoute = typeof window !== 'undefined' && window.location.pathname.includes('/new/');
    
    // Para proyectos nuevos en la ruta /new/1
    if (isNewRoute && (!params?.id || Number(params.id) === 1)) {
      // Intentar cargar un proyecto vacío desde localStorage
      if (typeof window !== 'undefined') {
        const emptyProject = localStorage.getItem('empty_project');
        if (emptyProject) {
          try {
            const parsedProject = JSON.parse(emptyProject);
            console.log('Proyecto vacío recuperado de localStorage:', parsedProject);
            return parsedProject;
          } catch (e) {
            console.error('Error al parsear proyecto vacío de localStorage:', e);
          }
        }
        
        // Si no existe un proyecto vacío en localStorage, crear uno nuevo y guardarlo
        const newEmptyProject = {
          ...projectEmpty,
          correctiveActions: [],
          nacCategories: []
        };
        localStorage.setItem('empty_project', JSON.stringify(newEmptyProject));
        return newEmptyProject;
      }
    }
    
    // Para proyectos nuevos en proceso de creación (ruta /new/[id] con ID negativo o > 1)
    // intentar recuperar del localStorage
    if (isNewRoute && typeof window !== 'undefined' && projectId && (projectId > 1 || projectId < 0)) {
      const savedProject = localStorage.getItem(`draft_project_${projectId}`);
      if (savedProject) {
        try {
          const parsedProject = JSON.parse(savedProject);
          console.log('Proyecto recuperado de localStorage:', parsedProject);
          return parsedProject;
        } catch (e) {
          console.error('Error al parsear proyecto de localStorage:', e);
        }
      }
      
      // Si no existe un borrador para este ID, crear uno nuevo
      const newDraftProject = {
        ...projectEmpty,
        correctiveActions: [],
        nacCategories: []
      };
      localStorage.setItem(`draft_project_${projectId}`, JSON.stringify(newDraftProject));
      return newDraftProject;
    }
    
    // Para proyectos existentes o fallback para SSR, usar projectEmpty completo
    return projectEmpty;
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del proyecto si existe un ID y estamos en la ruta /project/[id]
  useEffect(() => {
    // Verificar si estamos en la ruta /project/[id] o /new/[id]
    const isProjectRoute = window.location.pathname.includes('/project/');
    
    // Solo cargar datos de la API si estamos en la ruta /project/[id] y el ID es válido
    if (!isProjectRoute || !projectId || projectId <= 1) return;
    
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Obtener token de localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.log('No hay token, redirigiendo al login');
          window.location.href = '/login';
          return;
        }
        
        const response = await fetch(`/api/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('Token inválido, redirigiendo al login');
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
            return;
          }
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos del proyecto cargados:', data);
        
        if (data.success && data.project) {
          // Transformar los datos de la API al formato del formulario
          setFormData({
            ...projectEmpty,
            name: data.project.nombre || '',
            description: data.project.descripcion || '',
            date: data.project.fecha || '',
            // Nota: Los datos de persona no existen en la base de datos actual
            // pero mantenemos la estructura del formulario intacta
            investigator: {
              ...projectEmpty.investigator
              // Aquí se podrían mapear datos del investigador si existieran en la API
            },
            accidentVictim: {
              ...projectEmpty.accidentVictim
              // Aquí se podrían mapear datos de la víctima si existieran en la API
            }
            // Aquí puedes mapear otros campos según sea necesario
          });
        }
      } catch (err) {
        console.error('Error al cargar el proyecto:', err);
        setError('Error al cargar la información del proyecto. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);
  
  // Guardar datos del formulario en localStorage cuando cambian
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Verificar si estamos en la ruta /new/[id] o /project/[id]
      const isNewRoute = window.location.pathname.includes('/new/');
      
      // Solo guardar en localStorage si estamos en la ruta /new/[id]
      if (isNewRoute) {
        // Para proyectos nuevos en la ruta /new/1
        if (!projectId || projectId === 1) {
          localStorage.setItem('empty_project', JSON.stringify(formData));
          console.log('Proyecto vacío actualizado en localStorage');
        }
        // Para proyectos nuevos en proceso de creación (ID > 1 o ID negativo)
        else if (projectId > 1 || projectId < 0) {
          localStorage.setItem(`draft_project_${projectId}`, JSON.stringify(formData));
          console.log('Proyecto guardado en localStorage:', projectId);
        }
      }
    }
  }, [formData, projectId]);

  const updateFormData = (field: keyof ProjectData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedFormData = <K extends keyof ProjectData>(parentField: K, field: keyof ProjectData[K], value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField] as any[]),
        [field]: value
      }
    }));
  };

  const addNewItem = (field: keyof ProjectData) => {
    if (Array.isArray(formData[field])) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field] as any[], '']
      }));
    }
  };

  const updateArrayItem = (field: keyof ProjectData, index: number, value: string) => {
    if (Array.isArray(formData[field])) {
      const newArray = [...formData[field] as any[]];
      newArray[index] = value;
      setFormData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const addNewCorrectiveAction = () => {
    setFormData(prev => ({
      ...prev,
      correctiveActions: [
        ...prev.correctiveActions,
        {
          action: '',
          responsible: '',
          deadline: '',
          status: 'pending' as const
        }
      ]
    }));
  };

  const updateCorrectiveAction = (index: number, field: keyof CorrectiveAction, value: string) => {
    const newActions = [...formData.correctiveActions];
    newActions[index] = {
      ...newActions[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      correctiveActions: newActions
    }));
  };

  const updateNACStatus = (categoryIndex: number, subcategoryIndex: number, status: 'P' | 'E' | 'C' | '') => {
    const updatedCategories = [...formData.nacCategories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].status = status;
    setFormData(prev => ({
      ...prev,
      nacCategories: updatedCategories
    }));
  };

  const updateBasicFactorComment = (field: 'basicFactorsPersonal' | 'basicFactorsWork', text: string, comment: string) => {
    const currentItems = formData[field] || [];
    const newItems = currentItems.map(item =>
      item.text === text ? { ...item, comment } : item
    );
    setFormData(prev => ({
      ...prev,
      [field]: newItems
    }));
  };

  const toggleBasicFactor = (field: 'basicFactorsPersonal' | 'basicFactorsWork', text: string, category: string) => {
    const currentItems = formData[field] || [];
    const existingItemIndex = currentItems.findIndex(item => item.text === text);

    if (existingItemIndex >= 0) {
      const newItems = currentItems.filter(item => item.text !== text);
      setFormData(prev => ({
        ...prev,
        [field]: newItems
      }));
    } else {
      const newItem: BasicFactorItem = {
        text,
        comment: '',
        category,
        subcauses: []
      };
      setFormData(prev => ({
        ...prev,
        [field]: [...currentItems, newItem]
      }));
    }
  };

  const nextStep = () => {
    if (step < 7) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const updateNACComment = (categoryIndex: number, subcategoryIndex: number, comment: string) => {
    const updatedCategories = [...formData.nacCategories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].comment = comment;
    setFormData(prev => ({
      ...prev,
      nacCategories: updatedCategories
    }));
  };

  // Función para guardar el proyecto en la base de datos
  const saveProject = async () => {
    try {
      setLoading(true);
      
      // Verificar si estamos en la ruta /new/[id] o /project/[id]
      const isNewRoute = typeof window !== 'undefined' && window.location.pathname.includes('/new/');
      
      // Preparar los datos para enviar a la API
      const projectData = {
        nombre: formData.name,
        descripcion: formData.description,
        fecha: formData.date
        // Nota: Actualmente la API solo acepta estos campos
        // En el futuro, se podría extender para incluir más datos
      };
      
      // Determinar si es una creación o actualización
      // Si estamos en la ruta /new/[id], siempre es una creación (POST)
      // Si estamos en la ruta /project/[id], siempre es una actualización (PUT)
      const url = !isNewRoute && projectId && projectId > 0 
        ? `/api/projects/${projectId}` 
        : '/api/projects';
      
      const method = !isNewRoute && projectId && projectId > 0 ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
        credentials: 'include' // Incluir cookies en la solicitud
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Proyecto guardado:', data);
      
      if (typeof window !== 'undefined') {
        if (isNewRoute) {
          // Si estamos en la ruta /new/[id]
          if (!projectId || projectId === 1) {
            // Si es el proyecto vacío (ID = 1), reiniciarlo
            const emptyProject = {
              ...projectEmpty,
              correctiveActions: [],
              nacCategories: []
            };
            localStorage.setItem('empty_project', JSON.stringify(emptyProject));
            console.log('Proyecto vacío reiniciado en localStorage');
          } else if (projectId > 1 || projectId < 0) {
            // Si es un proyecto en proceso (ID > 1 o ID negativo), eliminar el borrador
            localStorage.removeItem(`draft_project_${projectId}`);
            console.log('Borrador eliminado de localStorage:', projectId);
          }
        }
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Error al guardar el proyecto:', err);
      setError('Error al guardar la información del proyecto. Por favor, inténtalo de nuevo más tarde.');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    formData,
    loading,
    error,
    updateFormData,
    updateNestedFormData,
    addNewItem,
    updateArrayItem,
    addNewCorrectiveAction,
    updateCorrectiveAction,
    updateNACStatus,
    updateNACComment,
    updateBasicFactorComment,
    toggleBasicFactor,
    nextStep,
    prevStep,
    saveProject
  };
};