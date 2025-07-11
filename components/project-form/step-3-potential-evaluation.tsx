import { ProjectData } from '@/types/project';

interface Step3PotentialEvaluationProps {
  formData: ProjectData;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

export function Step3PotentialEvaluation({ formData, updateFormData }: Step3PotentialEvaluationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Evaluación Potencial de Pérdida si no es Controlado</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Severidad Potencial</label>
              <select
                className="w-full border rounded-md p-2"
                value={formData.potentialSeverity || ''}
                onChange={(e) => updateFormData('potentialSeverity', e.target.value)}
              >
                <option value="">Seleccione la severidad</option>
                <option value="fatal">Fatal</option>
                <option value="grave">Grave</option>
                <option value="moderado">Moderado</option>
                <option value="leve">Leve</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Probabilidad de Ocurrencia</label>
              <select
                className="w-full border rounded-md p-2"
                value={formData.potentialProbability || ''}
                onChange={(e) => updateFormData('potentialProbability', e.target.value)}
              >
                <option value="">Seleccione la probabilidad</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción del Potencial de Pérdida</label>
              <textarea
                className="w-full border rounded-md p-2 min-h-[100px]"
                value={formData.potentialLossDescription || ''}
                onChange={(e) => updateFormData('potentialLossDescription', e.target.value)}
                placeholder="Describa el potencial de pérdida si la situación no es controlada..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}