export const DEFAULT_FIELDS = [
  // PASO 1: DATOS DEL PROYECTO
  {
    parent_code: null,
    code: 'STEP_1',
    name: 'Datos del proyecto',
    has_comment: false
  },
  { parent_code: 'STEP_1', code: 'S1_1', name: 'Nombre del proyecto', has_comment: true },
  { parent_code: 'STEP_1', code: 'S1_2', name: 'Descripción', has_comment: true },
  { parent_code: 'STEP_1', code: 'S1_3', name: 'Fecha', has_comment: true },

  // PASO 2: DATOS DEL INVESTIGADOR / DATOS DEL ACCIDENTADO
  {
    parent_code: null,
    code: 'STEP_2_A',
    name: 'Datos del Investigador',
    has_comment: false
  },
  { parent_code: 'STEP_2_A', code: 'S2_A_1', name: 'Nombre', has_comment: true },
  { parent_code: 'STEP_2_A', code: 'S2_A_2', name: 'Apellido', has_comment: true },
  { parent_code: 'STEP_2_A', code: 'S2_A_3', name: 'DNI', has_comment: true },
  { parent_code: 'STEP_2_A', code: 'S2_A_4', name: 'Cargo', has_comment: true },
  {
    parent_code: null,
    code: 'STEP_2_B',
    name: 'Datos del Accidentado',
    has_comment: false
  },
  { parent_code: 'STEP_2_B', code: 'S2_B_1', name: 'Nombre', has_comment: true },
  { parent_code: 'STEP_2_B', code: 'S2_B_2', name: 'Apellido', has_comment: true },
  { parent_code: 'STEP_2_B', code: 'S2_B_3', name: 'Edad', has_comment: true },
  { parent_code: 'STEP_2_B', code: 'S2_B_4', name: 'DNI', has_comment: true },
  { parent_code: 'STEP_2_B', code: 'S2_B_5', name: 'Cargo', has_comment: true },
  { parent_code: 'STEP_2_B', code: 'S2_B_6', name: 'Empresa minera', has_comment: true },
  { parent_code: 'STEP_2_B', code: 'S2_B_7', name: 'Empleado', has_comment: true },

  // PASO 3: EVALUACIÓN POTENCIAL DE PÉRDIDA SI NO ES CONTROLADO
  {
    parent_code: null,
    code: 'STEP_3',
    name: 'Evaluación potencial de pérdida si no es controlado',
    has_comment: false
  },
  {
    parent_code: 'STEP_3',
    code: 'S3_1',
    name: 'Potencial de severidad de pérdida',
    has_comment: true
  },
  { parent_code: 'S3_1', code: 'S3_1_1', name: 'Mayor (A)', has_comment: false },
  { parent_code: 'S3_1', code: 'S3_1_2', name: 'Grave (B)', has_comment: false },
  { parent_code: 'S3_1', code: 'S3_1_3', name: 'Menor (C)', has_comment: false },
  {
    parent_code: 'STEP_3',
    code: 'S3_2',
    name: 'Probabilidad de ocurrencia',
    has_comment: true
  },
  { parent_code: 'S3_2', code: 'S3_2_1', name: 'Alta (A)', has_comment: false },
  { parent_code: 'S3_2', code: 'S3_2_2', name: 'Moderada (B)', has_comment: false },
  { parent_code: 'S3_2', code: 'S3_2_3', name: 'Rara (C)', has_comment: false },
  {
    parent_code: 'STEP_1',
    code: 'S3_3',
    name: 'Frecuencia de exposición',
    has_comment: true
  },
  { parent_code: 'S3_3', code: 'S3_3_1', name: 'Grande (A)', has_comment: false },
  { parent_code: 'S3_3', code: 'S3_3_2', name: 'Moderada (B)', has_comment: false },
  { parent_code: 'S3_3', code: 'S3_3_3', name: 'Baja (C)', has_comment: false },

  // PASO 4: TIPO DE CONTACTO O CUASI CONTACTO CON ENERGÍA O SUSTANCIA
  {
    parent_code: null,
    code: 'STEP_4',
    name: 'Tipo de Contacto o Cuasi Contacto con Energía o Sustancia',
    has_comment: false
  },
];

// Función para obtener campos raíz (sin parent)
export function getRootFields() {
  return DEFAULT_FIELDS.filter(field => field.parent_code === null);
}

// Función para obtener campos hijos de un campo específico
export function getChildFields(parentCode: string) {
  return DEFAULT_FIELDS.filter(field => field.parent_code === parentCode);
}

// Función para obtener todos los campos
export function getAllDefaultFields() {
  return DEFAULT_FIELDS;
}

// Función para obtener campos con comentarios habilitados
export function getFieldsWithComments() {
  return DEFAULT_FIELDS.filter(field => field.has_comment);
}

// Función para obtener campos sin comentarios
export function getFieldsWithoutComments() {
  return DEFAULT_FIELDS.filter(field => !field.has_comment);
}

// Función para obtener un campo por código
export function getFieldByCode(code: string) {
  return DEFAULT_FIELDS.find(field => field.code === code);
}