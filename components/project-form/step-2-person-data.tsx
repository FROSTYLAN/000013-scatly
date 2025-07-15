import { ProjectData } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Step2Props {
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

export function Step2PersonData({ formData, updateStepField, removeStepField, getStepFieldComment, isStepFieldSelected }: Step2Props) {
  const [investigatorData, setInvestigatorData] = useState<FieldData | null>(null);
  const [victimData, setVictimData] = useState<FieldData | null>(null);
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
        
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        const [investigatorResponse, victimResponse] = await Promise.all([
          fetch('/api/fields/STEP_2_A', { headers }),
          fetch('/api/fields/STEP_2_B', { headers })
        ]);
        
        const investigatorResult = await investigatorResponse.json();
        const victimResult = await victimResponse.json();
        
        if (investigatorResult.success && victimResult.success) {
          const sortedInvestigatorData = {
            ...investigatorResult.data,
            children: investigatorResult.data.children.sort((a: FieldData, b: FieldData) => {
              const numA = getLastNumber(a.code);
              const numB = getLastNumber(b.code);
              return numA - numB;
            })
          };
          
          const sortedVictimData = {
            ...victimResult.data,
            children: victimResult.data.children.sort((a: FieldData, b: FieldData) => {
              const numA = getLastNumber(a.code);
              const numB = getLastNumber(b.code);
              return numA - numB;
            })
          };
          
          setInvestigatorData(sortedInvestigatorData);
          setVictimData(sortedVictimData);
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
    const comment = getStepFieldComment('step2Fields', field.id);
    const isSelected = isStepFieldSelected('step2Fields', field.id);

    const handleChange = (value: string) => {
      updateStepField('step2Fields', field.id, value);
    };

    return (
      <div key={field.id}>
        <Label htmlFor={field.code}>{field.name}</Label>
        <Input
          id={field.code}
          type={field.code === 'S2_B_3' ? 'number' : 'text'}
          value={comment}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`${field.name}`}
        />
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner title="Datos del Investigador/Accidentado" />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Datos del Investigador/Accidentado</h2>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Datos del Investigador/Accidentado</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Columna del Investigador */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{investigatorData?.name || 'Datos del Investigador'}</h3>
          <div className="space-y-4">
            {investigatorData?.children.map(renderField)}
          </div>
        </div>

        {/* Columna del Accidentado */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{victimData?.name || 'Datos del Accidentado'}</h3>
          <div className="space-y-4">
            {victimData?.children.map(renderField)}
          </div>
        </div>
      </div>
    </div>
  );
}