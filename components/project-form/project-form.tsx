'use client';

import { useProjectForm } from '@/hooks/useProjectForm';
import { Step1ProjectData } from './step-1-project-data';
import { Step2PersonData } from './step-2-person-data';
import { Step3PotentialEvaluation } from './step-3-potential-evaluation';
import { Step4ContactType } from './step-4-contact-type';
import { Step5ImmediateCauses } from './step-5-immediate-causes';
import { Step6BasicCauses } from './step-6-basic-causes';
import { Step7CorrectiveActions } from './step-7-corrective-actions';
import { FormNavigation } from './form-navigation';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function ProjectForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  
  // Determinar si estamos en la ruta /new/[id]
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsNewProject(window.location.pathname.includes('/new/'));
    }
  }, []);
  
  const {
    step,
    formData,
    loading,
    error,
    updateFormData,
    updateNestedFormData,
    updateNACStatus,
    updateNACComment,
    nextStep,
    prevStep,
    saveProject
  } = useProjectForm();

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1ProjectData
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <Step2PersonData
            formData={formData}
            updateNestedFormData={updateNestedFormData}
          />
        );
      case 3:
        return (
          <Step3PotentialEvaluation
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <Step4ContactType
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <Step5ImmediateCauses
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 6:
        return (
          <Step6BasicCauses
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 7:
        return (
          <Step7CorrectiveActions
            formData={formData}
            updateNACStatus={updateNACStatus}
            updateNACComment={updateNACComment}
          />
        );
      default:
        return null;
    }
  };

  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col min-h-screen justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg">Cargando datos del proyecto...</p>
      </div>
    );
  }

  // Si hay un error, mostrar un mensaje de error
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
            onClick={() => window.history.back()}
            className="mt-2 w-full"
          >
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-4xl mx-auto py-6">
          <FormNavigation
            step={step}
            prevStep={prevStep}
            nextStep={nextStep}
            showButtons={false}
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto py-8 px-4">
          {renderStep()}
        </div>
      </div>
      <div className="sticky bottom-0 z-10 bg-background border-t shadow-[0_-1px_3px_0_rgb(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto py-4 px-4 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            size="sm"
            className="min-w-[100px]"
          >
            Anterior
          </Button>

          <Button
            type="button"
            onClick={async () => {
              if (step === 7) {
                try {
                  setIsSaving(true);
                  setSaveError(null);
                  console.log('Formulario a enviar:', JSON.stringify(formData, null, 2));
                  
                  const result = await saveProject();
                  
                  if (result.success) {
                    if (isNewProject) {
                      // Si estamos en /new/[id], redirigir a la página principal
                      router.push('/');
                    } else {
                      // Si estamos en /project/[id], redirigir a la página del proyecto
                      router.push(`/project/${result.data.id || 1}`);
                    }
                  } else {
                    setSaveError('Error al guardar el proyecto. Por favor, inténtalo de nuevo.');
                  }
                } catch (err) {
                  console.error('Error al guardar:', err);
                  setSaveError('Error al guardar el proyecto. Por favor, inténtalo de nuevo.');
                } finally {
                  setIsSaving(false);
                }
              } else {
                nextStep();
              }
            }}
            disabled={isSaving}
            size="sm"
            className="min-w-[100px]"
          >
            {step === 7 
              ? (isSaving ? 'Guardando...' : 'Finalizar') 
              : 'Siguiente'}
          </Button>
          
          {saveError && (
            <div className="absolute bottom-16 right-4 bg-red-100 text-red-800 p-3 rounded-md shadow-md">
              {saveError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}