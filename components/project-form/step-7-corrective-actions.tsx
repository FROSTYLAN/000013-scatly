import { ProjectData, CorrectiveAction } from '@/types/project';

interface Step7Props {
  formData: ProjectData;
  updateNACStatus: (categoryIndex: number, subcategoryIndex: number, status: 'P' | 'E' | 'C' | '') => void;
}

export function Step7CorrectiveActions({ 
  formData, 
  updateNACStatus
}: Step7Props) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center uppercase mb-6">Necesidades de Acción de Control (NAC) = Falta de Control</h2>
      
      {/* NAC Categories */}
      <div className="space-y-6 bg-amber-50/50 p-6 rounded-lg border border-amber-200">
        {formData.nacCategories.map((category, categoryIndex) => (
          <div key={`category-${categoryIndex}`} className="space-y-4">
            <h3 className="text-xl font-semibold text-amber-900">{category.category}</h3>
            
            <div className="grid gap-2">
              {category.subcategories.map((subcategory, subcategoryIndex) => (
                <div key={`subcategory-${categoryIndex}-${subcategoryIndex}`} 
                     className="flex items-center gap-4 p-2 hover:bg-amber-100/50 rounded border border-amber-100">
                  <span className="min-w-[60px] font-medium text-amber-800">{subcategory.code}</span>
                  <span className="flex-1 text-amber-950">{subcategory.description}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateNACStatus(categoryIndex, subcategoryIndex, 'P')}
                      className={`px-3 py-1 rounded transition-colors ${subcategory.status === 'P' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                    >
                      P
                    </button>
                    <button
                      onClick={() => updateNACStatus(categoryIndex, subcategoryIndex, 'E')}
                      className={`px-3 py-1 rounded transition-colors ${subcategory.status === 'E' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                    >
                      E
                    </button>
                    <button
                      onClick={() => updateNACStatus(categoryIndex, subcategoryIndex, 'C')}
                      className={`px-3 py-1 rounded transition-colors ${subcategory.status === 'C' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                    >
                      C
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Leyenda:</h4>
        <div className="space-y-1">
          <p>P = Pendiente</p>
          <p>E = En proceso</p>
          <p>C = Completado</p>
        </div>
      </div>
    </div>
  );
}