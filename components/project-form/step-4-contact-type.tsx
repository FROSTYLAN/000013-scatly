import { ProjectData } from '@/types/project';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getVisibleFields, FIELD_DEPENDENCIES } from '@/lib/default-fields';

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

  // Obtener selecciones del Step 3 para filtrar campos visibles
  const getSelectedFieldsFromStep3 = (): string[] => {
    const step3Fields = formData.step3Fields || [];
    const selectedCodes: string[] = [];
    
    // Mapear fieldId a code usando el contactData si está disponible
    step3Fields.forEach((field: any) => {
      // Para esto necesitamos obtener también los datos del Step 3 o usar una forma diferente
      // Por simplicidad, asumimos que contactData contiene la referencia de codes
      // En una implementación real, esto podría requerir una llamada adicional a la API
      
      // Por ahora usaremos códigos estáticos basados en la estructura conocida
      if (field.fieldId) {
        // Mapeo temporal basado en la estructura conocida del Step 3
        const step3Mapping: Record<number, string> = {
          // Estos IDs deberían coincidir con los fieldId del Step 3
          // Se pueden obtener inspeccionando la respuesta de /api/fields/STEP_3
          // Ejemplo de mapeo (ajustar según datos reales):
          51: 'S3_1_1', // Mayor (A)
          52: 'S3_1_2', // Grave (B)
          53: 'S3_1_3', // Menor (C)
          61: 'S3_2_1', // Alta (A)
          62: 'S3_2_2', // Moderada (B)
          63: 'S3_2_3', // Rara (C)
          71: 'S3_3_1', // Grande (A)
          72: 'S3_3_2', // Moderada (B)
          73: 'S3_3_3', // Baja (C)
        };
        
        const code = step3Mapping[field.fieldId];
        if (code) {
          selectedCodes.push(code);
        }
      }
    });
    
    return selectedCodes;
  };

  // Filtrar campos visibles basado en selecciones del Step 3
  const getFilteredChildren = () => {
    if (!contactData) return [];
    
    const selectedStep3Fields = getSelectedFieldsFromStep3();
    
    // Si no hay selecciones en Step 3, mostrar todos los campos
    if (selectedStep3Fields.length === 0) {
      return contactData.children;
    }
    
    // Obtener códigos de campos visibles basado en dependencias
    const visibleFieldCodes = new Set<string>();
    
    selectedStep3Fields.forEach(selectedField => {
      if (FIELD_DEPENDENCIES[selectedField]) {
        FIELD_DEPENDENCIES[selectedField].forEach(dependentField => {
          visibleFieldCodes.add(dependentField);
        });
      }
    });
    
    // Si no hay dependencias específicas, mostrar todos los campos
    if (visibleFieldCodes.size === 0) {
      return contactData.children;
    }
    
    // Filtrar campos que están en las dependencias
    return contactData.children.filter(field => visibleFieldCodes.has(field.code));
  };

  const sortedChildren = getFilteredChildren().sort((a, b) => {
    const numA = getContactNumber(a.code);
    const numB = getContactNumber(b.code);
    return numA - numB;
  });

  if (loading) {
    return <LoadingSpinner title="Tipo de contacto o cuasi contacto con energía o sustancia" />;
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

  const selectedStep3Fields = getSelectedFieldsFromStep3();
  const hasStep3Selections = selectedStep3Fields.length > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{contactData?.name || 'Tipo de Contacto o Cuasi Contacto con Energía o Sustancia'}</h2>
      
      {/* Mostrar información sobre el filtrado */}
      {hasStep3Selections && (
        <div className="p-4 rounded-lg border border-amber-200 bg-amber-100/10">
          <p className="text-sm text-amber-300">
            <strong>Campos filtrados:</strong> Mostrando opciones relevantes basadas en sus selecciones del Step 3.
            {sortedChildren.length === 0 && (
              <span className="block mt-2 text-amber-400">
                No hay campos de contacto asociados a sus selecciones actuales del Step 3.
              </span>
            )}
          </p>
        </div>
      )}
      
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
        
        {sortedChildren.length === 0 && hasStep3Selections && (
          <div className="text-center py-8 text-gray-400">
            <p>Complete las selecciones en el Step 3 para ver las opciones de contacto relevantes.</p>
          </div>
        )}
      </div>
    </div>
  );
}