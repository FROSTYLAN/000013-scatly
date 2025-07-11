import { ProjectData } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Step5Props {
  formData: ProjectData;
  updateArrayItem: (field: keyof ProjectData, index: number, value: string) => void;
  addNewItem: (field: keyof ProjectData) => void;
}

export function Step5BasicCauses({ formData, updateArrayItem, addNewItem }: Step5Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Causas Básicas (CB)</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Factores Personales */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Factores Personales</h3>
          {formData.basicFactorsPersonal.map((factor, index) => (
            <div key={`personal-${index}`}>
              <Label htmlFor={`personal-factor-${index}`}>Factor Personal {index + 1}</Label>
              <Input
                id={`personal-factor-${index}`}
                value={factor}
                onChange={(e) => updateArrayItem('basicFactorsPersonal', index, e.target.value)}
                placeholder={`Ingrese factor personal ${index + 1}`}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNewItem('basicFactorsPersonal')}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Factor Personal
          </Button>
        </div>

        {/* Factores de Trabajo */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Factores de Trabajo</h3>
          {formData.basicFactorsWork.map((factor, index) => (
            <div key={`work-${index}`}>
              <Label htmlFor={`work-factor-${index}`}>Factor de Trabajo {index + 1}</Label>
              <Input
                id={`work-factor-${index}`}
                value={factor}
                onChange={(e) => updateArrayItem('basicFactorsWork', index, e.target.value)}
                placeholder={`Ingrese factor de trabajo ${index + 1}`}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNewItem('basicFactorsWork')}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Factor de Trabajo
          </Button>
        </div>
      </div>
    </div>
  );
}