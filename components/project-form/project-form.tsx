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

export function ProjectForm() {
  const {
    step,
    formData,
    updateFormData,
    updateNestedFormData,
    addNewItem,
    updateArrayItem,
    addNewCorrectiveAction,
    updateCorrectiveAction,
    nextStep,
    prevStep
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
            updateArrayItem={updateArrayItem}
            addNewItem={addNewItem}
          />
        );
      case 6:
        return (
          <Step6BasicCauses
            formData={formData}
            updateArrayItem={updateArrayItem}
            addNewItem={addNewItem}
          />
        );
      case 7:
        return (
          <Step7CorrectiveActions
            formData={formData}
            updateCorrectiveAction={updateCorrectiveAction}
            addNewCorrectiveAction={addNewCorrectiveAction}
          />
        );
      default:
        return null;
    }
  };

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
            onClick={nextStep}
            disabled={step === 7}
            size="sm"
            className="min-w-[100px]"
          >
            {step === 7 ? 'Finalizar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  );
}