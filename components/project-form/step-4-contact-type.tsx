import { ProjectData } from '@/types/project';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Step4ContactTypeProps {
  formData: ProjectData;
  updateStepField: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number, comment: string) => void;
  removeStepField: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => void;
  getStepFieldComment: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => string;
  isStepFieldSelected: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => boolean;
}

interface FieldData {
  id: number;
  name: string;
  code: string;
  parent_code: string | null;
  has_comment: boolean;
  children: FieldData[];
}

export function Step4ContactType({ 
  formData, 
  updateStepField, 
  removeStepField, 
  getStepFieldComment, 
  isStepFieldSelected 
}: Step4ContactTypeProps) {
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

  const toggleContactType = (fieldId: number) => {
    if (isStepFieldSelected('step4Fields', fieldId)) {
      // Si ya está seleccionado, lo removemos
      removeStepField('step4Fields', fieldId);
    } else {
      // Si no está seleccionado, lo agregamos con comentario vacío
      updateStepField('step4Fields', fieldId, '');
    }
  };

  const updateComment = (fieldId: number, comment: string) => {
    updateStepField('step4Fields', fieldId, comment);
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
          const isSelected = isStepFieldSelected('step4Fields', type.id);
          const currentComment = getStepFieldComment('step4Fields', type.id);
          const contactNumber = getContactNumber(type.code);

          return (
            <label key={type.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-amber-100/10 cursor-pointer transition-colors duration-200">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleContactType(type.id)}
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
                      onChange={(e) => updateComment(type.id, e.target.value)}
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