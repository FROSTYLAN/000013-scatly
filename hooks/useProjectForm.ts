'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProjectData, projectEmpty, CorrectiveAction, BasicFactorItem } from '@/types/form-types';

export const useProjectForm = () => {
  const params = useParams();
  const projectId = params?.id ? Number(params.id) : null;
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectData>(projectEmpty);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del proyecto si existe un ID
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId || projectId <= 1) return; // No cargar para nuevos proyectos o la página principal
      
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
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
      
      // Preparar los datos para enviar a la API
      const projectData = {
        nombre: formData.name,
        descripcion: formData.description,
        fecha: formData.date
        // Nota: Actualmente la API solo acepta estos campos
        // En el futuro, se podría extender para incluir más datos
      };
      
      // Determinar si es una creación o actualización
      const url = projectId && projectId > 1 
        ? `/api/projects/${projectId}` 
        : '/api/projects';
      
      const method = projectId && projectId > 1 ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Proyecto guardado:', data);
      
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