'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProjectData, projectEmpty } from '@/types/form-types';

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

  // Funciones para manejar campos simplificados con fieldId y comment
  const updateStepField = (step: 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number, comment: string) => {
    const currentFields = formData[step] || [];
    const existingIndex = currentFields.findIndex(field => field.fieldId === fieldId);
    
    if (existingIndex >= 0) {
      // Actualizar campo existente
      const newFields = [...currentFields];
      newFields[existingIndex] = { fieldId, comment };
      updateFormData(step, newFields);
    } else {
      // Agregar nuevo campo
      updateFormData(step, [...currentFields, { fieldId, comment }]);
    }
  };

  const removeStepField = (step: 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => {
    const currentFields = formData[step] || [];
    const newFields = currentFields.filter(field => field.fieldId !== fieldId);
    updateFormData(step, newFields);
  };

  const getStepFieldComment = (step: 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number): string => {
    const currentFields = formData[step] || [];
    const field = currentFields.find(field => field.fieldId === fieldId);
    return field?.comment || '';
  };

  const isStepFieldSelected = (step: 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number): boolean => {
    const currentFields = formData[step] || [];
    return currentFields.some(field => field.fieldId === fieldId);
  };

  // Funciones específicas para Step 7 (NAC)
  // Ahora cada campo P, E, C es individual con su propio fieldId
  // Usa la misma estructura que los otros steps: solo fieldId y comment
  const updateNACField = (fieldId: number, comment: string) => {
    updateStepField('step7Fields', fieldId, comment);
  };

  const removeNACField = (fieldId: number) => {
    removeStepField('step7Fields', fieldId);
  };

  const getNACFieldComment = (fieldId: number): string => {
    return getStepFieldComment('step7Fields', fieldId);
  };

  const isNACFieldSelected = (fieldId: number): boolean => {
    return isStepFieldSelected('step7Fields', fieldId);
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

  // Función legacy mantenida para compatibilidad (se puede eliminar después)
  const updateNACComment = (fieldId: number, comment: string) => {
    const currentFields = formData.step7Fields || [];
    const existingIndex = currentFields.findIndex(field => field.fieldId === fieldId);
    
    if (existingIndex >= 0) {
      const newFields = [...currentFields];
      newFields[existingIndex] = { ...newFields[existingIndex], comment };
      updateFormData('step7Fields', newFields);
    }
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

    // Nuevas funciones para estructura simplificada
    updateStepField,
    removeStepField,
    getStepFieldComment,
    isStepFieldSelected,
    updateNACField,
    removeNACField,
    getNACFieldComment,
    isNACFieldSelected,
    // Función legacy
    updateNACComment,
    nextStep,
    prevStep,
    saveProject
  };
};