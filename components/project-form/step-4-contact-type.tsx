import { ProjectData } from '@/types/form-types';

interface Step4Props {
  formData: ProjectData;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

export function Step4ContactType({ formData, updateFormData }: Step4Props) {
  const contactTypes = [
    {
      id: 1,
      title: 'Golpeado Contra (chocar contra algo)',
      reference: '(Ver CI 1,2,3,4,5,6,11,12,13,14,15,16,17,18,19,20,26)'
    },
    {
      id: 2,
      title: 'Golpeado por (Impactado por objeto en movimiento)',
      reference: '(Ver CI 1,2,3,4,5,6,11,12,13,14,15,16,17,18,19,20,26)'
    },
    {
      id: 3,
      title: 'Caída a un nivel más bajo',
      reference: '(Ver CI 2,3,5,6,7,11,12,13,14,15,16,17,18,19,22)'
    },
    {
      id: 4,
      title: 'Caída en el mismo nivel (Resbalar y caer, tropezar)',
      reference: '(Ver CI 4,5,6,11,12,13,14,15,16,17,18,22,26)'
    },
    {
      id: 5,
      title: 'Atrapado (Puntas de Pellizco y Mordida)',
      reference: '(Ver CI 5,6,11,13,14,15,16,17,18)'
    },
    {
      id: 6,
      title: 'Cogido (Enganchado, Colgado)',
      reference: '(Ver CI 5,6,11,12,13,14,15,16,17,18)'
    },
    {
      id: 7,
      title: 'Atrapado entre o debajo ( Chancado, Amputado)',
      reference: '(Ver CI 1,2,3,4,5,6,11,12,13,14,15,16,22,26)'
    },
    {
      id: 8,
      title: 'Contacto con (Electricidad, Calor, Frío, Radiación, Cáusticos, Tóxicos, Ruido)',
      reference: '(Ver CI 5,6,7,8,9,10,11,12,13,14,15,16,17,18,22,25,27,26)'
    },
    {
      id: 9,
      title: 'Sobretensión / Sobre-esfuerzo / Sobrecarga',
      reference: '(Ver CI 8,10,11,12,13,14,15)'
    }
  ];

  const toggleContactType = (title: string) => {
    const currentTypes = formData.contactTypes || [];
    const typeIndex = currentTypes.findIndex(t => t.title === title);
    
    if (typeIndex >= 0) {
      // Si ya existe, lo removemos
      const newTypes = currentTypes.filter(t => t.title !== title);
      updateFormData('contactTypes', newTypes);
    } else {
      // Si no existe, lo agregamos con un comentario vacío
      updateFormData('contactTypes', [...currentTypes, { title, comment: '' }]);
    }
  };

  const updateComment = (title: string, comment: string) => {
    const currentTypes = formData.contactTypes || [];
    const newTypes = currentTypes.map(t => 
      t.title === title ? { ...t, comment } : t
    );
    updateFormData('contactTypes', newTypes);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tipo de Contacto o Cuasi Contacto con Energía o Sustancia</h2>
      
      <div className="space-y-4">
        {contactTypes.map((type) => {
          const isSelected = formData.contactTypes?.some(t => t.title === type.title) || false;
          const currentComment = formData.contactTypes?.find(t => t.title === type.title)?.comment || '';

          return (
            <label key={type.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-amber-100/10 cursor-pointer transition-colors duration-200">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleContactType(type.title)}
                className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
              />
              <div className="space-y-2 flex-1">
                <div className="font-medium">
                  {type.id}. {type.title}
                </div>
                {isSelected && (
                  <div className="mt-2">
                    <textarea
                      placeholder="Agregar un comentario..."
                      value={currentComment}
                      onChange={(e) => updateComment(type.title, e.target.value)}
                      className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}