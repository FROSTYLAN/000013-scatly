import { ProjectData } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Step1Props {
  formData: ProjectData;
  updateStepField: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number, comment: string) => void;
  removeStepField: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => void;
  getStepFieldComment: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => string;
  isStepFieldSelected: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => boolean;
}

interface FieldData {
  id: number;
  name: string;
  code: string;
  parent_code: string | null;
  has_comment: boolean;
  children: FieldData[];
}

export function Step1ProjectData({ formData, updateStepField, removeStepField, getStepFieldComment, isStepFieldSelected }: Step1Props) {
  const [fieldData, setFieldData] = useState<FieldData | null>(null);
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
        
        const response = await fetch('/api/fields/STEP_1', {
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
            })
          };
          setFieldData(sortedData);
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

  const renderField = (field: FieldData) => {
    const comment = getStepFieldComment('step1Fields', field.id);
    const isSelected = isStepFieldSelected('step1Fields', field.id);

    const handleChange = (value: string) => {
      updateStepField('step1Fields', field.id, value);
    };

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.code}>{field.name}</Label>
        {field.code === 'S1_2' ? (
          <Textarea
            id={field.code}
            value={comment}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={`Ingrese ${field.name.toLowerCase()}`}
            rows={4}
          />
        ) : (
          <Input
            id={field.code}
            type={field.code === 'S1_3' ? 'date' : 'text'}
            value={comment}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.code === 'S1_3' ? '' : `Ingrese ${field.name.toLowerCase()}`}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner title="Datos del proyecto" />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Datos del Proyecto</h2>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{fieldData?.name || 'Datos del Proyecto'}</h2>
      
      <div className="grid gap-4">
        {fieldData?.children.map(renderField)}
      </div>
    </div>
  );
}