import { ProjectData } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Step3Props {
  formData: ProjectData;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

export function Step3ContactType({ formData, updateFormData }: Step3Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tipo de Contacto</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="contact-type">Tipo de Contacto</Label>
          <Input
            id="contact-type"
            value={formData.contactType}
            onChange={(e) => updateFormData('contactType', e.target.value)}
            placeholder="Ingrese el tipo de contacto"
          />
        </div>

        <div>
          <Label htmlFor="contact-description">Descripción del Contacto</Label>
          <Textarea
            id="contact-description"
            value={formData.contactDescription}
            onChange={(e) => updateFormData('contactDescription', e.target.value)}
            placeholder="Ingrese la descripción detallada del contacto"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}