import { ProjectData, CorrectiveAction } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Step7Props {
  formData: ProjectData;
  updateCorrectiveAction: (index: number, field: keyof CorrectiveAction, value: string) => void;
  addNewCorrectiveAction: () => void;
}

export function Step7CorrectiveActions({ 
  formData, 
  updateCorrectiveAction, 
  addNewCorrectiveAction 
}: Step7Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Necesidades de Acción Correctiva (NAC)</h2>
      
      <div className="space-y-6">
        {formData.correctiveActions.map((action, index) => (
          <div key={`action-${index}`} className="p-4 border rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">Acción Correctiva {index + 1}</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor={`action-${index}`}>Acción</Label>
                <Textarea
                  id={`action-${index}`}
                  value={action.action}
                  onChange={(e) => updateCorrectiveAction(index, 'action', e.target.value)}
                  placeholder="Describa la acción correctiva"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor={`responsible-${index}`}>Responsable</Label>
                <Input
                  id={`responsible-${index}`}
                  value={action.responsible}
                  onChange={(e) => updateCorrectiveAction(index, 'responsible', e.target.value)}
                  placeholder="Nombre del responsable"
                />
              </div>

              <div>
                <Label htmlFor={`deadline-${index}`}>Fecha Límite</Label>
                <Input
                  id={`deadline-${index}`}
                  type="date"
                  value={action.deadline}
                  onChange={(e) => updateCorrectiveAction(index, 'deadline', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor={`status-${index}`}>Estado</Label>
                <Select
                  value={action.status}
                  onValueChange={(value) => updateCorrectiveAction(index, 'status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="in-progress">En Progreso</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addNewCorrectiveAction}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Nueva Acción Correctiva
        </Button>
      </div>
    </div>
  );
}