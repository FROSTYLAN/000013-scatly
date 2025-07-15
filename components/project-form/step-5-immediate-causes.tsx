import { ProjectData } from '@/types/form-types';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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

interface Step5Props {
  formData: ProjectData;
  updateStepField: (step: 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields', fieldId: number, comment: string) => void;
  removeStepField: (step: 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields', fieldId: number) => void;
  getStepFieldComment: (step: 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields', fieldId: number) => string;
  isStepFieldSelected: (step: 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields', fieldId: number) => boolean;
}

export function Step5ImmediateCauses({ 
  formData, 
  updateStepField, 
  removeStepField, 
  getStepFieldComment, 
  isStepFieldSelected 
}: Step5Props) {
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

  if (loading) {
    return <LoadingSpinner title="Causas inmediatas o directas (CI)" />;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!fieldsData) {
    return <div className="text-center py-8">No se encontraron datos</div>;
  }

  // Get the two main categories from the API data
  const unsafeActsCategory = fieldsData.children.find(child => child.code === 'S5_C1');
  const unsafeConditionsCategory = fieldsData.children.find(child => child.code === 'S5_C2');

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
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{fieldsData.name}</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Actos Subestándares/Inseguros */}
        {unsafeActsCategory && renderCategory(unsafeActsCategory)}

        {/* Condiciones Subestándares/Inseguras */}
        {unsafeConditionsCategory && renderCategory(unsafeConditionsCategory)}
      </div>
    </div>
  );
}