// Tipo unificado para cualquier campo seleccionado en cualquier step
export type SelectedField = {
  fieldId: number;
  comment: string;
}

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

export type NACSubcategory = {
  fieldId: number;
  status: 'P' | 'E' | 'C' | '';
  comment: string;
}

export type ProjectData = {
  // Paso 1: Datos del Proyecto
  name: string;
  description: string;
  date: string;
  
  // Paso 2: Datos del Investigador/Accidentado
  investigator: InvestigatorData;
  accidentVictim: AccidentVictimData;

  // Paso 3: Evaluación Potencial de Pérdida - Solo fieldId y comment
  step3Fields: SelectedField[];

  // Paso 4: Tipo de Contacto - Solo fieldId y comment
  step4Fields: SelectedField[];

  // Paso 5: Causas Inmediatas - Solo fieldId y comment (causas y subcausas)
  step5Fields: SelectedField[];

  // Paso 6: Causas Básicas - Solo fieldId y comment (factores y subcausas)
  step6Fields: SelectedField[];

  // Paso 7: Necesidades de Acción Correctiva - Solo fieldId y comment
  step7Fields: NACSubcategory[];
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
  step3Fields: [],
  step4Fields: [],
  step5Fields: [],
  step6Fields: [],
  step7Fields: [],
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