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

interface ApiBasicCause {
  id: number;
  name: string;
  code: string;
  parent_code: string | null;
  has_comment: boolean;
  children: FieldData[];
}

interface Step6Props {
  formData: ProjectData;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

export function Step6BasicCauses({ formData, updateFormData }: Step6Props) {
  const [personalFactors, setPersonalFactors] = useState<ApiBasicCause[]>([]);
  const [workFactors, setWorkFactors] = useState<ApiBasicCause[]>([]);
  const [loading, setLoading] = useState(true);

  const getLastNumber = (code: string): number => {
    const match = code.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch('/api/fields/STEP_6');
        const result = await response.json();
        
        if (result.success && result.data) {
          const stepData = result.data;
          
          // Find personal and work factors from the children
          const personalFactorsData = stepData.children.find((child: FieldData) => 
            child.code === 'S6_C1' || child.name.toLowerCase().includes('personal')
          );
          
          const workFactorsData = stepData.children.find((child: FieldData) => 
            child.code === 'S6_C2' || child.name.toLowerCase().includes('laboral')
          );
          
          const sortedPersonalFactors = personalFactorsData ? personalFactorsData.children.sort((a: any, b: any) => {
            const numA = getLastNumber(a.code);
            const numB = getLastNumber(b.code);
            return numA - numB;
          }) : [];
          
          const sortedWorkFactors = workFactorsData ? workFactorsData.children.sort((a: any, b: any) => {
            const numA = getLastNumber(a.code);
            const numB = getLastNumber(b.code);
            return numA - numB;
          }) : [];
          
          setPersonalFactors(sortedPersonalFactors);
          setWorkFactors(sortedWorkFactors);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (error) {
        console.error('Error fetching fields:', error);
        // Fallback to original static data if API fails - convert to API format
        const convertedPersonal = originalPersonalFactors.map(factor => ({
          id: factor.id,
          name: factor.text,
          code: factor.reference,
          parent_code: null,
          has_comment: true,
          children: factor.subcauses.map((subcause, index) => ({
            id: factor.id * 100 + index,
            name: subcause,
            code: `${factor.reference}_${index + 1}`,
            parent_code: factor.reference,
            has_comment: true,
            children: []
          }))
        }));
        
        const convertedWork = originalWorkFactors.map(factor => ({
          id: factor.id,
          name: factor.text,
          code: factor.reference,
          parent_code: null,
          has_comment: true,
          children: factor.subcauses.map((subcause, index) => ({
            id: factor.id * 100 + index,
            name: subcause,
            code: `${factor.reference}_${index + 1}`,
            parent_code: factor.reference,
            has_comment: true,
            children: []
          }))
        }));
        
        setPersonalFactors(convertedPersonal);
        setWorkFactors(convertedWork);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  // Fallback static data
  const originalPersonalFactors = [
    { id: 1, text: 'Capacidad Física / Fisiológica Inadecuada', reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)', subcauses: [
      'Altura, peso, talla, fuerza, alcance, etc.',
      'Movimiento corporal limitado',
      'Capacidad limitada para mantener posiciones del cuerpo',
      'Sensibilidad a ciertas sustancias o alergias',
      'Sensibilidad a extremos sensoriales',
      'Defecto de visión',
      'Defecto de audición',
      'Otras deficiencias sensoriales',
      'Poca capacidad respiratoria',
      'Otras incapacidades físicas permanentes',
      'Incapacidades temporales'
    ]},
    { id: 2, text: 'Capacidad Mental/Psicológica Inadecuada', reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)', subcauses: [
      'Temores y fobias',
      'Perturbación emocional',
      'Enfermedad mental',
      'Nivel de inteligencia',
      'Incapacidad de comprensión',
      'Falta de juicio',
      'Escasa coordinación',
      'Bajo tiempo de reacción',
      'Aptitud mecánica deficiente',
      'Baja aptitud de aprendizaje',
      'Falla de memoria'
    ]},
    { id: 3, text: 'Tensión Física o Fisiológica', reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)', subcauses: [
      'Lesión o enfermedad',
      'Fatiga debido a la carga de trabajo',
      'Fatiga debido a la falta de descanso',
      'Fatiga debido a sobrecarga sensorial',
      'Exposición a riesgos contra la salud',
      'Exposición a temperaturas extremas',
      'Deficiencia de oxígeno',
      'Variación en la presión atmosférica',
      'Movimiento restringido',
      'Insuficiencia de azúcar en la sangre'
    ]},
    { id: 4, text: 'Tensión Mental o Psicológica', reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,20)', subcauses: [
      'Sobrecarga emocional',
      'Fatiga debido a la carga o limitaciones de tiempo mental',
      'Obligaciones que exigen un juicio o decisión extrema',
      'Rutina, monotonía, exigencias para un cargo sin trascendencia',
      'Exigencias de concentración / percepción profunda',
      'Actividades "insignificantes o degradantes"',
      'Ordenes confusas',
      'Solicitudes conflictivas',
      'Preocupación debido a problemas',
      'Frustración',
      'Enfermedad mental'
    ]},
    { id: 5, text: 'Falta de Conocimiento', reference: '(Ver MAC 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20)', subcauses: [
      'Falta de experiencia',
      'Orientación deficiente',
      'Entrenamiento inicial inadecuado',
      'Reentrenamiento insuficiente',
      'Ordenes mal interpretadas'
    ]},
    { id: 6, text: 'Falta de Habilidad', reference: '(Ver MAC 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16)', subcauses: [
      'Instrucción inicial insuficiente',
      'Práctica insuficiente',
      'Operación esporádica',
      'Falta de preparación'
    ]},
    { id: 7, text: 'Motivación Incorrecta', reference: '(Ver MAC 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18)', subcauses: [
      'El desempeño subestándar es más gratificante',
      'El desempeño correcto es más castigado',
      'Falta de incentivos',
      'Demasiadas frustraciones',
      'Agresión inapropiada',
      'Intento deficiente de ahorrar tiempo o esfuerzo',
      'Intento deficiente de evitar incomodidad'
    ]}
  ];

  const originalWorkFactors = [
    { id: 8, text: 'Liderazgo y/o Supervisión Inadecuados', reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18)', subcauses: [
      'Relaciones jerárquicas poco claras o conflictivas',
      'Asignación de responsabilidades poco claras o conflictivas',
      'Delegación insuficiente o inadecuada',
      'Dar instrucciones, orientación o entrenamiento deficiente',
      'Dar programas, planificación o control deficientes',
      'Identificación y evaluación deficiente de exposiciones a pérdida',
      'Conocimiento gerencial del trabajo deficiente',
      'Dirección deficiente de las tareas',
      'Medición y evaluación inadecuadas del desempeño',
      'Retroalimentación deficiente del desempeño'
    ]},
    { id: 9, text: 'Ingeniería Inadecuada', reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14)', subcauses: [
      'Evaluación inadecuada de exposiciones a pérdida',
      'Consideración deficiente de factores humanos/ergonómicos',
      'Estándares especificaciones y/o criterios de diseño deficientes',
      'Control deficiente de la construcción'
    ]},
    { id: 10, text: 'Deficiencia en las Adquisiciones', reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)', subcauses: [
      'Especificaciones deficientes en cuanto a los requerimientos',
      'Investigación inadecuada respecto a materiales/equipos',
      'Especificaciones deficientes para vendedores',
      'Modalidad o ruta de embarque inadecuada',
      'Inspección de recepción y aceptación deficiente',
      'Comunicación inadecuada de información de salud y seguridad',
      'Manejo inadecuado de materiales',
      'Almacenamiento inadecuado de materiales',
      'Transporte inadecuado de materiales',
      'Identificación deficiente de materiales peligrosos',
      'Disposición inadecuada de residuos y/o materiales sobrantes',
      'Selección inadecuada de contratistas'
    ]},
    { id: 11, text: 'Mantenimiento Inadecuado', reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14)', subcauses: [
      'Prevención inadecuada',
      'Evaluación de necesidades',
      'Lubricación y servicio',
      'Ajuste/ensamblaje',
      'Limpieza o pulimento',
      'Reemplazo de partes deficientes'
    ]},
    { id: 12, text: 'Herramientas y Equipo Inadecuados', reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)', subcauses: [
      'Evaluación deficiente de necesidades y riesgos',
      'Consideración inadecuada de factores humanos/ergonómicos',
      'Estándares o especificaciones inadecuadas',
      'Disponibilidad inadecuada',
      'Ajuste/reparación/mantenimiento deficiente',
      'Recuperación y reclamación inadecuadas',
      'Remoción y reemplazo inadecuado de artículos'
    ]},
    { id: 13, text: 'Estándares de Trabajo Inadecuados', reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16)', subcauses: [
      'Desarrollo inadecuado de estándares',
      'Comunicación inadecuada de estándares',
      'Mantenimiento inadecuado de estándares',
      'Monitoreo inadecuado del cumplimiento'
    ]},
    { id: 14, text: 'Uso y Desgaste', reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19)', subcauses: [
      'Planificación inadecuada del uso',
      'Extensión inadecuada de la vida útil',
      'Inspección y/o monitoreo inadecuados',
      'Carga o proporción de uso inadecuada',
      'Mantenimiento deficiente',
      'Uso por personas no calificadas o entrenadas',
      'Uso para un propósito indebido'
    ]}
  ];

  if (loading) {
    return <LoadingSpinner title="Causas básicas o subyacentes (CB)
" />;
  }

  const toggleItem = (field: 'basicFactorsPersonal' | 'basicFactorsWork', text: string) => {
    const currentItems = formData[field] || [];
    const itemIndex = currentItems.findIndex(item => item.text === text);
    
    const item = field === 'basicFactorsPersonal'
      ? personalFactors.find(factor => factor.name === text)
      : workFactors.find(factor => factor.name === text);

    if (itemIndex >= 0) {
      const newItems = currentItems.filter(item => item.text !== text);
      updateFormData(field, newItems);
    } else if (item) {
      const sortedSubcauses = item.children.sort((a, b) => {
        const numA = getLastNumber(a.code);
        const numB = getLastNumber(b.code);
        return numA - numB;
      });
      
      const newItem = {
        text,
        comment: '',
        reference: item.code,
        subcauses: sortedSubcauses.map(subcause => ({
          text: subcause.name,
          selected: false,
          comment: ''
        }))
      };
      updateFormData(field, [...currentItems, newItem]);
    }
  };

  const updateComment = (field: 'basicFactorsPersonal' | 'basicFactorsWork', text: string, comment: string) => {
    const currentItems = formData[field] || [];
    const newItems = currentItems.map(item => 
      item.text === text ? { ...item, comment } : item
    );
    updateFormData(field, newItems);
  };

  const toggleSubcause = (field: 'basicFactorsPersonal' | 'basicFactorsWork', itemText: string, subcauseText: string) => {
    const currentItems = formData[field] || [];
    const newItems = currentItems.map(item => {
      if (item.text === itemText) {
        return {
          ...item,
          subcauses: item.subcauses.map(subcause => 
            subcause.text === subcauseText
              ? { ...subcause, selected: !subcause.selected }
              : subcause
          )
        };
      }
      return item;
    });
    updateFormData(field, newItems);
  };

  const updateSubcauseComment = (field: 'basicFactorsPersonal' | 'basicFactorsWork', itemText: string, subcauseText: string, comment: string) => {
    const currentItems = formData[field] || [];
    const newItems = currentItems.map(item => {
      if (item.text === itemText) {
        return {
          ...item,
          subcauses: item.subcauses.map(subcause => 
            subcause.text === subcauseText
              ? { ...subcause, comment }
              : subcause
          )
        };
      }
      return item;
    });
    updateFormData(field, newItems);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Causas Básicas o Subyacentes (CB)</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Factores Personales */}
        <div className="space-y-4">
          <h3 className="font-medium text-center pb-2 border-b">FACTORES PERSONALES</h3>
          <div className="space-y-2">
            {personalFactors.map((factor) => {
              const isSelected = formData.basicFactorsPersonal?.some(item => item.text === factor.name) || false;
              const currentItem = formData.basicFactorsPersonal?.find(item => item.text === factor.name);

              return (
                <div key={factor.id} className="space-y-2">
                  <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-amber-100/10 cursor-pointer transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem('basicFactorsPersonal', factor.name)}
                      className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="text-sm font-medium">{factor.name}</div>
                      <div className="text-xs text-gray-500">{factor.code}</div>
                    </div>
                  </label>
                  {isSelected && currentItem && (
                    <div className="ml-6 space-y-2">
                      <div className="text-xs text-gray-600 font-medium">Subcausas:</div>
                      <div className="space-y-3">
                        {currentItem.subcauses.map((subcause, index) => (
                          <div key={index} className="pl-4 space-y-2">
                            <label className="flex items-start space-x-2 p-2 rounded hover:bg-amber-100/20 transition-colors duration-200">
                              <input
                                type="checkbox"
                                checked={subcause.selected}
                                onChange={() => toggleSubcause('basicFactorsPersonal', factor.name, subcause.text)}
                                className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                              />
                              <span className="text-xs text-gray-300">{subcause.text}</span>
                            </label>
                            {subcause.selected && (
                              <textarea
                                placeholder="Agregar un comentario para esta subcausa..."
                                value={subcause.comment}
                                onChange={(e) => updateSubcauseComment('basicFactorsPersonal', factor.name, subcause.text, e.target.value)}
                                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                                rows={2}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <textarea
                        placeholder="Agregar un comentario general..."
                        value={currentItem.comment}
                        onChange={(e) => updateComment('basicFactorsPersonal', factor.name, e.target.value)}
                        className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Factores Laborales */}
        <div className="space-y-4">
          <h3 className="font-medium text-center pb-2 border-b">FACTORES LABORALES</h3>
          <div className="space-y-2">
            {workFactors.map((factor) => {
              const isSelected = formData.basicFactorsWork?.some(item => item.text === factor.name) || false;
              const currentItem = formData.basicFactorsWork?.find(item => item.text === factor.name);

              return (
                <div key={factor.id} className="space-y-2">
                  <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-amber-100/10 cursor-pointer transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItem('basicFactorsWork', factor.name)}
                      className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="text-sm font-medium">{factor.name}</div>
                      <div className="text-xs text-gray-500">{factor.code}</div>
                    </div>
                  </label>
                  {isSelected && currentItem && (
                    <div className="ml-6 space-y-2">
                      <div className="text-xs text-gray-600 font-medium">Subcausas:</div>
                      <div className="space-y-3">
                        {currentItem.subcauses.map((subcause, index) => (
                          <div key={index} className="pl-4 space-y-2">
                            <label className="flex items-start space-x-2 p-2 rounded hover:bg-amber-100/20 transition-colors duration-200">
                              <input
                                type="checkbox"
                                checked={subcause.selected}
                                onChange={() => toggleSubcause('basicFactorsWork', factor.name, subcause.text)}
                                className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                              />
                              <span className="text-xs text-gray-300">{subcause.text}</span>
                            </label>
                            {subcause.selected && (
                              <textarea
                                placeholder="Agregar un comentario para esta subcausa..."
                                value={subcause.comment}
                                onChange={(e) => updateSubcauseComment('basicFactorsWork', factor.name, subcause.text, e.target.value)}
                                className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                                rows={2}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      <textarea
                        placeholder="Agregar un comentario general..."
                        value={currentItem.comment}
                        onChange={(e) => updateComment('basicFactorsWork', factor.name, e.target.value)}
                        className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}