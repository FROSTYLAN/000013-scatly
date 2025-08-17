import { ProjectData } from '@/types/project';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FIELD_DEPENDENCIES } from '@/lib/default-fields';

interface FieldData {
  id: number;
  name: string;
  code: string;
  parent_code: string | null;
  has_comment: boolean;
  created_at: string;
  updated_at: string;
  children: FieldData[];
}

interface Step5ImmediateCausesProps {
  formData: ProjectData;
  updateStepField: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number, comment: string) => void;
  removeStepField: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => void;
  getStepFieldComment: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => string;
  isStepFieldSelected: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => boolean;
}

export function Step5ImmediateCauses({ 
  formData, 
  updateStepField, 
  removeStepField, 
  getStepFieldComment, 
  isStepFieldSelected 
}: Step5ImmediateCausesProps) {
  const [fieldsData, setFieldsData] = useState<FieldData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        // Obtener token de localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('No hay token de autenticación');
          return;
        }
        
        const response = await fetch('/api/fields/STEP_5', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        
        if (result.success) {
          setFieldsData(result.data);
        } else {
          setError('Error al cargar los campos');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  // Obtener selecciones del Step 4 para filtrar campos visibles
  const getSelectedFieldsFromStep4 = (): string[] => {
    const step4Fields = formData.step4Fields || [];
    const selectedCodes: string[] = [];
    
    step4Fields.forEach((field: any) => {
      if (field.fieldId) {
        // Mapeo temporal basado en la estructura conocida del Step 4
        const step4Mapping: Record<number, string> = {
          // Estos IDs deberían coincidir con los fieldId del Step 4
          // Ejemplo de mapeo (ajustar según datos reales de la API):
          81: 'S4_1', // Golpeada Contra
          82: 'S4_2', // Golpeado por
          83: 'S4_3', // Caída a nivel más bajo
          84: 'S4_4', // Caída mismo nivel
          85: 'S4_5', // Atrapado
          86: 'S4_6', // Cogido
          87: 'S4_7', // Atrapado entre
          88: 'S4_8', // Contacto con energía
          89: 'S4_9', // Sobretensión
        };
        
        const code = step4Mapping[field.fieldId];
        if (code) {
          selectedCodes.push(code);
        }
      }
    });
    
    return selectedCodes;
  };

  // Filtrar causas basado en selecciones del Step 4
  const getFilteredCategory = (category: FieldData) => {
    const selectedStep4Fields = getSelectedFieldsFromStep4();
    
    // Si no hay selecciones en Step 4, mostrar todas las causas
    if (selectedStep4Fields.length === 0) {
      return category;
    }
    
    // Obtener códigos de campos visibles basado en dependencias
    const visibleFieldCodes = new Set<string>();
    
    selectedStep4Fields.forEach(selectedField => {
      if (FIELD_DEPENDENCIES[selectedField]) {
        FIELD_DEPENDENCIES[selectedField].forEach(dependentField => {
          visibleFieldCodes.add(dependentField);
        });
      }
    });
    
    // Si no hay dependencias específicas, mostrar todas las causas
    if (visibleFieldCodes.size === 0) {
      return category;
    }
    
    // Filtrar causas que están en las dependencias
    const filteredChildren = category.children.filter(cause => 
      visibleFieldCodes.has(cause.code)
    );
    
    return {
      ...category,
      children: filteredChildren
    };
  };

  if (loading) {
    return <LoadingSpinner title="Causas inmediatas o directas (CI)" />;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!fieldsData) {
    return <div className="text-center py-8">No se encontraron datos</div>;
  }

  // Get the two main categories from the API data and filter them
  const unsafeActsCategory = fieldsData.children.find(child => child.code === 'S5_C1');
  const unsafeConditionsCategory = fieldsData.children.find(child => child.code === 'S5_C2');

  const filteredUnsafeActs = unsafeActsCategory ? getFilteredCategory(unsafeActsCategory) : null;
  const filteredUnsafeConditions = unsafeConditionsCategory ? getFilteredCategory(unsafeConditionsCategory) : null;

  const getLastNumber = (code: string): number => {
    const match = code.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const toggleField = (fieldId: number) => {
    if (isStepFieldSelected('step5Fields', fieldId)) {
      removeStepField('step5Fields', fieldId);
    } else {
      updateStepField('step5Fields', fieldId, '');
    }
  };

  const updateFieldComment = (fieldId: number, comment: string) => {
    updateStepField('step5Fields', fieldId, comment);
  };

  const renderCategory = (category: FieldData) => {
    const sortedCauses = category.children.sort((a, b) => {
      const numA = getLastNumber(a.code);
      const numB = getLastNumber(b.code);
      return numA - numB;
    });

    return (
      <div className="space-y-4">
        <h3 className="font-medium text-center pb-2 border-b">{category.name}</h3>
        
        {/* Mostrar información sobre el filtrado si hay filtros aplicados */}
        {getSelectedFieldsFromStep4().length > 0 && (
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-100/10">
            <p className="text-xs text-amber-300">
              <strong>Filtrado activo:</strong> Mostrando causas relevantes basadas en el tipo de contacto seleccionado.
              {sortedCauses.length === 0 && (
                <span className="block mt-1 text-amber-400">
                  No hay causas asociadas a sus selecciones del Step 4.
                </span>
              )}
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          {sortedCauses.map((cause) => {
            const isSelected = isStepFieldSelected('step5Fields', cause.id);
            const currentComment = getStepFieldComment('step5Fields', cause.id);

            // Sort subcauses
            const sortedSubcauses = cause.children.sort((a, b) => {
              const numA = getLastNumber(a.code);
              const numB = getLastNumber(b.code);
              return numA - numB;
            });

            return (
              <div key={cause.id} className="space-y-2">
                {/* Main cause */}
                <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-100/10 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleField(cause.id)}
                    className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                  />
                  <div className="space-y-2 flex-1">
                    <div className="text-sm font-medium">{cause.name}</div>
                  </div>
                </label>

                {/* Subcauses - Only show when main cause is selected */}
                {isSelected && sortedSubcauses.length > 0 && (
                  <div className="ml-8 space-y-2">
                    {sortedSubcauses.map((subcause) => {
                      const isSubcauseSelected = isStepFieldSelected('step5Fields', subcause.id);
                      const subcauseComment = getStepFieldComment('step5Fields', subcause.id);

                      return (
                        <div key={subcause.id} className="space-y-2">
                          <label className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-100/5 cursor-pointer transition-colors duration-200">
                            <input
                              type="checkbox"
                              checked={isSubcauseSelected}
                              onChange={() => toggleField(subcause.id)}
                              className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                            />
                            <div className="flex-1">
                              <div className="text-sm text-gray-300">{subcause.name}</div>
                            </div>
                          </label>
                          {isSubcauseSelected && (
                            <div className="ml-6">
                              <textarea
                                placeholder="Agregar un comentario para esta subcausa..."
                                value={subcauseComment}
                                onChange={(e) => updateFieldComment(subcause.id, e.target.value)}
                                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                                rows={2}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* General comment for main cause */}
                {isSelected && (
                  <div className="ml-6 mt-3">
                    <textarea
                      placeholder="Comentario general para esta causa..."
                      value={currentComment}
                      onChange={(e) => updateFieldComment(cause.id, e.target.value)}
                      className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            );
          })}
          
          {sortedCauses.length === 0 && getSelectedFieldsFromStep4().length > 0 && (
            <div className="text-center py-4 text-gray-400">
              <p className="text-sm">No hay {category.name.toLowerCase()} asociadas a sus selecciones del Step 4.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const selectedStep4Fields = getSelectedFieldsFromStep4();
  const hasStep4Selections = selectedStep4Fields.length > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{fieldsData.name}</h2>
      
      {/* Información general sobre el filtrado */}
      {hasStep4Selections && (
        <div className="p-4 rounded-lg border border-amber-200 bg-amber-100/10">
          <p className="text-sm text-amber-300">
            <strong>Filtrado inteligente:</strong> Las causas inmediatas mostradas están relacionadas con el tipo de contacto seleccionado en el Step 4.
          </p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Actos Subestándares/Inseguros */}
        {filteredUnsafeActs && renderCategory(filteredUnsafeActs)}

        {/* Condiciones Subestándares/Inseguras */}
        {filteredUnsafeConditions && renderCategory(filteredUnsafeConditions)}
      </div>
    </div>
  );
}