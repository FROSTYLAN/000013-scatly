'use client';

import { ProjectData } from '@/types/form-types';
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
  formData: ProjectData;
  updateNACStatus: (categoryIndex: number, subcategoryIndex: number, status: 'P' | 'E' | 'C' | '') => void;
  updateNACComment: (categoryIndex: number, subcategoryIndex: number, comment: string) => void;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

export function Step7CorrectiveActions({ 
  formData, 
  updateNACStatus,
  updateNACComment,
  updateFormData
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
          
          // Sincronizar formData.nacCategories con las categorías de la API
          const updatedNACCategories = sortedCategories.map((apiCategory: any) => {
            // Buscar si ya existe esta categoría en formData
            const existingCategory = formData.nacCategories.find(cat => 
              cat.category === apiCategory.name || cat.category.includes(apiCategory.name)
            );
            
            if (existingCategory) {
              // Si existe, mantener los datos existentes pero actualizar subcategorías si es necesario
              return {
                category: apiCategory.name,
                subcategories: apiCategory.children.map((apiSub: any) => {
                  const existingSub = existingCategory.subcategories.find(sub => sub.code === apiSub.code);
                  return existingSub || {
                    code: apiSub.code,
                    description: apiSub.name,
                    status: '' as const,
                    comment: ''
                  };
                })
              };
            } else {
              // Si no existe, crear nueva categoría
              return {
                category: apiCategory.name,
                subcategories: apiCategory.children.map((apiSub: any) => ({
                  code: apiSub.code,
                  description: apiSub.name,
                  status: '' as const,
                  comment: ''
                }))
              };
            }
          });
          
          // Actualizar formData con las categorías sincronizadas
          updateFormData('nacCategories', updatedNACCategories);
          
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

  // Helper function to find category and subcategory indices in formData
  const findFormDataIndices = (categoryName: string, subcategoryCode: string) => {
    console.log('Buscando categoría:', categoryName);
    console.log('Categorías disponibles en formData:', formData.nacCategories.map(cat => cat.category));
    
    const categoryIndex = formData.nacCategories.findIndex(cat => 
      cat.category.includes(categoryName) || cat.category === categoryName
    );
    
    console.log('Índice de categoría encontrado:', categoryIndex);
    
    if (categoryIndex === -1) return { categoryIndex: -1, subcategoryIndex: -1 };
    
    const subcategoryIndex = formData.nacCategories[categoryIndex].subcategories.findIndex(sub => 
      sub.code === subcategoryCode
    );
    
    console.log('Índice de subcategoría encontrado:', subcategoryIndex);
    
    return { categoryIndex, subcategoryIndex };
  };
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

      {/* NAC Categories */}
      {!loading && !error && (
        <div className="space-y-6">
        {nacCategories.map((category, apiCategoryIndex) => {
          // Find corresponding category in formData
          const formCategoryIndex = formData.nacCategories.findIndex(cat => 
            cat.category.includes(category.name) || cat.category === category.name
          );
          
          return (
            <div key={`category-${apiCategoryIndex}`} className="space-y-4">
              <h3 className="font-medium text-center pb-2 border-b">{category.name}</h3>
              
              <div className="grid gap-2">
                {category.children.map((subcategory, apiSubcategoryIndex) => {
                  // Find corresponding subcategory in formData
                  const { categoryIndex, subcategoryIndex } = findFormDataIndices(category.name, subcategory.code);
                  
                  const formSubcategory = categoryIndex >= 0 && subcategoryIndex >= 0 
                    ? formData.nacCategories[categoryIndex].subcategories[subcategoryIndex]
                    : null;
                  
                  return (
                    <div key={`subcategory-${apiCategoryIndex}-${apiSubcategoryIndex}`} 
                         className="space-y-2">
                      <div className="flex items-center gap-4 p-3 hover:bg-amber-100/10 rounded-lg transition-colors duration-200">
                        <span className="flex-1 text-sm">{subcategory.name}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (categoryIndex >= 0 && subcategoryIndex >= 0) {
                                updateNACStatus(categoryIndex, subcategoryIndex, 'P');
                              }
                            }}
                            className={`px-3 py-1 rounded transition-colors ${formSubcategory?.status === 'P' ? 'bg-amber-500 text-white' : 'text-amber-500 hover:bg-amber-100/20'}`}
                          >
                            P
                          </button>
                          <button
                            onClick={() => {
                              if (categoryIndex >= 0 && subcategoryIndex >= 0) {
                                updateNACStatus(categoryIndex, subcategoryIndex, 'E');
                              }
                            }}
                            className={`px-3 py-1 rounded transition-colors ${formSubcategory?.status === 'E' ? 'bg-amber-500 text-white' : 'text-amber-500 hover:bg-amber-100/20'}`}
                          >
                            E
                          </button>
                          <button
                            onClick={() => {
                              if (categoryIndex >= 0 && subcategoryIndex >= 0) {
                                updateNACStatus(categoryIndex, subcategoryIndex, 'C');
                              }
                            }}
                            className={`px-3 py-1 rounded transition-colors ${formSubcategory?.status === 'C' ? 'bg-amber-500 text-white' : 'text-amber-500 hover:bg-amber-100/20'}`}
                          >
                            C
                          </button>
                        </div>
                      </div>
                      {formSubcategory?.status && (
                        <div className="pl-[76px] pr-4">
                          <textarea
                            placeholder="Agregar un comentario..."
                            value={formSubcategory.comment}
                            onChange={(e) => {
                              if (categoryIndex >= 0 && subcategoryIndex >= 0) {
                                updateNACComment(categoryIndex, subcategoryIndex, e.target.value);
                              }
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

       <div className="p-4 rounded-lg border border-amber-200 bg-amber-100/10">
        <h4 className="font-medium mb-2">P-E-C LEYENDA:</h4>
        <div className="space-y-1 text-sm">
          <p><strong>P</strong> = ¿Tenemos estándares de programa para esta actividad?</p>
          <p><strong>E</strong> = ¿Son adecuados los estándares existentes?</p>
          <p><strong>C</strong> = ¿Hay un cumplimiento total de los estándares?</p>
        </div>
      </div>
    </div>
  );
}