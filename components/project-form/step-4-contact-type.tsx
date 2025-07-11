import { ProjectData } from '@/types/project';

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

  return (
    <div className="space-y-6 bg-yellow-50/50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-6 text-center uppercase">Tipo de Contacto o Cuasi Contacto con Energía o Sustancia</h2>
      
      <div className="space-y-4">
        {contactTypes.map((type) => (
          <label key={type.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-yellow-100/50 cursor-pointer">
            <input
              type="radio"
              name="contactType"
              value={type.title}
              checked={formData.contactType === type.title}
              onChange={(e) => updateFormData('contactType', e.target.value)}
              className="mt-1 form-radio"
            />
            <div className="space-y-1">
              <div className="font-medium">
                {type.id}. {type.title}
              </div>
              <div className="text-sm text-gray-600">
                {type.reference}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}