import { ProjectData, CorrectiveAction } from '@/types/project';

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
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Necesidades de Acción de Control (NAC) = Falta de Control</h2>
      
      {/* NAC Categories */}
      <div className="space-y-6">
        {formData.nacCategories.map((category, categoryIndex) => (
          <div key={`category-${categoryIndex}`} className="space-y-4">
            <h3 className="font-medium text-center pb-2 border-b">{category.category}</h3>
            
            <div className="grid gap-2">
              {category.subcategories.map((subcategory, subcategoryIndex) => (
                <div key={`subcategory-${categoryIndex}-${subcategoryIndex}`} 
                     className="space-y-2">
                  <div className="flex items-center gap-4 p-3 hover:bg-amber-100/10 rounded-lg transition-colors duration-200">
                    <span className="min-w-[60px] text-sm font-medium">{subcategory.code}</span>
                    <span className="flex-1 text-sm">{subcategory.description}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateNACStatus(categoryIndex, subcategoryIndex, 'P')}
                        className={`px-3 py-1 rounded transition-colors ${subcategory.status === 'P' ? 'bg-amber-500 text-white' : 'text-amber-500 hover:bg-amber-100/20'}`}
                      >
                        P
                      </button>
                      <button
                        onClick={() => updateNACStatus(categoryIndex, subcategoryIndex, 'E')}
                        className={`px-3 py-1 rounded transition-colors ${subcategory.status === 'E' ? 'bg-amber-500 text-white' : 'text-amber-500 hover:bg-amber-100/20'}`}
                      >
                        E
                      </button>
                      <button
                        onClick={() => updateNACStatus(categoryIndex, subcategoryIndex, 'C')}
                        className={`px-3 py-1 rounded transition-colors ${subcategory.status === 'C' ? 'bg-amber-500 text-white' : 'text-amber-500 hover:bg-amber-100/20'}`}
                      >
                        C
                      </button>
                    </div>
                  </div>
                  {subcategory.status && (
                    <div className="pl-[76px] pr-4">
                      <textarea
                        placeholder="Agregar un comentario..."
                        value={subcategory.comment}
                        onChange={(e) => updateNACComment(categoryIndex, subcategoryIndex, e.target.value)}
                        className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 rounded-lg border border-amber-200 bg-amber-100/10">
        <h4 className="font-medium mb-2">Leyenda:</h4>
        <div className="space-y-1 text-sm">
          <p>P = Pendiente</p>
          <p>E = En proceso</p>
          <p>C = Completado</p>
        </div>
      </div>
    </div>
  );
}