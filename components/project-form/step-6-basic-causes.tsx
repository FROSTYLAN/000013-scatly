import { ProjectData } from '@/types/project';

interface Step6Props {
  formData: ProjectData;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

export function Step6BasicCauses({ formData, updateFormData }: Step6Props) {
  const personalFactors = [
    {
      category: 'Capacidad Física / Fisiológica Inadecuada',
      reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)',
      items: [
        'Altura, peso, talla, fuerza, alcance, etc.',
        'Movimiento corporal limitado',
        'Capacidad limitada para mantener posiciones del cuerpo',
        'Sensibilidad a ciertas sustancias o alergias',
        'Sensibilidad a extremos sensoriales',
        'Defecto de visión',
        'Defecto de audición',
        'Otras deficiencias sensoriales (tacto, gusto, olfato, equilibrio)',
        'Poca capacidad respiratoria',
        'Otras incapacidades físicas permanentes',
        'Incapacidades temporales'
      ]
    },
    {
      category: 'Capacidad Mental/Psicológica Inadecuada',
      reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)',
      items: [
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
      ]
    },
    {
      category: 'Tensión Física o Fisiológica',
      reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)',
      items: [
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
      ]
    },
    {
      category: 'Tensión Mental o Psicológica',
      reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,20)',
      items: [
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
      ]
    },
    {
      category: 'Falta de Conocimiento',
      reference: '(Ver MAC 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,20)',
      items: [
        'Falta de experiencia',
        'Orientación deficiente',
        'Entrenamiento inicial inadecuado',
        'Reentrenamiento insuficiente',
        'Ordenes mal interpretadas'
      ]
    },
    {
      category: 'Falta de Habilidad',
      reference: '(Ver MAC 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16)',
      items: [
        'Instrucción inicial insuficiente',
        'Práctica insuficiente',
        'Operación esporádica',
        'Falta de preparación'
      ]
    },
    {
      category: 'Motivación Incorrecta',
      reference: '(Ver MAC 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18)',
      items: [
        'El desempeño subestándar es más gratificante',
        'El desempeño correcto es más castigado',
        'Falta de incentivos',
        'Demasiadas frustraciones',
        'Agresión inapropiada',
        'Intento deficiente de ahorrar tiempo o esfuerzo',
        'Intento deficiente de evitar incomodidad'
      ]
    }
  ];

  const workFactors = [
    {
      category: 'Liderazgo y/o Supervisión Inadecuados',
      reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18)',
      items: [
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
      ]
    },
    {
      category: 'Ingeniería Inadecuada',
      reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14)',
      items: [
        'Evaluación inadecuada de exposiciones a pérdida',
        'Consideración deficiente de factores humanos/ergonómicos',
        'Estándares especificaciones y/o criterios de diseño deficientes',
        'Control deficiente de la construcción'
      ]
    },
    {
      category: 'Deficiencia en las Adquisiciones',
      reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)',
      items: [
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
      ]
    },
    {
      category: 'Mantenimiento Inadecuado',
      reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14)',
      items: [
        'Prevención inadecuada',
        'Evaluación de necesidades',
        'Lubricación y servicio',
        'Ajuste/ensamblaje',
        'Limpieza o pulimento',
        'Reemplazo de partes deficientes'
      ]
    },
    {
      category: 'Herramientas y Equipo Inadecuados',
      reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)',
      items: [
        'Evaluación deficiente de necesidades y riesgos',
        'Consideración inadecuada de factores humanos/ergonómicos',
        'Estándares o especificaciones inadecuadas',
        'Disponibilidad inadecuada',
        'Ajuste/reparación/mantenimiento deficiente',
        'Recuperación y reclamación inadecuadas',
        'Remoción y reemplazo inadecuado de artículos'
      ]
    },
    {
      category: 'Estándares de Trabajo Inadecuados',
      reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16)',
      items: [
        'Desarrollo inadecuado de estándares',
        'Comunicación inadecuada de estándares',
        'Mantenimiento inadecuado de estándares',
        'Monitoreo inadecuado del cumplimiento'
      ]
    },
    {
      category: 'Uso y Desgaste',
      reference: '(Ver MAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19)',
      items: [
        'Planificación inadecuada del uso',
        'Extensión inadecuada de la vida útil',
        'Inspección y/o monitoreo inadecuados',
        'Carga o proporción de uso inadecuada',
        'Mantenimiento deficiente',
        'Uso por personas no calificadas o entrenadas',
        'Uso para un propósito indebido'
      ]
    }
  ];

  const handleCheckboxChange = (field: 'basicFactorsPersonal' | 'basicFactorsWork', value: string) => {
    const currentValues = formData[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    updateFormData(field, newValues);
  };

  return (
    <div className="space-y-6 bg-yellow-50/50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-6 text-center uppercase">(CB) Causas Básicas / Subyacentes (CB)</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Factores Personales */}
        <div className="space-y-6">
          <h3 className="font-medium text-center pb-2 border-b">FACTORES PERSONALES</h3>
          {personalFactors.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="font-medium text-sm">{category.category}</div>
              <div className="text-xs text-gray-600">{category.reference}</div>
              <div className="space-y-1 pl-4">
                {category.items.map((item, itemIndex) => (
                  <label key={itemIndex} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-yellow-100/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.basicFactorsPersonal?.includes(item) || false}
                      onChange={() => handleCheckboxChange('basicFactorsPersonal', item)}
                      className="mt-1"
                    />
                    <div className="text-sm">{item}</div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Factores Laborales */}
        <div className="space-y-6">
          <h3 className="font-medium text-center pb-2 border-b">FACTORES LABORALES</h3>
          {workFactors.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="font-medium text-sm">{category.category}</div>
              <div className="text-xs text-gray-600">{category.reference}</div>
              <div className="space-y-1 pl-4">
                {category.items.map((item, itemIndex) => (
                  <label key={itemIndex} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-yellow-100/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.basicFactorsWork?.includes(item) || false}
                      onChange={() => handleCheckboxChange('basicFactorsWork', item)}
                      className="mt-1"
                    />
                    <div className="text-sm">{item}</div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}