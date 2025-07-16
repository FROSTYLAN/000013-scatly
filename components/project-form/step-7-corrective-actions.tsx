'use client';

import { ProjectData } from '@/types/project';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface FieldData {
  id: number;
  name: string;
  code: string;
  parent_code: string | null;
  has_comment: boolean;
  children: FieldData[];
}

interface Step7Props {
  formData: any;
  updateNACField: (fieldId: number, comment: string, allFields?: any[]) => Promise<void>;
  removeNACField: (fieldId: number, allFields?: any[]) => Promise<void>;
  getNACFieldComment: (fieldId: number) => string;
  isNACFieldSelected: (fieldId: number) => boolean;
}

export function Step7CorrectiveActions({
  formData,
  updateNACField,
  removeNACField,
  getNACFieldComment,
  isNACFieldSelected
}: Step7Props) {
  const [nacCategories, setNacCategories] = useState<FieldData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to extract the last number from a code string
  const getLastNumber = (code: string): number => {
    const matches = code.match(/\d+/g);
    if (matches && matches.length > 0) {
      return parseInt(matches[matches.length - 1], 10);
    }
    return 0;
  };

  // Helper function to get P, E, C fields for a parent field
  const getPECFields = (parentField: FieldData, allFields: FieldData[]): { P?: FieldData, E?: FieldData, C?: FieldData } => {
    const pecFields = allFields.filter(field => field.parent_code === parentField.code);
    return {
      P: pecFields.find(field => field.name === 'P'),
      E: pecFields.find(field => field.name === 'E'),
      C: pecFields.find(field => field.name === 'C')
    };
  };

  // Helper function to flatten all fields from the hierarchical structure
  const flattenFields = (fields: FieldData[]): FieldData[] => {
    const result: FieldData[] = [];
    
    const flatten = (fieldList: FieldData[]) => {
      fieldList.forEach(field => {
        result.push(field);
        if (field.children && field.children.length > 0) {
          flatten(field.children);
        }
      });
    };
    
    flatten(fields);
    return result;
  };

  useEffect(() => {
    const fetchNACCategories = async () => {
      try {
        setLoading(true);

        // Obtener token de localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('No hay token de autenticación');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/fields/STEP_7', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (data.success && data.data) {
          console.log('Datos de la API:', data.data);
          const sortedCategories = (data.data.children || []).sort((a: any, b: any) => {
            const numA = getLastNumber(a.code);
            const numB = getLastNumber(b.code);
            return numA - numB;
          }).map((category: any) => ({
            ...category,
            children: category.children.sort((a: any, b: any) => {
              const numA = getLastNumber(a.code);
              const numB = getLastNumber(b.code);
              return numA - numB;
            })
          }));

          console.log('Categorías de la API:', sortedCategories.map((cat: any) => cat.name));
          setNacCategories(sortedCategories);

          setError(null);
        } else {
          setError('Failed to load NAC categories');
        }
      } catch (err) {
        console.error('Error fetching NAC categories:', err);
        setError('Error fetching NAC categories');
      } finally {
        setLoading(false);
      }
    };

    fetchNACCategories();
  }, []);

  if (loading) {
    return (
      <LoadingSpinner
        title="Necesidades de acción de control (NAC) = Falta de control"
        message="Cargando categorías NAC..."
      />
    );
  }


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Necesidades de Acción de Control (NAC) = Falta de Control</h2>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-amber-500">Cargando categorías NAC...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="text-red-500">Error al cargar las categorías: {error}</div>
        </div>
      )}

      <div className="p-4 rounded-lg border border-amber-200 bg-amber-100/10">
        <h4 className="font-medium mb-2">P-E-C LEYENDA:</h4>
        <div className="space-y-1 text-sm">
          <p><strong>P</strong> = ¿Tenemos estándares de programa para esta actividad?</p>
          <p><strong>E</strong> = ¿Son adecuados los estándares existentes?</p>
          <p><strong>C</strong> = ¿Hay un cumplimiento total de los estándares?</p>
        </div>
      </div>

      {/* NAC Categories */}
      {!loading && !error && (
        <div className="space-y-6">
          {nacCategories.map((category, apiCategoryIndex) => {
            // Get all fields flattened to find P, E, C fields
            const allFields = flattenFields([category]);
            
            return (
              <div key={`category-${apiCategoryIndex}`} className="space-y-4">
                <h3 className="font-medium text-center pb-2 border-b">{category.name}</h3>

                <div className="grid gap-2">
                  {category.children.map((subcategory, apiSubcategoryIndex) => {
                    // Only show subcategories that have has_comment: true
                    if (!subcategory.has_comment) {
                      return null;
                    }

                    // Get P, E, C fields for this subcategory
                    const pecFields = getPECFields(subcategory, allFields);

                    return (
                      <div key={`subcategory-${apiCategoryIndex}-${apiSubcategoryIndex}`}
                        className="space-y-2">
                        <div className="flex items-center gap-4 p-3 hover:bg-amber-100/10 rounded-lg transition-colors duration-200">
                          <span className="flex-1 text-sm">{subcategory.name}</span>
                          <div className="flex gap-2">
                            {/* P Button */}
                            {pecFields.P && (
                              <button
                                onClick={async () => {
                                  if (isNACFieldSelected(pecFields.P!.id)) {
                                    await removeNACField(pecFields.P!.id, allFields);
                                  } else {
                                    await updateNACField(pecFields.P!.id, '', allFields);
                                  }
                                }}
                                className={`px-3 py-1 rounded transition-colors ${
                                  isNACFieldSelected(pecFields.P.id) 
                                    ? 'bg-amber-500 text-white' 
                                    : 'text-amber-500 hover:bg-amber-100/20'
                                }`}
                              >
                                P
                              </button>
                            )}
                            {/* E Button */}
                            {pecFields.E && (
                              <button
                                onClick={async () => {
                                  if (isNACFieldSelected(pecFields.E!.id)) {
                                    await removeNACField(pecFields.E!.id, allFields);
                                  } else {
                                    await updateNACField(pecFields.E!.id, '', allFields);
                                  }
                                }}
                                className={`px-3 py-1 rounded transition-colors ${
                                  isNACFieldSelected(pecFields.E.id) 
                                    ? 'bg-amber-500 text-white' 
                                    : 'text-amber-500 hover:bg-amber-100/20'
                                }`}
                              >
                                E
                              </button>
                            )}
                            {/* C Button */}
                            {pecFields.C && (
                              <button
                                onClick={async () => {
                                  if (isNACFieldSelected(pecFields.C!.id)) {
                                    await removeNACField(pecFields.C!.id, allFields);
                                  } else {
                                    await updateNACField(pecFields.C!.id, '', allFields);
                                  }
                                }}
                                className={`px-3 py-1 rounded transition-colors ${
                                  isNACFieldSelected(pecFields.C.id) 
                                    ? 'bg-amber-500 text-white' 
                                    : 'text-amber-500 hover:bg-amber-100/20'
                                }`}
                              >
                                C
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Show comment areas for active P, E, C fields */}
                        {pecFields.P && isNACFieldSelected(pecFields.P.id) && (
                          <div className="pl-[76px] pr-4">
                            <div className="text-xs text-amber-400 mb-1">P - ¿Tenemos estándares de programa para esta actividad?</div>
                            <textarea
                              placeholder="Agregar un comentario..."
                              value={getNACFieldComment(pecFields.P.id)}
                              onChange={(e) => {
                                updateNACField(pecFields.P!.id, e.target.value, allFields);
                              }}
                              className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                              rows={2}
                            />
                          </div>
                        )}
                        
                        {pecFields.E && isNACFieldSelected(pecFields.E.id) && (
                          <div className="pl-[76px] pr-4">
                            <div className="text-xs text-amber-400 mb-1">E - ¿Son adecuados los estándares existentes?</div>
                            <textarea
                              placeholder="Agregar un comentario..."
                              value={getNACFieldComment(pecFields.E.id)}
                              onChange={(e) => {
                                updateNACField(pecFields.E!.id, e.target.value, allFields);
                              }}
                              className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                              rows={2}
                            />
                          </div>
                        )}
                        
                        {pecFields.C && isNACFieldSelected(pecFields.C.id) && (
                          <div className="pl-[76px] pr-4">
                            <div className="text-xs text-amber-400 mb-1">C - ¿Hay un cumplimiento total de los estándares?</div>
                            <textarea
                              placeholder="Agregar un comentario..."
                              value={getNACFieldComment(pecFields.C.id)}
                              onChange={(e) => {
                                updateNACField(pecFields.C!.id, e.target.value, allFields);
                              }}
                              className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}