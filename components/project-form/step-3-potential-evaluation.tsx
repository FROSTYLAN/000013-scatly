import { ProjectData } from '@/types/form-types';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Step3PotentialEvaluationProps {
  formData: ProjectData;
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

export function Step3PotentialEvaluation({ formData, updateFormData }: Step3PotentialEvaluationProps) {
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
        const response = await fetch('/api/fields/STEP_3');
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

  const getFormField = (code: string) => {
    switch (code) {
      case 'S3_1': return 'potentialSeverity';
      case 'S3_2': return 'potentialProbability';
      case 'S3_3': return 'potentialFrequency';
      default: return null;
    }
  };

  const getCommentField = (code: string) => {
    switch (code) {
      case 'S3_1': return 'potentialSeverityComment';
      case 'S3_2': return 'potentialProbabilityComment';
      case 'S3_3': return 'potentialFrequencyComment';
      default: return null;
    }
  };

  const getOptionValue = (code: string) => {
    switch (code) {
      // Potencial de Severidad
      case 'S3_1_1': return 'mayor';
      case 'S3_1_2': return 'grave';
      case 'S3_1_3': return 'menor';
      // Probabilidad de Ocurrencia
      case 'S3_2_1': return 'alta';
      case 'S3_2_2': return 'moderada';
      case 'S3_2_3': return 'rara';
      // Frecuencia de Exposición
      case 'S3_3_1': return 'grande';
      case 'S3_3_2': return 'moderada';
      case 'S3_3_3': return 'baja';
      default: return null;
    }
  };

  const renderEvaluationSection = (section: FieldData) => {
    const formField = getFormField(section.code);
    const commentField = getCommentField(section.code);
    
    if (!formField || !commentField) return null;

    const currentValue = formData[formField as keyof ProjectData] as string;
    const currentComment = formData[commentField as keyof ProjectData] as string;

    return (
      <div key={section.id} className="space-y-4">
        <label className="font-medium block">{section.name}</label>
        <div className="space-y-2">
          {section.children.map((option) => {
            const optionValue = getOptionValue(option.code);
            if (!optionValue) return null;

            return (
              <label key={option.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={formField}
                  value={optionValue}
                  checked={currentValue === optionValue}
                  onChange={(e) => updateFormData(formField as keyof ProjectData, e.target.value)}
                  className="form-radio"
                />
                <span>{option.name}</span>
              </label>
            );
          })}
        </div>
        {section.has_comment && currentValue && (
          <textarea
            placeholder="Agregar un comentario..."
            value={currentComment || ''}
            onChange={(e) => updateFormData(commentField as keyof ProjectData, e.target.value)}
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