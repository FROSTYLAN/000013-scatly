import { ProjectData } from '@/types/project';

interface Step5Props {
  formData: ProjectData;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

export function Step5ImmediateCauses({ formData, updateFormData }: Step5Props) {
  const unsafeActs = [
    { id: 1, text: 'Operar sin autorización', reference: '(Ver CI 2,3,4,5,7,8,12,13)' },
    { id: 2, text: 'Dejar de advertir', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13)' },
    { id: 3, text: 'Dejar de asegurar', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13)' },
    { id: 4, text: 'Operar a velocidad inadecuada', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13)' },
    { id: 5, text: 'Desactivar dispositivos de seguridad', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13)' },
    { id: 6, text: 'Usar equipo defectuoso', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)' },
    { id: 7, text: 'No usar EPP correctamente', reference: '(Ver CI 2,3,4,5,6,7,8,9,11,12,13,15)' },
    { id: 8, text: 'Cargar incorrectamente', reference: '(Ver CI 1,2,3,4,5,6,7,8,9,11,12,13,15)' },
    { id: 9, text: 'Almacenar incorrecto', reference: '(Ver CI 1,2,3,4,5,6,7,8,9,11,12,13,15)' },
    { id: 10, text: 'Levantar incorrectamente', reference: '(Ver CI 8,10,11,12,13,14,15)' },
    { id: 11, text: 'Posición incorrecta', reference: '(Ver CI 1,2,3,4,5,6,7,8,9,10,11,12,13,15)' },
    { id: 12, text: 'Dar servicio a equipo en funcionamiento', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)' },
    { id: 13, text: 'Juguetear', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)' },
    { id: 14, text: 'Bajo influencia del alcohol y/u otra droga', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)' },
    { id: 15, text: 'Usar equipo incorrecto', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)' },
    { id: 16, text: 'No seguir procedimientos', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)' }
  ];

  const unsafeConditions = [
    { id: 17, text: 'Equipo de protección inadecuado o impropio', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12,13)' },
    { id: 18, text: 'Herramientas, Equipo o Materiales defectuosos', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12,13)' },
    { id: 19, text: 'Espacio limitado para desenvolverse', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10)' },
    { id: 20, text: 'Sistemas de advertencia insuficientes', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10)' },
    { id: 21, text: 'Peligro de explosión o incendio', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10)' },
    { id: 22, text: 'Orden y limpieza deficientes / Desorden', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12,13)' },
    { id: 23, text: 'Exposición al Ruido', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12,13,14)' },
    { id: 24, text: 'Exposición a la Radiación', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12,13,14)' },
    { id: 25, text: 'Exposición a temperaturas altas o bajas', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12)' },
    { id: 26, text: 'Iluminación Deficiente o Excesiva', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12)' },
    { id: 27, text: 'Ventilación Insuficiente', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10)' },
    { id: 28, text: 'Condiciones Ambientales Peligrosas', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12)' }
  ];

  const handleCheckboxChange = (field: 'immediateActionsUnsafe' | 'immediateConditionsUnsafe', value: string) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    updateFormData(field, newValues);
  };

  return (
    <div className="space-y-6 bg-yellow-50/50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-6 text-center uppercase">Causas Inmediatas o Directas (CI)</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Actos Subestándares/Inseguros */}
        <div className="space-y-4">
          <h3 className="font-medium text-center pb-2 border-b">ACTOS SUBESTÁNDARES/INSEGUROS</h3>
          <div className="space-y-2">
            {unsafeActs.map((act) => (
              <label key={act.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-yellow-100/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.immediateActionsUnsafe?.includes(act.text) || false}
                  onChange={() => handleCheckboxChange('immediateActionsUnsafe', act.text)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <div className="text-sm">{act.text}</div>
                  <div className="text-xs text-gray-600">{act.reference}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Condiciones Subestándares/Inseguras */}
        <div className="space-y-4">
          <h3 className="font-medium text-center pb-2 border-b">CONDICIONES SUBESTÁNDARES/INSEGURAS</h3>
          <div className="space-y-2">
            {unsafeConditions.map((condition) => (
              <label key={condition.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-yellow-100/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.immediateConditionsUnsafe?.includes(condition.text) || false}
                  onChange={() => handleCheckboxChange('immediateConditionsUnsafe', condition.text)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <div className="text-sm">{condition.text}</div>
                  <div className="text-xs text-gray-600">{condition.reference}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}