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

export type ProjectData = {
  // Paso 1: Datos del Proyecto
  name: string;
  description: string;
  date: string;
  
  // Paso 2: Datos del Investigador/Accidentado
  investigator: InvestigatorData;
  accidentVictim: AccidentVictimData;

  // Paso 3: Tipo de Contacto
  contactType: string;
  contactDescription: string;

  // Paso 4: Causas Inmediatas (CI)
  immediateActionsUnsafe: string[];
  immediateConditionsUnsafe: string[];

  // Paso 5: Causas Básicas (CB)
  basicFactorsPersonal: string[];
  basicFactorsWork: string[];

  // Paso 6: Necesidades de Acción Correctiva (NAC)
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
  contactType: '',
  contactDescription: '',
  immediateActionsUnsafe: ['', '', ''],
  immediateConditionsUnsafe: ['', '', ''],
  basicFactorsPersonal: ['', '', ''],
  basicFactorsWork: ['', '', ''],
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