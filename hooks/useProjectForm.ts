'use client';

import { useState } from 'react';
import { ProjectData, projectEmpty, CorrectiveAction, BasicFactorItem } from '@/types/form-types';

export const useProjectForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProjectData>(projectEmpty);

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

  return {
    step,
    formData,
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
    prevStep
  };
};