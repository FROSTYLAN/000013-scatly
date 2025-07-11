import { ProjectData } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Step2Props {
  formData: ProjectData;
  updateNestedFormData: <K extends keyof ProjectData>(parentField: K, field: keyof ProjectData[K], value: any) => void;
}

export function Step2PersonData({ formData, updateNestedFormData }: Step2Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Datos del Investigador/Accidentado</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Columna del Investigador */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Datos del Investigador</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="investigator-name">Nombre</Label>
              <Input
                id="investigator-name"
                value={formData.investigator.name}
                onChange={(e) => updateNestedFormData('investigator', 'name', e.target.value)}
                placeholder="Nombre del investigador"
              />
            </div>
            <div>
              <Label htmlFor="investigator-lastName">Apellido</Label>
              <Input
                id="investigator-lastName"
                value={formData.investigator.lastName}
                onChange={(e) => updateNestedFormData('investigator', 'lastName', e.target.value)}
                placeholder="Apellido del investigador"
              />
            </div>
            <div>
              <Label htmlFor="investigator-dni">DNI</Label>
              <Input
                id="investigator-dni"
                value={formData.investigator.dni}
                onChange={(e) => updateNestedFormData('investigator', 'dni', e.target.value)}
                placeholder="DNI del investigador"
              />
            </div>
            <div>
              <Label htmlFor="investigator-position">Cargo</Label>
              <Input
                id="investigator-position"
                value={formData.investigator.position}
                onChange={(e) => updateNestedFormData('investigator', 'position', e.target.value)}
                placeholder="Cargo del investigador"
              />
            </div>
          </div>
        </div>

        {/* Columna del Accidentado */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Datos del Accidentado</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="victim-name">Nombre</Label>
              <Input
                id="victim-name"
                value={formData.accidentVictim.name}
                onChange={(e) => updateNestedFormData('accidentVictim', 'name', e.target.value)}
                placeholder="Nombre del accidentado"
              />
            </div>
            <div>
              <Label htmlFor="victim-lastName">Apellido</Label>
              <Input
                id="victim-lastName"
                value={formData.accidentVictim.lastName}
                onChange={(e) => updateNestedFormData('accidentVictim', 'lastName', e.target.value)}
                placeholder="Apellido del accidentado"
              />
            </div>
            <div>
              <Label htmlFor="victim-age">Edad</Label>
              <Input
                id="victim-age"
                value={formData.accidentVictim.age}
                onChange={(e) => updateNestedFormData('accidentVictim', 'age', e.target.value)}
                placeholder="Edad del accidentado"
              />
            </div>
            <div>
              <Label htmlFor="victim-dni">DNI</Label>
              <Input
                id="victim-dni"
                value={formData.accidentVictim.dni}
                onChange={(e) => updateNestedFormData('accidentVictim', 'dni', e.target.value)}
                placeholder="DNI del accidentado"
              />
            </div>
            <div>
              <Label htmlFor="victim-position">Cargo</Label>
              <Input
                id="victim-position"
                value={formData.accidentVictim.position}
                onChange={(e) => updateNestedFormData('accidentVictim', 'position', e.target.value)}
                placeholder="Cargo del accidentado"
              />
            </div>
            <div>
              <Label htmlFor="victim-company">Empresa Minera</Label>
              <Input
                id="victim-company"
                value={formData.accidentVictim.miningCompany}
                onChange={(e) => updateNestedFormData('accidentVictim', 'miningCompany', e.target.value)}
                placeholder="Empresa minera"
              />
            </div>
            <div>
              <Label htmlFor="victim-employed">Empleado</Label>
              <Input
                id="victim-employed"
                value={formData.accidentVictim.employed}
                onChange={(e) => updateNestedFormData('accidentVictim', 'employed', e.target.value)}
                placeholder="Empleado"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}