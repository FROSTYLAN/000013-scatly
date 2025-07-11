import { ProjectData } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Step4Props {
  formData: ProjectData;
  updateArrayItem: (field: keyof ProjectData, index: number, value: string) => void;
  addNewItem: (field: keyof ProjectData) => void;
}

export function Step4ImmediateCauses({ formData, updateArrayItem, addNewItem }: Step4Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Causas Inmediatas (CI)</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Actos Inseguros */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Actos Inseguros</h3>
          {formData.immediateActionsUnsafe.map((action, index) => (
            <div key={`action-${index}`}>
              <Label htmlFor={`unsafe-action-${index}`}>Acto Inseguro {index + 1}</Label>
              <Input
                id={`unsafe-action-${index}`}
                value={action}
                onChange={(e) => updateArrayItem('immediateActionsUnsafe', index, e.target.value)}
                placeholder={`Ingrese acto inseguro ${index + 1}`}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNewItem('immediateActionsUnsafe')}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Acto Inseguro
          </Button>
        </div>

        {/* Condiciones Inseguras */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Condiciones Inseguras</h3>
          {formData.immediateConditionsUnsafe.map((condition, index) => (
            <div key={`condition-${index}`}>
              <Label htmlFor={`unsafe-condition-${index}`}>Condición Insegura {index + 1}</Label>
              <Input
                id={`unsafe-condition-${index}`}
                value={condition}
                onChange={(e) => updateArrayItem('immediateConditionsUnsafe', index, e.target.value)}
                placeholder={`Ingrese condición insegura ${index + 1}`}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNewItem('immediateConditionsUnsafe')}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Condición Insegura
          </Button>
        </div>
      </div>
    </div>
  );
}