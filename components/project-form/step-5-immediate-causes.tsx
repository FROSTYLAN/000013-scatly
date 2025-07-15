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
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

export function Step5ImmediateCauses({ formData, updateFormData }: Step5Props) {
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

  const getFormFieldForActs = (code: string): 'immediateActionsUnsafe' => {
    return 'immediateActionsUnsafe';
  };

  const getFormFieldForConditions = (code: string): 'immediateConditionsUnsafe' => {
    return 'immediateConditionsUnsafe';
  };

  const getLastNumber = (code: string): number => {
    const match = code.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };


  const toggleItem = (field: 'immediateActionsUnsafe' | 'immediateConditionsUnsafe', fieldData: FieldData) => {
    const currentItems = formData[field] || [];
    const itemIndex = currentItems.findIndex(item => item.text === fieldData.name);

    if (itemIndex >= 0) {
      const newItems = currentItems.filter(item => item.text !== fieldData.name);
      updateFormData(field, newItems);
    } else {
      const sortedSubcauses = fieldData.children.sort((a, b) => {
        const numA = getLastNumber(a.code);
        const numB = getLastNumber(b.code);
        return numA - numB;
      });

      const newItem = {
        text: fieldData.name,
        comment: '',
        reference: `(${fieldData.code})`,
        subcauses: sortedSubcauses.map(child => ({
          text: child.name,
          selected: false,
          comment: ''
        }))
      };
      updateFormData(field, [...currentItems, newItem]);
    }
  };

  const updateComment = (field: 'immediateActionsUnsafe' | 'immediateConditionsUnsafe', text: string, comment: string) => {
    const currentItems = formData[field] || [];
    const newItems = currentItems.map(item => 
      item.text === text ? { ...item, comment } : item
    );
    updateFormData(field, newItems);
  };

  const toggleSubcause = (field: 'immediateActionsUnsafe' | 'immediateConditionsUnsafe', itemText: string, subcauseText: string) => {
    const currentItems = formData[field] || [];
    const newItems = currentItems.map(item => {
      if (item.text === itemText) {
        return {
          ...item,
          subcauses: item.subcauses.map(subcause => 
            subcause.text === subcauseText
              ? { ...subcause, selected: !subcause.selected }
              : subcause
          )
        };
      }
      return item;
    });
    updateFormData(field, newItems);
  };

  const updateSubcauseComment = (field: 'immediateActionsUnsafe' | 'immediateConditionsUnsafe', itemText: string, subcauseText: string, comment: string) => {
    const currentItems = formData[field] || [];
    const newItems = currentItems.map(item => {
      if (item.text === itemText) {
        return {
          ...item,
          subcauses: item.subcauses.map(subcause => 
            subcause.text === subcauseText
              ? { ...subcause, comment }
              : subcause
          )
        };
      }
      return item;
    });
    updateFormData(field, newItems);
  };

  const renderCauseSection = (category: FieldData, field: 'immediateActionsUnsafe' | 'immediateConditionsUnsafe', title: string, colorClass: string) => {
    const sortedCauses = category.children.sort((a, b) => {
      const numA = getLastNumber(a.code);
      const numB = getLastNumber(b.code);
      return numA - numB;
    });

    return (
      <div className="space-y-4">
        <h3 className="font-medium text-center pb-2 border-b">{title}</h3>
        <div className="space-y-2">
          {sortedCauses.map((cause) => {
            const isSelected = formData[field]?.some(item => item.text === cause.name) || false;
            const currentItem = formData[field]?.find(item => item.text === cause.name);

            return (
              <label key={cause.id} className={`flex items-start space-x-3 p-3 rounded-lg hover:${colorClass}/10 cursor-pointer transition-colors duration-200`}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleItem(field, cause)}
                  className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                />
                <div className="space-y-2 flex-1">
                  <div className="text-sm font-medium">{cause.name}</div>
                  {isSelected && currentItem && (
                    <div className="mt-2 space-y-2">
                      {cause.children.length > 0 && (
                        <>
                          <div className="text-xs text-gray-600 font-medium">Subcausas:</div>
                          <div className="space-y-3">
                            {currentItem.subcauses.map((subcause, index) => (
                              <div key={index} className="pl-4 space-y-2">
                                <label className={`flex items-start space-x-2 p-2 rounded hover:${colorClass}/20 transition-colors duration-200`}>
                                  <input
                                    type="checkbox"
                                    checked={subcause.selected}
                                    onChange={() => toggleSubcause(field, cause.name, subcause.text)}
                                    className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                                  />
                                  <span className="text-xs text-gray-300">{subcause.text}</span>
                                </label>
                                {subcause.selected && (
                                  <textarea
                                    placeholder="Agregar un comentario para esta subcausa..."
                                    value={subcause.comment}
                                    onChange={(e) => updateSubcauseComment(field, cause.name, subcause.text, e.target.value)}
                                    className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                                    rows={2}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      {cause.has_comment && (
                        <textarea
                          placeholder="Agregar un comentario general..."
                          value={currentItem.comment}
                          onChange={(e) => updateComment(field, cause.name, e.target.value)}
                          className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                          rows={3}
                        />
                      )}
                    </div>
                  )}
                </div>
              </label>
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
        {unsafeActsCategory && renderCauseSection(
          unsafeActsCategory,
          'immediateActionsUnsafe',
          unsafeActsCategory.name,
          'bg-purple-100'
        )}

        {/* Condiciones Subestándares/Inseguras */}
        {unsafeConditionsCategory && renderCauseSection(
          unsafeConditionsCategory,
          'immediateConditionsUnsafe',
          unsafeConditionsCategory.name,
          'bg-amber-100'
        )}
      </div>
    </div>
  );
}