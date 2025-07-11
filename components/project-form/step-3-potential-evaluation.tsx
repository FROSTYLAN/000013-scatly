import { ProjectData } from '@/types/project';

interface Step3PotentialEvaluationProps {
  formData: ProjectData;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

export function Step3PotentialEvaluation({ formData, updateFormData }: Step3PotentialEvaluationProps) {
  return (
    <div className="space-y-6 bg-yellow-50/50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-6 text-center uppercase">Evaluación Potencial de Pérdida si no es Controlado</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Potencial de Severidad de Pérdida */}
        <div className="space-y-4">
          <label className="font-medium block">Potencial de Severidad de Pérdida</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="potentialSeverity"
                value="mayor"
                checked={formData.potentialSeverity === 'mayor'}
                onChange={(e) => updateFormData('potentialSeverity', e.target.value)}
                className="form-radio"
              />
              <span>Mayor (A)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="potentialSeverity"
                value="grave"
                checked={formData.potentialSeverity === 'grave'}
                onChange={(e) => updateFormData('potentialSeverity', e.target.value)}
                className="form-radio"
              />
              <span>Grave (B)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="potentialSeverity"
                value="menor"
                checked={formData.potentialSeverity === 'menor'}
                onChange={(e) => updateFormData('potentialSeverity', e.target.value)}
                className="form-radio"
              />
              <span>Menor (C)</span>
            </label>
          </div>
        </div>

        {/* Probabilidad de Ocurrencia */}
        <div className="space-y-4">
          <label className="font-medium block">Probabilidad de Ocurrencia</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="potentialProbability"
                value="alta"
                checked={formData.potentialProbability === 'alta'}
                onChange={(e) => updateFormData('potentialProbability', e.target.value)}
                className="form-radio"
              />
              <span>Alta (A)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="potentialProbability"
                value="moderada"
                checked={formData.potentialProbability === 'moderada'}
                onChange={(e) => updateFormData('potentialProbability', e.target.value)}
                className="form-radio"
              />
              <span>Moderada (B)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="potentialProbability"
                value="rara"
                checked={formData.potentialProbability === 'rara'}
                onChange={(e) => updateFormData('potentialProbability', e.target.value)}
                className="form-radio"
              />
              <span>Rara (C)</span>
            </label>
          </div>
        </div>

        {/* Frecuencia de Exposición */}
        <div className="space-y-4">
          <label className="font-medium block">Frecuencia de Exposición</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="potentialFrequency"
                value="grande"
                checked={formData.potentialFrequency === 'grande'}
                onChange={(e) => updateFormData('potentialFrequency', e.target.value)}
                className="form-radio"
              />
              <span>Grande (A)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="potentialFrequency"
                value="moderada"
                checked={formData.potentialFrequency === 'moderada'}
                onChange={(e) => updateFormData('potentialFrequency', e.target.value)}
                className="form-radio"
              />
              <span>Moderada (B)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="potentialFrequency"
                value="baja"
                checked={formData.potentialFrequency === 'baja'}
                onChange={(e) => updateFormData('potentialFrequency', e.target.value)}
                className="form-radio"
              />
              <span>Baja (C)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}