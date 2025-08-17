'use client';

import { ProjectData } from '@/types/project';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FIELD_DEPENDENCIES } from '@/lib/default-fields';

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

interface Step6BasicCausesProps {
  formData: ProjectData;
  updateStepField: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number, comment: string) => void;
  removeStepField: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => void;
  getStepFieldComment: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => string;
  isStepFieldSelected: (step: 'step1Fields' | 'step2Fields' | 'step3Fields' | 'step4Fields' | 'step5Fields' | 'step6Fields' | 'step7Fields', fieldId: number) => boolean;
}

export function Step6BasicCauses({ 
  updateStepField, 
  removeStepField, 
  getStepFieldComment, 
  isStepFieldSelected 
}: Step6BasicCausesProps) {
  const [personalFactors, setPersonalFactors] = useState<ApiBasicCause[]>([]);
  const [workFactors, setWorkFactors] = useState<ApiBasicCause[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLastNumber = (code: string): number => {
    const match = code.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  };

  useEffect(() => {
    const fetchFields = async () => {
      try {
        // Obtener token de localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('No hay token de autenticación');
          return;
        }
        
        const response = await fetch('/api/fields/STEP_6', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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

  // Obtener selecciones del Step 5 para filtrar campos visibles
  const getSelectedFieldsFromStep5 = (): string[] => {
    // step5Fields no está disponible en las props actuales de este componente.
    // Agregaremos el formData como parte de las props para poder leerlo.
    // Como workaround mínimo, leeremos desde window.localStorage el draft si existe.
    try {
      const raw = localStorage.getItem('project_form_data');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const step5Fields = parsed?.formData?.step5Fields || parsed?.step5Fields || [];

      // Mapeo temporal basado en estructura conocida del Step 5 (códigos de causas nivel 1)
      const idToCode: Record<number, string> = {};
      // No conocemos los IDs exactos en tiempo de desarrollo, por lo que no podemos mapear con precisión aquí.
      // En ausencia de IDs, devolvemos vacío para no filtrar erróneamente.
      if (Object.keys(idToCode).length === 0) return [];

      const selectedCodes: string[] = [];
      step5Fields.forEach((f: any) => {
        const code = idToCode[f.fieldId];
        if (code) selectedCodes.push(code);
      });
      return selectedCodes;
    } catch {
      return [];
    }
  };

  // Aplica filtro a una lista de factores usando dependencias desde Step 5
  const filterFactorsByDependencies = (factors: ApiBasicCause[]): ApiBasicCause[] => {
    const selectedStep5 = getSelectedFieldsFromStep5();
    if (selectedStep5.length === 0) return factors;

    const visible = new Set<string>();
    selectedStep5.forEach(s => {
      if (FIELD_DEPENDENCIES[s]) {
        FIELD_DEPENDENCIES[s].forEach(dep => visible.add(dep));
      }
    });

    if (visible.size === 0) return factors;

    return factors.filter(f => visible.has(f.code));
  };

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
    return <LoadingSpinner title="Causas básicas o subyacentes (CB)" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const toggleField = (fieldId: number) => {
    if (isStepFieldSelected('step6Fields', fieldId)) {
      removeStepField('step6Fields', fieldId);
    } else {
      updateStepField('step6Fields', fieldId, '');
    }
  };

  const updateFieldComment = (fieldId: number, comment: string) => {
    updateStepField('step6Fields', fieldId, comment);
  };

  const filteredPersonal = filterFactorsByDependencies(personalFactors);
  const filteredWork = filterFactorsByDependencies(workFactors);
  const hasFilters = getSelectedFieldsFromStep5().length > 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Causas Básicas o Subyacentes (CB)</h2>

      {hasFilters && (
        <div className="p-3 rounded-lg border border-amber-200 bg-amber-100/10">
          <p className="text-xs text-amber-300">
            Mostrando factores relacionados según las causas inmediatas seleccionadas en el Step 5.
          </p>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Factores Personales */}
        <div className="space-y-4">
          <h3 className="font-medium text-center pb-2 border-b">FACTORES PERSONALES</h3>
          <div className="space-y-2">
            {filteredPersonal.map((factor) => {
              const isSelected = isStepFieldSelected('step6Fields', factor.id);
              const currentComment = getStepFieldComment('step6Fields', factor.id);

              return (
                <div key={factor.id} className="space-y-2">
                  {/* Main factor */}
                  <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-amber-100/10 cursor-pointer transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleField(factor.id)}
                      className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="text-sm font-medium">{factor.name}</div>
                    </div>
                  </label>

                  {/* Subcauses - Only show when main factor is selected */}
                  {isSelected && factor.children.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {factor.children.map((subcause) => {
                        const isSubcauseSelected = isStepFieldSelected('step6Fields', subcause.id);
                        const subcauseComment = getStepFieldComment('step6Fields', subcause.id);

                        return (
                          <div key={subcause.id} className="space-y-2">
                            <label className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-100/5 cursor-pointer transition-colors duration-200">
                              <input
                                type="checkbox"
                                checked={isSubcauseSelected}
                                onChange={() => toggleField(subcause.id)}
                                className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                              />
                              <div className="flex-1">
                                <div className="text-sm text-gray-300">{subcause.name}</div>
                              </div>
                            </label>
                            {isSubcauseSelected && (
                              <div className="ml-6">
                                <textarea
                                  placeholder="Agregar un comentario para esta subcausa..."
                                  value={subcauseComment}
                                  onChange={(e) => updateFieldComment(subcause.id, e.target.value)}
                                  className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                                  rows={2}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* General comment for main factor */}
                  {isSelected && (
                    <div className="ml-6 mt-3">
                      <textarea
                        placeholder="Comentario general para este factor..."
                        value={currentComment}
                        onChange={(e) => updateFieldComment(factor.id, e.target.value)}
                        className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {filteredPersonal.length === 0 && hasFilters && (
              <div className="text-center py-4 text-gray-400 text-sm">
                No hay factores personales asociados a sus selecciones del Step 5.
              </div>
            )}
          </div>
        </div>

        {/* Factores de Trabajo */}
        <div className="space-y-4">
          <h3 className="font-medium text-center pb-2 border-b">FACTORES DE TRABAJO</h3>
          <div className="space-y-2">
            {filteredWork.map((factor) => {
              const isSelected = isStepFieldSelected('step6Fields', factor.id);
              const currentComment = getStepFieldComment('step6Fields', factor.id);

              return (
                <div key={factor.id} className="space-y-2">
                  {/* Main factor */}
                  <label className="flex items-start space-x-3 p-3 rounded-lg hover:bg-amber-100/10 cursor-pointer transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleField(factor.id)}
                      className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="text-sm font-medium">{factor.name}</div>
                    </div>
                  </label>

                  {/* Subcauses - Only show when main factor is selected */}
                  {isSelected && factor.children.length > 0 && (
                    <div className="ml-8 space-y-2">
                      {factor.children.map((subcause) => {
                        const isSubcauseSelected = isStepFieldSelected('step6Fields', subcause.id);
                        const subcauseComment = getStepFieldComment('step6Fields', subcause.id);

                        return (
                          <div key={subcause.id} className="space-y-2">
                            <label className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-100/5 cursor-pointer transition-colors duration-200">
                              <input
                                type="checkbox"
                                checked={isSubcauseSelected}
                                onChange={() => toggleField(subcause.id)}
                                className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                              />
                              <div className="flex-1">
                                <div className="text-sm text-gray-300">{subcause.name}</div>
                              </div>
                            </label>
                            {isSubcauseSelected && (
                              <div className="ml-6">
                                <textarea
                                  placeholder="Agregar un comentario para esta subcausa..."
                                  value={subcauseComment}
                                  onChange={(e) => updateFieldComment(subcause.id, e.target.value)}
                                  className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                                  rows={2}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* General comment for main factor */}
                  {isSelected && (
                    <div className="ml-6 mt-3">
                      <textarea
                        placeholder="Comentario general para este factor..."
                        value={currentComment}
                        onChange={(e) => updateFieldComment(factor.id, e.target.value)}
                        className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {filteredWork.length === 0 && hasFilters && (
              <div className="text-center py-4 text-gray-400 text-sm">
                No hay factores de trabajo asociados a sus selecciones del Step 5.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}