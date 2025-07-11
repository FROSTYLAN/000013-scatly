import { ProjectData } from '@/types/form-types';

interface Step5Props {
  formData: ProjectData;
  updateFormData: (field: keyof ProjectData, value: any) => void;
}

export function Step5ImmediateCauses({ formData, updateFormData }: Step5Props) {
  const unsafeActs = [
    { id: 1, text: 'Operar sin autorización', reference: '(Ver CI 2,3,4,5,7,8,12,13)', subcauses: [
      'Falta de capacitación',
      'Desconocimiento de procedimientos',
      'Exceso de confianza',
      'Presión por tiempo',
      'Falta de supervisión'
    ]},
    { id: 2, text: 'Dejar de advertir', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13)', subcauses: [
      'Falta de comunicación',
      'Desatención',
      'Prisa',
      'Fatiga',
      'Distracción'
    ]},
    { id: 3, text: 'Dejar de asegurar', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13)', subcauses: [
      'Olvido',
      'Prisa',
      'Falta de conocimiento',
      'Negligencia',
      'Exceso de confianza'
    ]},
    { id: 4, text: 'Operar a velocidad inadecuada', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13)', subcauses: [
      'Presión por tiempo',
      'Exceso de confianza',
      'Falta de experiencia',
      'Mal juicio',
      'Condiciones inadecuadas'
    ]},
    { id: 5, text: 'Desactivar dispositivos de seguridad', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13)', subcauses: [
      'Ahorro de tiempo',
      'Incomodidad',
      'Falta de conocimiento',
      'Mal mantenimiento',
      'Dispositivos defectuosos'
    ]},
    { id: 6, text: 'Usar equipo defectuoso', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)', subcauses: [
      'Falta de inspección',
      'Mantenimiento inadecuado',
      'Falta de reporte',
      'Presupuesto limitado',
      'Negligencia'
    ]},
    { id: 7, text: 'No usar EPP correctamente', reference: '(Ver CI 2,3,4,5,6,7,8,9,11,12,13,15)', subcauses: [
      'Incomodidad',
      'Falta de disponibilidad',
      'EPP inadecuado',
      'Falta de capacitación',
      'Resistencia al uso'
    ]},
    { id: 8, text: 'Cargar incorrectamente', reference: '(Ver CI 1,2,3,4,5,6,7,8,9,11,12,13,15)', subcauses: [
      'Falta de ayuda mecánica',
      'Prisa',
      'Sobreesfuerzo',
      'Mala postura',
      'Falta de conocimiento'
    ]},
    { id: 9, text: 'Almacenar incorrecto', reference: '(Ver CI 1,2,3,4,5,6,7,8,9,11,12,13,15)', subcauses: [
      'Falta de espacio',
      'Desorden',
      'Mala organización',
      'Falta de señalización',
      'Procedimientos inadecuados'
    ]},
    { id: 10, text: 'Levantar incorrectamente', reference: '(Ver CI 8,10,11,12,13,14,15)', subcauses: [
      'Falta de técnica',
      'Sobrecarga',
      'Prisa',
      'Espacio reducido',
      'Falta de ayuda'
    ]},
    { id: 11, text: 'Posición incorrecta', reference: '(Ver CI 1,2,3,4,5,6,7,8,9,10,11,12,13,15)', subcauses: [
      'Espacio inadecuado',
      'Fatiga',
      'Mala ergonomía',
      'Falta de capacitación',
      'Herramientas inadecuadas'
    ]},
    { id: 12, text: 'Dar servicio a equipo en funcionamiento', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)', subcauses: [
      'Presión por tiempo',
      'Falta de procedimientos',
      'Exceso de confianza',
      'Falta de bloqueo',
      'Urgencia operativa'
    ]},
    { id: 13, text: 'Juguetear', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)', subcauses: [
      'Falta de disciplina',
      'Distracción',
      'Ambiente laboral',
      'Supervisión deficiente',
      'Falta de consecuencias'
    ]},
    { id: 14, text: 'Bajo influencia del alcohol y/u otra droga', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)', subcauses: [
      'Problemas personales',
      'Falta de control',
      'Adicción',
      'Presión social',
      'Estrés laboral'
    ]},
    { id: 15, text: 'Usar equipo incorrecto', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)', subcauses: [
      'Falta de disponibilidad',
      'Improvisación',
      'Desconocimiento',
      'Falta de capacitación',
      'Presión por tiempo'
    ]},
    { id: 16, text: 'No seguir procedimientos', reference: '(Ver CI 2,3,4,5,6,7,8,9,10,11,12,13,15)', subcauses: [
      'Desconocimiento',
      'Falta de capacitación',
      'Exceso de confianza',
      'Procedimientos obsoletos',
      'Resistencia al cambio'
    ]}
  ];

  const unsafeConditions = [
    { id: 17, text: 'Equipo de protección inadecuado o impropio', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12,13)', subcauses: [
      'Mal estado',
      'Talla incorrecta',
      'Tipo inadecuado',
      'Falta de mantenimiento',
      'Baja calidad'
    ]},
    { id: 18, text: 'Herramientas, Equipo o Materiales defectuosos', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12,13)', subcauses: [
      'Desgaste',
      'Falta de mantenimiento',
      'Uso incorrecto',
      'Mala calidad',
      'Almacenamiento inadecuado'
    ]},
    { id: 19, text: 'Espacio limitado para desenvolverse', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10)', subcauses: [
      'Diseño inadecuado',
      'Mala distribución',
      'Acumulación de materiales',
      'Falta de orden',
      'Equipos mal ubicados'
    ]},
    { id: 20, text: 'Sistemas de advertencia insuficientes', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10)', subcauses: [
      'Falta de señalización',
      'Señales dañadas',
      'Ubicación incorrecta',
      'Señales obsoletas',
      'Falta de mantenimiento'
    ]},
    { id: 21, text: 'Peligro de explosión o incendio', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10)', subcauses: [
      'Materiales inflamables',
      'Instalaciones defectuosas',
      'Falta de control',
      'Almacenamiento inadecuado',
      'Falta de sistemas contra incendios'
    ]},
    { id: 22, text: 'Orden y limpieza deficientes / Desorden', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12,13)', subcauses: [
      'Falta de procedimientos',
      'Personal insuficiente',
      'Falta de supervisión',
      'Cultura organizacional',
      'Espacios inadecuados'
    ]},
    { id: 23, text: 'Exposición al Ruido', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12,13,14)', subcauses: [
      'Equipos ruidosos',
      'Falta de mantenimiento',
      'Ausencia de barreras',
      'Diseño inadecuado',
      'Falta de control'
    ]},
    { id: 24, text: 'Exposición a la Radiación', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12,13,14)', subcauses: [
      'Falta de protección',
      'Control inadecuado',
      'Equipos defectuosos',
      'Procedimientos incorrectos',
      'Falta de señalización'
    ]},
    { id: 25, text: 'Exposición a temperaturas altas o bajas', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12)', subcauses: [
      'Ventilación inadecuada',
      'Falta de aislamiento',
      'Equipos defectuosos',
      'Diseño inadecuado',
      'Control deficiente'
    ]},
    { id: 26, text: 'Iluminación Deficiente o Excesiva', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12)', subcauses: [
      'Mantenimiento deficiente',
      'Diseño inadecuado',
      'Falta de control',
      'Equipos inadecuados',
      'Distribución incorrecta'
    ]},
    { id: 27, text: 'Ventilación Insuficiente', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10)', subcauses: [
      'Diseño inadecuado',
      'Equipos defectuosos',
      'Falta de mantenimiento',
      'Control deficiente',
      'Obstrucciones'
    ]},
    { id: 28, text: 'Condiciones Ambientales Peligrosas', reference: '(Ver CR 1,2,3,4,5,6,7,8,9,10,11,12)', subcauses: [
      'Factores climáticos',
      'Contaminación',
      'Falta de control',
      'Diseño inadecuado',
      'Mantenimiento deficiente'
    ]}
  ];

  const toggleItem = (field: 'immediateActionsUnsafe' | 'immediateConditionsUnsafe', text: string) => {
    const currentItems = formData[field] || [];
    const itemIndex = currentItems.findIndex(item => item.text === text);
    
    const item = field === 'immediateActionsUnsafe'
      ? unsafeActs.find(act => act.text === text)
      : unsafeConditions.find(condition => condition.text === text);

    if (itemIndex >= 0) {
      const newItems = currentItems.filter(item => item.text !== text);
      updateFormData(field, newItems);
    } else if (item) {
      const newItem = {
        text,
        comment: '',
        reference: item.reference,
        subcauses: item.subcauses.map(subcause => ({
          text: subcause,
          selected: false,
          comment: ''
        }))
      };
      updateFormData(field, [...currentItems, newItem]);
    }
  };

  const updateComment = (field: 'immediateActionsUnsafe' | 'immediateConditionsUnsafe', text: string, comment: string) => {
    const currentItems = formData[field] || [];
    const newItems = currentItems.map(item => 
      item.text === text ? { ...item, comment } : item
    );
    updateFormData(field, newItems);
  };

  const toggleSubcause = (field: 'immediateActionsUnsafe' | 'immediateConditionsUnsafe', itemText: string, subcauseText: string) => {
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

  const updateSubcauseComment = (field: 'immediateActionsUnsafe' | 'immediateConditionsUnsafe', itemText: string, subcauseText: string, comment: string) => {
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
      <h2 className="text-2xl font-bold">Causas Inmediatas o Directas (CI)</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Actos Subestándares/Inseguros */}
        <div className="space-y-4">
          <h3 className="font-medium text-center pb-2 border-b">ACTOS SUBESTÁNDARES/INSEGUROS</h3>
          <div className="space-y-2">
            {unsafeActs.map((act) => {
              const isSelected = formData.immediateActionsUnsafe?.some(item => item.text === act.text) || false;
              const currentItem = formData.immediateActionsUnsafe?.find(item => item.text === act.text);

              return (
                <label key={act.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-purple-100/10 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleItem('immediateActionsUnsafe', act.text)}
                    className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                  />
                  <div className="space-y-2 flex-1">
                    <div className="text-sm font-medium">{act.text}</div>
                    {isSelected && currentItem && (
                      <div className="mt-2 space-y-2">
                        <div className="text-xs text-gray-600 font-medium">Subcausas:</div>
                        <div className="space-y-3">
                          {currentItem.subcauses.map((subcause, index) => (
                            <div key={index} className="pl-4 space-y-2">
                              <label className="flex items-start space-x-2 p-2 rounded hover:bg-purple-100/20 transition-colors duration-200">
                                <input
                                  type="checkbox"
                                  checked={subcause.selected}
                                  onChange={() => toggleSubcause('immediateActionsUnsafe', act.text, subcause.text)}
                                  className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                                />
                                <span className="text-xs text-gray-300">{subcause.text}</span>
                              </label>
                              {subcause.selected && (
                                <textarea
                                  placeholder="Agregar un comentario para esta subcausa..."
                                  value={subcause.comment}
                                  onChange={(e) => updateSubcauseComment('immediateActionsUnsafe', act.text, subcause.text, e.target.value)}
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
                          onChange={(e) => updateComment('immediateActionsUnsafe', act.text, e.target.value)}
                          className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Condiciones Subestándares/Inseguras */}
        <div className="space-y-4">
          <h3 className="font-medium text-center pb-2 border-b">CONDICIONES SUBESTÁNDARES/INSEGURAS</h3>
          <div className="space-y-2">
            {unsafeConditions.map((condition) => {
              const isSelected = formData.immediateConditionsUnsafe?.some(item => item.text === condition.text) || false;
              const currentItem = formData.immediateConditionsUnsafe?.find(item => item.text === condition.text);

              return (
                <label key={condition.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-amber-100/10 cursor-pointer transition-colors duration-200">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleItem('immediateConditionsUnsafe', condition.text)}
                    className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                  />
                  <div className="space-y-2 flex-1">
                    <div className="text-sm font-medium">{condition.text}</div>
                    {isSelected && currentItem && (
                      <div className="mt-2 space-y-2">
                        <div className="text-xs text-gray-600 font-medium">Subcausas:</div>
                        <div className="space-y-3">
                          {currentItem.subcauses.map((subcause, index) => (
                            <div key={index} className="pl-4 space-y-2">
                              <label className="flex items-start space-x-2 p-2 rounded hover:bg-amber-100/20 transition-colors duration-200">
                                <input
                                  type="checkbox"
                                  checked={subcause.selected}
                                  onChange={() => toggleSubcause('immediateConditionsUnsafe', condition.text, subcause.text)}
                                  className="mt-1 form-checkbox text-amber-500 focus:ring-amber-500"
                                />
                                <span className="text-xs text-gray-300">{subcause.text}</span>
                              </label>
                              {subcause.selected && (
                                <textarea
                                  placeholder="Agregar un comentario para esta subcausa..."
                                  value={subcause.comment}
                                  onChange={(e) => updateSubcauseComment('immediateConditionsUnsafe', condition.text, subcause.text, e.target.value)}
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
                          onChange={(e) => updateComment('immediateConditionsUnsafe', condition.text, e.target.value)}
                          className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-100/10 text-white placeholder:text-gray-400"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}