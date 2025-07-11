'use client';

import { useState } from 'react';
import { ProjectData, projectEmpty, CorrectiveAction } from '@/types/project';

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
        ...(prev[parentField] as string[]),
        [field]: value
      }
    }));
  };

  const addNewItem = (field: keyof ProjectData) => {
    if (Array.isArray(formData[field])) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field] as string[], '']
      }));
    }
  };

  const updateArrayItem = (field: keyof ProjectData, index: number, value: string) => {
    if (Array.isArray(formData[field])) {
      const newArray = [...formData[field] as string[]];
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
    nextStep,
    prevStep
  };
};