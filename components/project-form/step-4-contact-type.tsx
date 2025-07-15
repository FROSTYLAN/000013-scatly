import { ProjectData } from '@/types/form-types';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Step4Props {
  formData: ProjectData;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

interface FieldData {
  id: number;
  name: string;
  code: string;
  parent_code: string | null;
  has_comment: boolean;
  children: FieldData[];
}

export function Step4ContactType({ formData, updateFormData }: Step4Props) {
  const [contactData, setContactData] = useState<FieldData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFieldData = async () => {
      try {
        setLoading(true);
        
        // Obtener token de localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('No hay token de autenticación');
          setLoading(false);
          return;
        }
        
        const response = await fetch('/api/fields/STEP_4', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        
        if (result.success) {
          setContactData(result.data);
        } else {
          setError('Error al cargar los campos');
        }
      } catch (err) {
        setError('Error de conexión');
        console.error('Error fetching field data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFieldData();
  }, []);

  const toggleContactType = (title: string, code: string) => {
    const currentTypes = formData.contactTypes || [];
    const typeIndex = currentTypes.findIndex(t => t.title === title);
    
    if (typeIndex >= 0) {
      // Si ya existe, lo removemos
      const newTypes = currentTypes.filter(t => t.title !== title);
      updateFormData('contactTypes', newTypes);
    } else {
      // Si no existe, lo agregamos con un comentario vacío
      updateFormData('contactTypes', [...currentTypes, { title, comment: '', code }]);
    }
  };

  const updateComment = (title: string, comment: string) => {
    const currentTypes = formData.contactTypes || [];
    const newTypes = currentTypes.map(t => 
      t.title === title ? { ...t, comment } : t
    );
    updateFormData('contactTypes', newTypes);
  };

  const getContactNumber = (code: string) => {
    const match = code.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const sortedChildren = contactData?.children.sort((a, b) => {
    const numA = getContactNumber(a.code);
    const numB = getContactNumber(b.code);
    return numA - numB;
  }) || [];

  if (loading) {
    return <LoadingSpinner title="Tipo de contacto o cuasi contacto con energía o sustancia
" />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tipo de Contacto o Cuasi Contacto con Energía o Sustancia</h2>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{contactData?.name || 'Tipo de Contacto o Cuasi Contacto con Energía o Sustancia'}</h2>
      
      <div className="space-y-4">
        {sortedChildren.map((type) => {
          const isSelected = formData.contactTypes?.some(t => t.title === type.name) || false;
          const currentComment = formData.contactTypes?.find(t => t.title === type.name)?.comment || '';
          const contactNumber = getContactNumber(type.code);

          return (
            <label key={type.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-amber-100/10 cursor-pointer transition-colors duration-200">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleContactType(type.name, type.code)}
                className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
              />
              <div className="space-y-2 flex-1">
                <div className="font-medium">
                  {contactNumber}. {type.name}
                </div>
                {isSelected && type.has_comment && (
                  <div className="mt-2">
                    <textarea
                      placeholder="Agregar un comentario..."
                      value={currentComment}
                      onChange={(e) => updateComment(type.name, e.target.value)}
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