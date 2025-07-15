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
}

export function Step7CorrectiveActions({ 
  formData, 
  updateNACStatus,
  updateNACComment
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
        const response = await fetch('/api/fields/STEP_7');
        const data = await response.json();
        
        if (data.success && data.data) {
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

  // Helper function to find category and subcategory indices in formData
  const findFormDataIndices = (categoryCode: string, subcategoryCode: string) => {
    const categoryIndex = formData.nacCategories.findIndex(cat => 
      cat.category.includes(categoryCode) || cat.category === categoryCode
    );
    
    if (categoryIndex === -1) return { categoryIndex: -1, subcategoryIndex: -1 };
    
    const subcategoryIndex = formData.nacCategories[categoryIndex].subcategories.findIndex(sub => 
      sub.code === subcategoryCode
    );
    
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
              <div className="text-xs text-gray-500 text-center">{category.code}</div>
              
              <div className="grid gap-2">
                {category.children.map((subcategory, apiSubcategoryIndex) => {
                  // Find corresponding subcategory in formData
                  const { categoryIndex, subcategoryIndex } = findFormDataIndices(category.code, subcategory.code);
                  
                  const formSubcategory = categoryIndex >= 0 && subcategoryIndex >= 0 
                    ? formData.nacCategories[categoryIndex].subcategories[subcategoryIndex]
                    : null;
                  
                  return (
                    <div key={`subcategory-${apiCategoryIndex}-${apiSubcategoryIndex}`} 
                         className="space-y-2">
                      <div className="flex items-center gap-4 p-3 hover:bg-amber-100/10 rounded-lg transition-colors duration-200">
                        <span className="min-w-[60px] text-sm font-medium">{subcategory.code}</span>
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