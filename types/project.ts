export type PersonData = {
  name: string;
  lastName: string;
  dni: string;
  position: string;
}

export type InvestigatorData = PersonData

export type AccidentVictimData = PersonData & {
  age: string;
  miningCompany: string;
  employed: string;
}

export type CorrectiveAction = {
  action: string;
  responsible: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export type NACCategory = {
  category: string;
  subcategories: {
    code: string;
    description: string;
    status: 'P' | 'E' | 'C' | '';
  }[];
}

export type ProjectData = {
  // Paso 1: Datos del Proyecto
  name: string;
  description: string;
  date: string;
  
  // Paso 2: Datos del Investigador/Accidentado
  investigator: InvestigatorData;
  accidentVictim: AccidentVictimData;

  // Paso 3: Evaluación Potencial de Pérdida
  potentialSeverity: 'mayor' | 'grave' | 'menor' | '';
  potentialProbability: 'alta' | 'moderada' | 'rara' | '';
  potentialFrequency: 'grande' | 'moderada' | 'baja' | '';

  // Paso 4: Tipo de Contacto
  contactType: string;
  contactDescription: string;

  // Paso 5: Causas Inmediatas (CI)
  immediateActionsUnsafe: string[];
  immediateConditionsUnsafe: string[];

  // Paso 6: Causas Básicas (CB)
  basicFactorsPersonal: string[];
  basicFactorsWork: string[];

  // Paso 7: Necesidades de Acción Correctiva (NAC)
  nacCategories: NACCategory[];
  correctiveActions: CorrectiveAction[];
}

export const projectEmpty: ProjectData = {
  name: '',
  description: '',
  date: '',
  investigator: {
    name: '',
    lastName: '',
    dni: '',
    position: ''
  },
  accidentVictim: {
    name: '',
    lastName: '',
    age: '',
    dni: '',
    position: '',
    miningCompany: '',
    employed: ''
  },
  potentialSeverity: '',
  potentialProbability: '',
  potentialFrequency: '',
  contactType: '',
  contactDescription: '',
  immediateActionsUnsafe: ['', '', ''],
  immediateConditionsUnsafe: ['', '', ''],
  basicFactorsPersonal: ['', '', ''],
  basicFactorsWork: ['', '', ''],
  nacCategories: [
    {
      category: 'LIDERAZGO Y ADMINISTRACIÓN',
      subcategories: [
        { code: '1.1', description: 'Política General', status: '' },
        { code: '1.2', description: 'Coordinación de Programa', status: '' },
        { code: '1.3', description: 'Participación de la Gerencia', status: '' },
        { code: '1.4', description: 'Estándares de Desempeño Gerencial', status: '' },
        { code: '1.5', description: 'Participación de la Supervisión', status: '' },
        { code: '1.6', description: 'Reuniones de la Gerencia', status: '' },
        { code: '1.7', description: 'Manual de Referencia de Gerencia', status: '' },
        { code: '1.8', description: 'Revisión de las Operaciones', status: '' },
        { code: '1.9', description: 'Comité Central de Seguridad y Salud / Control de Pérdidas', status: '' },
        { code: '1.10', description: 'Comité de Seguridad y Salud por Áreas', status: '' },
        { code: '1.11', description: 'Comité Operativo de Seguridad y Salud por Delegados de Trabajadores', status: '' },
        { code: '1.12', description: 'Auditoría y Revisión del Sistema de Gestión de Seguridad', status: '' },
        { code: '1.13', description: 'Biblioteca de Referencia', status: '' }
      ]
    },
    {
      category: 'ENTRENAMIENTO DEL PERSONAL',
      subcategories: [
        { code: '2.1', description: 'Análisis de Necesidades de Entrenamiento', status: '' },
        { code: '2.2', description: 'Programa de Entrenamiento del Personal', status: '' },
        { code: '2.3', description: 'Evaluación del Programa de Entrenamiento', status: '' }
      ]
    }
  ],
  correctiveActions: [
    {
      action: '',
      responsible: '',
      deadline: '',
      status: 'pending'
    },
    {
      action: '',
      responsible: '',
      deadline: '',
      status: 'pending'
    }
  ]
};