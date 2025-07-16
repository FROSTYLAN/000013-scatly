import { ProjectData } from '@/types/project';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Step3PotentialEvaluationProps {
  formData: ProjectData;
  updateStepField: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number, comment: string) => void;
  removeStepField: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => void;
  getStepFieldComment: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => string;
  isStepFieldSelected: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => boolean;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

interface FieldData {
  id: number;
  name: string;
  code: string;
  parent_code: string | null;
  has_comment: boolean;
  children: FieldData[];
}

export function Step3PotentialEvaluation({ 
  formData, 
  updateStepField, 
  removeStepField, 
  getStepFieldComment, 
  isStepFieldSelected,
  updateFormData
}: Step3PotentialEvaluationProps) {
  const [evaluationData, setEvaluationData] = useState<FieldData | null>(null);
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
        
        const response = await fetch('/api/fields/STEP_3', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        
        if (result.success) {
          const sortedData = {
            ...result.data,
            children: result.data.children.sort((a: FieldData, b: FieldData) => {
              const numA = getLastNumber(a.code);
              const numB = getLastNumber(b.code);
              return numA - numB;
            }).map((section: FieldData) => ({
              ...section,
              children: section.children.sort((a: FieldData, b: FieldData) => {
                const numA = getLastNumber(a.code);
                const numB = getLastNumber(b.code);
                return numA - numB;
              })
            }))
          };
          setEvaluationData(sortedData);
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

  // Función para obtener el fieldId seleccionado en una sección
  const getSelectedFieldId = (sectionId: number): number | null => {
    const selectedField = formData.step3Fields.find(field => {
      // Buscar en los children de la sección para ver cuál está seleccionado
      const section = evaluationData?.children.find(s => s.id === sectionId);
      return section?.children.some(child => child.id === field.fieldId);
    });
    return selectedField?.fieldId || null;
  };

  // Función para manejar la selección de una opción
  const handleOptionSelect = (optionId: number, sectionId: number) => {
    // Obtener la sección actual
    const section = evaluationData?.children.find(s => s.id === sectionId);
    if (!section) return;
    
    // Obtener todos los campos actuales del step3
    const currentFields = formData.step3Fields || [];
    
    // Buscar si ya hay un comentario existente en esta sección
    const existingFieldInSection = currentFields.find(field => 
      section.children.some(child => child.id === field.fieldId)
    );
    const existingComment = existingFieldInSection?.comment || '';
    
    // Filtrar para remover cualquier selección previa de esta sección
    const fieldsToKeep = currentFields.filter(field => {
      // Mantener solo los campos que NO pertenecen a esta sección
      return !section.children.some(child => child.id === field.fieldId);
    });
    
    // Agregar la nueva selección preservando el comentario existente
    const newFields = [...fieldsToKeep, { fieldId: optionId, comment: existingComment }];
    
    // Actualizar directamente el formData usando updateFormData
    updateFormData('step3Fields', newFields);
  };

  const renderEvaluationSection = (section: FieldData) => {
    const selectedFieldId = getSelectedFieldId(section.id);
    const selectedComment = selectedFieldId ? getStepFieldComment('step3Fields', selectedFieldId) : '';

    return (
      <div key={section.id} className="space-y-4">
        <label className="font-medium block">{section.name}</label>
        <div className="space-y-2">
          {section.children.map((option) => {
            const isSelected = isStepFieldSelected('step3Fields', option.id);

            return (
              <label key={option.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`section_${section.id}`}
                  checked={isSelected}
                  onChange={() => handleOptionSelect(option.id, section.id)}
                  className="form-radio"
                />
                <span>{option.name}</span>
              </label>
            );
          })}
        </div>
        {section.has_comment && selectedFieldId && (
          <textarea
            placeholder="Agregar un comentario..."
            value={selectedComment}
            onChange={(e) => updateStepField('step3Fields', selectedFieldId, e.target.value)}
            className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
            rows={2}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner title="Evaluación potencial de pérdida si no es controlado" />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Evaluación Potencial de Pérdida si no es Controlado</h2>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{evaluationData?.name || 'Evaluación Potencial de Pérdida si no es Controlado'}</h2>
      
      <div className="space-y-8">
        {evaluationData?.children.map(renderEvaluationSection)}
      </div>
    </div>
  );
}