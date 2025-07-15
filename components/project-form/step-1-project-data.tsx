import { ProjectData } from '@/types/form-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Step1Props {
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

export function Step1ProjectData({ formData, updateFormData }: Step1Props) {
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
    const fieldKey = field.code.toLowerCase().replace('s1_', '') as keyof ProjectData;
    
    // Mapear códigos de campo a propiedades del formulario
    const getFormField = (code: string) => {
      switch (code) {
        case 'S1_1': return 'name';
        case 'S1_2': return 'description';
        case 'S1_3': return 'date';
        default: return null;
      }
    };

    const formField = getFormField(field.code);
    if (!formField) return null;

    const value = formData[formField as keyof ProjectData] || '';

    return (
      <div key={field.id} className="space-y-2">
        <Label htmlFor={field.code}>{field.name}</Label>
        {field.code === 'S1_2' ? (
          <Textarea
            id={field.code}
            value={value as string}
            onChange={(e) => updateFormData(formField as keyof ProjectData, e.target.value)}
            placeholder={`Ingrese ${field.name.toLowerCase()}`}
            rows={4}
          />
        ) : (
          <Input
            id={field.code}
            type={field.code === 'S1_3' ? 'date' : 'text'}
            value={value as string}
            onChange={(e) => updateFormData(formField as keyof ProjectData, e.target.value)}
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