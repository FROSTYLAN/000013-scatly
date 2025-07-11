import { ProjectData } from '@/types/form-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Step1Props {
  formData: ProjectData;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

export function Step1ProjectData({ formData, updateFormData }: Step1Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Datos del Proyecto</h2>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Proyecto</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Ingrese el nombre del proyecto"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Ingrese la descripción del proyecto"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Fecha</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => updateFormData('date', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}