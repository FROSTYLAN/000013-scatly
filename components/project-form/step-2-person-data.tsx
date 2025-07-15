import { ProjectData } from '@/types/form-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Step2Props {
  formData: ProjectData;
  updateNestedFormData: <K extends keyof ProjectData>(parentField: K, field: keyof ProjectData[K], value: any) => void;
}

interface FieldData {
  id: number;
  name: string;
  code: string;
  parent_code: string | null;
  has_comment: boolean;
  children: FieldData[];
}

export function Step2PersonData({ formData, updateNestedFormData }: Step2Props) {
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

  const getInvestigatorFormField = (code: string) => {
    switch (code) {
      case 'S2_A_1': return 'name';
      case 'S2_A_2': return 'lastName';
      case 'S2_A_3': return 'dni';
      case 'S2_A_4': return 'position';
      default: return null;
    }
  };

  const getVictimFormField = (code: string) => {
    switch (code) {
      case 'S2_B_1': return 'name';
      case 'S2_B_2': return 'lastName';
      case 'S2_B_3': return 'age';
      case 'S2_B_4': return 'dni';
      case 'S2_B_5': return 'position';
      case 'S2_B_6': return 'miningCompany';
      case 'S2_B_7': return 'employed';
      default: return null;
    }
  };

  const renderInvestigatorField = (field: FieldData) => {
    const formField = getInvestigatorFormField(field.code);
    if (!formField) return null;

    const value = formData.investigator[formField as keyof typeof formData.investigator] || '';

    return (
      <div key={field.id}>
        <Label htmlFor={field.code}>{field.name}</Label>
        <Input
          id={field.code}
          value={value as string}
          onChange={(e) => updateNestedFormData('investigator', formField as keyof typeof formData.investigator, e.target.value)}
          placeholder={`${field.name} del investigador`}
        />
      </div>
    );
  };

  const renderVictimField = (field: FieldData) => {
    const formField = getVictimFormField(field.code);
    if (!formField) return null;

    const value = formData.accidentVictim[formField as keyof typeof formData.accidentVictim] || '';

    return (
      <div key={field.id}>
        <Label htmlFor={field.code}>{field.name}</Label>
        <Input
          id={field.code}
          type={field.code === 'S2_B_3' ? 'number' : 'text'}
          value={value as string}
          onChange={(e) => updateNestedFormData('accidentVictim', formField as keyof typeof formData.accidentVictim, e.target.value)}
          placeholder={`${field.name} del accidentado`}
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
            {investigatorData?.children.map(renderInvestigatorField)}
          </div>
        </div>

        {/* Columna del Accidentado */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{victimData?.name || 'Datos del Accidentado'}</h3>
          <div className="space-y-4">
            {victimData?.children.map(renderVictimField)}
          </div>
        </div>
      </div>
    </div>
  );
}