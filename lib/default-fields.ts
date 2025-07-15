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
    parent_code: 'STEP_3',
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
  { parent_code: 'STEP_4', code: 'S4_1', name: 'Golpeada Contra (chocar contra algo)', has_comment: true },
  { parent_code: 'STEP_4', code: 'S4_2', name: 'Golpeado por (Impactado por objeto en movimiento)', has_comment: true },
  { parent_code: 'STEP_4', code: 'S4_3', name: 'Caída a un nivel más bajo', has_comment: true },
  { parent_code: 'STEP_4', code: 'S4_4', name: 'Caída en el mismo nivel (Resbalar y caer, tropezar)', has_comment: true },
  { parent_code: 'STEP_4', code: 'S4_5', name: 'Atrapado (Puntos de Pellizco y Mordida)', has_comment: true },
  { parent_code: 'STEP_4', code: 'S4_6', name: 'Cogido (Enganchado, Colgado)', has_comment: true },
  { parent_code: 'STEP_4', code: 'S4_7', name: 'Atrapado entre o debajo ( Chancado, Amputado)', has_comment: true },
  { parent_code: 'STEP_4', code: 'S4_8', name: 'Contacto con ( Electricidad, Calor, Frío, Radiación, Caústicos, Tóxicos, Ruido)', has_comment: true },
  { parent_code: 'STEP_4', code: 'S4_9', name: 'Sobretensión; Sobre-esfuerzo; Sobrecarga', has_comment: true },

  // PASO 5: CAUSAS INMEDIATAS O DIRECTAS (CI)
  {
    parent_code: null,
    code: 'STEP_5',
    name: 'Causas Inmediatas o Directas (CI)',
    has_comment: false
  },

  {
    parent_code: 'STEP_5',
    code: 'S5_C1',
    name: 'ACTOS SUBESTANDAR/INSEGUROS',
    has_comment: false
  },
  { parent_code: 'S5_C1', code: 'S5_C1_1', name: 'Operar equipo sin autorización', has_comment: true },
    { parent_code: 'S5_C1_1', code: 'S5_C1_1_1', name: '¿Tiene autorización de MYSRL?', has_comment: true },
    { parent_code: 'S5_C1_1', code: 'S5_C1_1_2', name: '¿Tiene autorización del supervisor o del responsable del equipo?', has_comment: true },

  { parent_code: 'S5_C1', code: 'S5_C1_2', name: 'Omisión de advertir', has_comment: true },
    { parent_code: 'S5_C1_2', code: 'S5_C1_2_1', name: 'Falta de señalización o advertencia de peligros en el área de trabajo', has_comment: true },

  { parent_code: 'S5_C1', code: 'S5_C1_3', name: 'Omisión de Asegurar', has_comment: true },
    { parent_code: 'S5_C1_3', code: 'S5_C1_3_1', name: 'Falta de dispositivos de seguridad o bloqueo en equipos y sistemas', has_comment: true },
  
  { parent_code: 'S5_C1', code: 'S5_C1_4', name: 'Operar a velocidad indebida', has_comment: true },
    { parent_code: 'S5_C1_4', code: 'S5_C1_4_1', name: 'La velocidad de manejo o de operación, ¿es la adecuada?', has_comment: true },
    { parent_code: 'S5_C1_4', code: 'S5_C1_4_2', name: 'Alimentar o suministrar materiales velocidad subestandar', has_comment: true },
    { parent_code: 'S5_C1_4', code: 'S5_C1_4_3', name: 'Velocidad excesiva en los movimientos', has_comment: true },

  { parent_code: 'S5_C1', code: 'S5_C1_5', name: 'Desactivar dispositivos de seguridad', has_comment: true },
    { parent_code: 'S5_C1_5', code: 'S5_C1_5_1', name: 'Se retiraron/desactivaron guardas, alarmas, cinturones, etc', has_comment: true },
    { parent_code: 'S5_C1_5', code: 'S5_C1_5_2', name: 'Bloquear o amarrar el dispositivo de seguridad', has_comment: true },
    { parent_code: 'S5_C1_5', code: 'S5_C1_5_3', name: 'Desconectar o remover el dispositivo de seguridad', has_comment: true },
    { parent_code: 'S5_C1_5', code: 'S5_C1_5_4', name: 'Desajustar el dispositivo de seguridad', has_comment: true },
    { parent_code: 'S5_C1_5', code: 'S5_C1_5_5', name: 'Reemplazo del dispositivo de seguridad por otro de menor capacidad', has_comment: true },
    { parent_code: 'S5_C1_5', code: 'S5_C1_5_6', name: 'Dispositivos de seguridad removidos o inhabilitados', has_comment: true },

  { parent_code: 'S5_C1', code: 'S5_C1_6', name: 'Usar equipo defectuoso', has_comment: true },
    { parent_code: 'S5_C1_6', code: 'S5_C1_6_1', name: 'Operar equipos con fallas mecánicas identificadas', has_comment: true },

  { parent_code: 'S5_C1', code: 'S5_C1_7', name: 'No usar el EPP correctamente', has_comment: true },
    { parent_code: 'S5_C1_7', code: 'S5_C1_7_1', name: 'Tiene el EPP pero no los usa.', has_comment: true },
    { parent_code: 'S5_C1_7', code: 'S5_C1_7_2', name: 'El EPP los usa incorrectamente', has_comment: true },

  { parent_code: 'S5_C1', code: 'S5_C1_8', name: 'Carga Incorrecta', has_comment: true },
    { parent_code: 'S5_C1_8', code: 'S5_C1_8_1', name: 'Transporte inadecuado de la carga en el equipo', has_comment: true },
    { parent_code: 'S5_C1_8', code: 'S5_C1_8_2', name: 'Carga suspendida en lugar de ser levantada desde la base', has_comment: true },
  
  { parent_code: 'S5_C1', code: 'S5_C1_9', name: 'Colocación incorrecta', has_comment: true },
    { parent_code: 'S5_C1_9', code: 'S5_C1_9_1', name: 'Colocación incorrecta de la carga durante el traslado', has_comment: true },
    { parent_code: 'S5_C1_9', code: 'S5_C1_9_2', name: 'Posición inadecuada del objeto frente a una fuente de energía', has_comment: true },
    { parent_code: 'S5_C1_9', code: 'S5_C1_9_3', name: 'Posición inadecuada del trabajador que lo pone en riesgo de contacto con energía', has_comment: true },
    { parent_code: 'S5_C1_9', code: 'S5_C1_9_4', name: 'Ubicaciones relativas cuantificadas: cerca, lejos, arriba, abajo', has_comment: true },

  { parent_code: 'S5_C1', code: 'S5_C1_10', name: 'Levantar incorrectamente', has_comment: true },
    { parent_code: 'S5_C1_10', code: 'S5_C1_10_1', name: 'Carga levantada de forma incorrecta', has_comment: true },
    { parent_code: 'S5_C1_10', code: 'S5_C1_10_2', name: 'Fuerza mal aplicada o insuficiente al levantar', has_comment: true },
    { parent_code: 'S5_C1_10', code: 'S5_C1_10_3', name: 'Suspensión indirecta del objeto mediante elementos de izaje', has_comment: true },

  { parent_code: 'S5_C1', code: 'S5_C1_11', name: 'Posición indebida', has_comment: true },
    { parent_code: 'S5_C1_11', code: 'S5_C1_11_1', name: 'Objeto mal posicionado respecto a su referencia', has_comment: true },
    { parent_code: 'S5_C1_11', code: 'S5_C1_11_2', name: 'Posición inadecuada del objeto: inclinado, oblicuo, mal posado, etc', has_comment: true },

  { parent_code: 'S5_C1', code: 'S5_C1_12', name: 'Dar servicio a equipo en funcionamiento', has_comment: true },
    { parent_code: 'S5_C1_12', code: 'S5_C1_12_1', name: 'Trabajo en equipo en funcionamiento o energizado', has_comment: true },
    { parent_code: 'S5_C1_12', code: 'S5_C1_12_2', name: 'Limpieza, lubricación o ajuste con el equipo en funcionamiento', has_comment: true },

  { parent_code: 'S5_C1', code: 'S5_C1_13', name: 'Jugueteo', has_comment: true },
    { parent_code: 'S5_C1_13', code: 'S5_C1_13_1', name: 'Está claro', has_comment: true },
    
  { parent_code: 'S5_C1', code: 'S5_C1_14', name: 'Bajo la influencia del alcohol y/u otras drogas', has_comment: true },
    { parent_code: 'S5_C1_14', code: 'S5_C1_14_1', name: 'Está claro', has_comment: true },
    
  { parent_code: 'S5_C1', code: 'S5_C1_15', name: 'Uso indebido del equipo', has_comment: true },
    { parent_code: 'S5_C1_15', code: 'S5_C1_15_1', name: 'Dar otros usos diferentes a los de diseño a los equipos', has_comment: true },

  { parent_code: 'S5_C1', code: 'S5_C1_16', name: 'Otro acto no clasificado', has_comment: true },
    { parent_code: 'S5_C1_16', code: 'S5_C1_16_1', name: 'Prácticas excepcionales no contempladas en otras categorías', has_comment: true },

  {
    parent_code: 'STEP_5',
    code: 'S5_C2',
    name: 'CONDICIONES SUBESTANDAR / INSEGURAS',
    has_comment: false
  },
  { parent_code: 'S5_C2', code: 'S5_C2_1', name: 'Guardas o barreras inadecuadas', has_comment: true },
    { parent_code: 'S5_C2_1', code: 'S5_C2_1_1', name: 'Guardas o barreras de contención inadecuadas o ausentes', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_2', name: 'Paredes, tejados, etc.. inestables', has_comment: true },
    { parent_code: 'S5_C2_2', code: 'S5_C2_2_1', name: 'Estructuras verticales u horizontales inestables o colapsables', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_3', name: 'Caminos, pisos, superficies inadecuadas', has_comment: true },
    { parent_code: 'S5_C2_3', code: 'S5_C2_3_1', name: 'Condiciones deficientes en superficies de trabajo o tránsito', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_4', name: 'Equipo de protección incorrecto o inadecuado', has_comment: true },
    { parent_code: 'S5_C2_4', code: 'S5_C2_4_1', name: 'EPP no conforme con normas aceptadas por MYSRL', has_comment: true },
    { parent_code: 'S5_C2_4', code: 'S5_C2_4_2', name: 'EPP en mal estado, no cumple su función', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_5', name: 'Herramientas, equipo o materiales defectuosos', has_comment: true },
    { parent_code: 'S5_C2_5', code: 'S5_C2_5_1', name: 'Herramientas, equipos o materiales: insumos no personales para realizar la tarea', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_6', name: 'Congestión o acción restringida', has_comment: true },
    { parent_code: 'S5_C2_6', code: 'S5_C2_6_1', name: 'Movimientos restringidos por espacio limitado', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_7', name: 'Sistema de advertencia inadecuado', has_comment: true },
    { parent_code: 'S5_C2_7', code: 'S5_C2_7_1', name: 'Sistemas de advertencia presentes pero inadecuados o insuficientes', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_8', name: 'Peligros de incendio y explosión', has_comment: true },
    { parent_code: 'S5_C2_8', code: 'S5_C2_8_1', name: 'Está claro (combustible, explosivos, etc)', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_9', name: 'Orden y Limpieza deficientes/ Desorden', has_comment: true },
    { parent_code: 'S5_C2_9', code: 'S5_C2_9_1', name: 'Orden y limpieza no cumplen con los estándares del área', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_10', name: 'Exposición al ruido', has_comment: true },
    { parent_code: 'S5_C2_10', code: 'S5_C2_10_1', name: 'Está claro', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_11', name: 'Exposición a la radiación', has_comment: true },
    { parent_code: 'S5_C2_11', code: 'S5_C2_11_1', name: 'Exposición a radiación de cualquier fuente, incluida radiación solar UV', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_12', name: 'Temperaturas extremas', has_comment: true },
    { parent_code: 'S5_C2_12', code: 'S5_C2_12_1', name: 'Está claro, frío o calor', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_13', name: 'Peligros ergonómicos', has_comment: true },
    { parent_code: 'S5_C2_13', code: 'S5_C2_13_1', name: 'Diseño de equipos que provoca posturas inapropiadas', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_14', name: 'Iluminación deficiente o excesiva', has_comment: true },
    { parent_code: 'S5_C2_14', code: 'S5_C2_14_1', name: 'Iluminación insuficiente o mal orientada', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_15', name: 'Ventilación inadecuada', has_comment: true },
    { parent_code: 'S5_C2_15', code: 'S5_C2_15_1', name: 'Cantidad o calidad de aire suministrada inadecuada', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_16', name: 'Condiciones ambientales peligrosas', has_comment: true },
    { parent_code: 'S5_C2_16', code: 'S5_C2_16_1', name: 'Condiciones ambientales que exceden los controles en campo', has_comment: true },

  { parent_code: 'S5_C2', code: 'S5_C2_17', name: 'Otra condición no clasificada', has_comment: true },
    { parent_code: 'S5_C2_17', code: 'S5_C2_17_1', name: 'Condiciones de trabajo excepcionales no clasificadas previamente', has_comment: true },

  // PASO 6: CAUSAS BÁSICAS / SUBYACENTES (CB)
  {
    parent_code: null,
    code: 'STEP_6',
    name: 'Causas básicas o subyacentes (CB)',
    has_comment: false
  },

  {
    parent_code: 'STEP_6',
    code: 'S6_C1',
    name: 'FACTORES PERSONALES',
    has_comment: false
  },
  { parent_code: 'S6_C1', code: 'S6_C1_1', name: 'Capacidad física / Fisiológica inadecuada', has_comment: true },
    { parent_code: 'S6_C1_1', code: 'S6_C1_1_1', name: 'Estatura, peso, tamaño, fuerza, alcance, etc. inadecuados', has_comment: true },
    { parent_code: 'S6_C1_1', code: 'S6_C1_1_2', name: 'Rango limitado de movimiento corporal', has_comment: true },
    { parent_code: 'S6_C1_1', code: 'S6_C1_1_3', name: 'Capacidad limitada para mantener posiciones del cuerpo', has_comment: true },
    { parent_code: 'S6_C1_1', code: 'S6_C1_1_4', name: 'Alergias o sensibilidad a sustancias', has_comment: true },
    { parent_code: 'S6_C1_1', code: 'S6_C1_1_5', name: 'Sensibilidad a extremos sensoriales', has_comment: true },
    { parent_code: 'S6_C1_1', code: 'S6_C1_1_6', name: 'Defecto de visión', has_comment: true },
    { parent_code: 'S6_C1_1', code: 'S6_C1_1_7', name: 'Defecto de audición', has_comment: true },
    { parent_code: 'S6_C1_1', code: 'S6_C1_1_8', name: 'Otros defectos sensoriales (tacto, gusto, olfato. equilibrio)', has_comment: true },
    { parent_code: 'S6_C1_1', code: 'S6_C1_1_9', name: 'Incapacidad respiratoria', has_comment: true },
    { parent_code: 'S6_C1_1', code: 'S6_C1_1_10', name: 'Otras capacidades físicas permanentes', has_comment: true },
    { parent_code: 'S6_C1_1', code: 'S6_C1_1_11', name: 'Incapacidades temporales', has_comment: true },
    
  { parent_code: 'S6_C1', code: 'S6_C1_2', name: 'Capacidad Mental / Psicológica inadecuada', has_comment: true },
    { parent_code: 'S6_C1_2', code: 'S6_C1_2_1', name: 'Miedos y Fobias', has_comment: true },
    { parent_code: 'S6_C1_2', code: 'S6_C1_2_2', name: 'Perturbación Emocional', has_comment: true },
    { parent_code: 'S6_C1_2', code: 'S6_C1_2_3', name: 'Enfermedad Mental', has_comment: true },
    { parent_code: 'S6_C1_2', code: 'S6_C1_2_4', name: 'Nivel de Inteligencia', has_comment: true },
    { parent_code: 'S6_C1_2', code: 'S6_C1_2_5', name: 'Incapacidad para Comprender', has_comment: true },
    { parent_code: 'S6_C1_2', code: 'S6_C1_2_6', name: 'Mal discernimiento', has_comment: true },
    { parent_code: 'S6_C1_2', code: 'S6_C1_2_7', name: 'Mala coordinación', has_comment: true },
    { parent_code: 'S6_C1_2', code: 'S6_C1_2_8', name: 'Tiempo lento de reacción', has_comment: true },
    { parent_code: 'S6_C1_2', code: 'S6_C1_2_9', name: 'Baja aptitud mecánica', has_comment: true },
    { parent_code: 'S6_C1_2', code: 'S6_C1_2_10', name: 'Baja aptitud para el aprendizaje', has_comment: true },
    { parent_code: 'S6_C1_2', code: 'S6_C1_2_11', name: 'Fallas de memoria', has_comment: true },
    
  { parent_code: 'S6_C1', code: 'S6_C1_3', name: 'Tensión física o fisiológica', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_1', name: 'Lesión o Enfermedad', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_2', name: 'Fatiga debida a carga o duración del trabajo', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_3', name: 'Fatiga debida a falta de descanso', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_4', name: 'Fatiga debida a sobrecarga sensorial', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_5', name: 'Exposición a peligros para la salud', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_6', name: 'Exposición a temperaturas extremas', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_7', name: 'Deficiencia de oxígeno', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_8', name: 'Variación de la presión atmosférica', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_9', name: 'Movimiento restringido', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_10', name: 'Insuficiencia de azúcar en la sangre', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_11', name: 'Drogas', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_12', name: 'Otro estrés físico', has_comment: true },

  { parent_code: 'S6_C1', code: 'S6_C1_4', name: 'Tensión mental o psicológica', has_comment: true },
    { parent_code: 'S6_C1_4', code: 'S6_C1_4_1', name: 'Sobrecarga emocional', has_comment: true },
    { parent_code: 'S6_C1_4', code: 'S6_C1_4_2', name: 'Fatiga debida a la velocidad o carga de trabajo mental', has_comment: true },
    { parent_code: 'S6_C1_4', code: 'S6_C1_4_3', name: 'Exigencias extremas de discernimiento / decisión', has_comment: true },
    { parent_code: 'S6_C1_4', code: 'S6_C1_4_4', name: 'Rutina, monotonía, exigencia de vigilancia aburrida', has_comment: true },
    { parent_code: 'S6_C1_4', code: 'S6_C1_4_5', name: 'Exigencias extremas de concentración / percepción', has_comment: true },
    { parent_code: 'S6_C1_4', code: 'S6_C1_4_6', name: 'Actividades sin "sentido" o "degradantes"', has_comment: true },
    { parent_code: 'S6_C1_4', code: 'S6_C1_4_7', name: 'Instrucciones/ exigencias confusas', has_comment: true },
    { parent_code: 'S6_C1_4', code: 'S6_C1_4_8', name: 'Exigencias /instrucciones contradictorias', has_comment: true },
    { parent_code: 'S6_C1_4', code: 'S6_C1_4_9', name: 'Preocupación por problemas', has_comment: true },
    { parent_code: 'S6_C1_4', code: 'S6_C1_4_10', name: 'Frustración', has_comment: true },
    { parent_code: 'S6_C1_4', code: 'S6_C1_4_11', name: 'Enfermedad Mental', has_comment: true },
    { parent_code: 'S6_C1_3', code: 'S6_C1_3_12', name: 'Otro estrés mental', has_comment: true },

  { parent_code: 'S6_C1', code: 'S6_C1_5', name: 'Falta de conocimientos', has_comment: true },
    { parent_code: 'S6_C1_5', code: 'S6_C1_5_1', name: 'Falta de experiencia', has_comment: true },
    { parent_code: 'S6_C1_5', code: 'S6_C1_5_2', name: 'Orientación inadecuada', has_comment: true },
    { parent_code: 'S6_C1_5', code: 'S6_C1_5_3', name: 'Entrenamiento inicial inadecuado', has_comment: true },
    { parent_code: 'S6_C1_5', code: 'S6_C1_5_4', name: 'Entrenamiento de actualización inadecuado', has_comment: true },
    { parent_code: 'S6_C1_5', code: 'S6_C1_5_5', name: 'Instrucciones malentendidas', has_comment: true },

  { parent_code: 'S6_C1', code: 'S6_C1_6', name: 'Falta de habilidad', has_comment: true },
    { parent_code: 'S6_C1_6', code: 'S6_C1_6_1', name: 'Instrucción inicial inadecuada', has_comment: true },
    { parent_code: 'S6_C1_6', code: 'S6_C1_6_2', name: 'Procedimiento inadecuado', has_comment: true },
    { parent_code: 'S6_C1_6', code: 'S6_C1_6_3', name: 'Desempeño infrecuente', has_comment: true },
    { parent_code: 'S6_C1_6', code: 'S6_C1_6_4', name: 'Falta de Orientación', has_comment: true },
    { parent_code: 'S6_C1_6', code: 'S6_C1_6_5', name: 'Instrucciones de revisión inadecuada', has_comment: true },

  { parent_code: 'S6_C1', code: 'S6_C1_7', name: 'Motivación incorrecta', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_1', name: 'El desempeño incorrecto es premiado', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_2', name: 'El desempeño correcto es castigado', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_3', name: 'Falta de incentivos', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_4', name: 'Frustración excesiva', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_5', name: 'Agresión indebida', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_6', name: 'Intento incorrecto de ahorrar tiempo o esfuerzo', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_7', name: 'Intento incorrecto de evitar incomodidad', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_8', name: 'Intento incorrecto de llamar la atención', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_9', name: 'Disciplina inadecuada', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_10', name: 'Presión indebida de los compañeros', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_11', name: 'Ejemplo indebido de la supervisión', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_12', name: 'Retroalimentación inadecuada del desempeño', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_13', name: 'Refuerzo inadecuado de la conducta correcta', has_comment: true },
    { parent_code: 'S6_C1_7', code: 'S6_C1_7_14', name: 'Incentivos de producción incorrectos', has_comment: true },
  {
    parent_code: 'STEP_6',
    code: 'S6_C2',
    name: 'FACTORES LABORALES',
    has_comment: false
  },
  { parent_code: 'S6_C2', code: 'S6_C2_1', name: 'Liderazgo y/o Supervisión Inadecuados', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_1', name: 'Relaciones jerárquicas confusas o contradictorias', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_2', name: 'Asignación confusa o contradictoria de responsabilidades', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_3', name: 'Delegación indebida o insuficiente', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_4', name: 'Dar política, procedimiento, prácticas o pautas inadecuadas', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_5', name: 'Dar objetivos, metas o estándares contradictorios', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_6', name: 'Planificación o programación inadecuada del trabajo', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_7', name: 'Instrucciones, orientación y/o entrenamiento inadecuados', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_8', name: 'Proporcionar documentos de referencia, directivas y publicaciones de orientación inadecuadas', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_9', name: 'Identificación y evaluación inadecuadas de exposición a pérdidas', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_10', name: 'Falta de conocimiento del trabajo de supervisión /gerencial', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_11', name: 'Calificaciones individuales incompatibles con los requisitos del trabajo o tarea', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_12', name: 'Medición y evaluación inadecuada del desempeño', has_comment: true },
    { parent_code: 'S6_C2_1', code: 'S6_C2_1_13', name: 'Retroalimentación inadecuada o incorrecta del desempeño', has_comment: true },

  { parent_code: 'S6_C2', code: 'S6_C2_2', name: 'Ingeniería Inadecuada', has_comment: true },
    { parent_code: 'S6_C2_2', code: 'S6_C2_2_1', name: 'Evaluación inadecuada de exposición a pérdidas', has_comment: true },
    { parent_code: 'S6_C2_2', code: 'S6_C2_2_2', name: 'Consideración inadecuada de factores humanos/ergonomía', has_comment: true },
    { parent_code: 'S6_C2_2', code: 'S6_C2_2_3', name: 'Estándares, especificaciones y /o criterios de diseño inadecuados', has_comment: true },
    { parent_code: 'S6_C2_2', code: 'S6_C2_2_4', name: 'Control inadecuado de la construcción', has_comment: true },
    { parent_code: 'S6_C2_2', code: 'S6_C2_2_5', name: 'Evaluación inadecuada de la preparación operativa', has_comment: true },
    { parent_code: 'S6_C2_2', code: 'S6_C2_2_6', name: 'Controles Inadecuados o incorrectos', has_comment: true },
    { parent_code: 'S6_C2_2', code: 'S6_C2_2_7', name: 'Monitoreo Inadecuado de la operación Inicial', has_comment: true },
    { parent_code: 'S6_C2_2', code: 'S6_C2_2_8', name: 'Evaluación Inadecuada de los cambios', has_comment: true },

  { parent_code: 'S6_C2', code: 'S6_C2_3', name: 'Compras Inadecuadas', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_1', name: 'Especificaciones inadecuadas en las requisiciones', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_2', name: 'Investigación inadecuada de materiales o equipos', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_3', name: 'Especificaciones inadecuadas a los vendedores', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_4', name: 'Modo o ruta de embarque inadecuada', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_5', name: 'Inspección o aceptación de recibos inadecuados', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_6', name: 'Comunicación inadecuada de datos de salud y seguridad', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_7', name: 'Manipulación incorrecta de materiales', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_8', name: 'Almacenamiento incorrecto de materiales', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_9', name: 'Transporte incorrecto de materiales', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_10', name: 'Identificación inadecuada de artículos peligrosos', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_11', name: 'Salvamento y /o eliminación de desechos incorrecta', has_comment: true },
    { parent_code: 'S6_C2_3', code: 'S6_C2_3_12', name: 'Selección inadecuada de contratistas', has_comment: true },

  { parent_code: 'S6_C2', code: 'S6_C2_4', name: 'Mantenimiento Inadecuado', has_comment: true },
    { parent_code: 'S6_C2_4', code: 'S6_C2_4_1', name: 'Preventivo Inadecuado', has_comment: true },
    { parent_code: 'S6_C2_4', code: 'S6_C2_4_2', name: 'Reparación Inadecuada', has_comment: true },

  { parent_code: 'S6_C2', code: 'S6_C2_5', name: 'Herramientas y Equipo Inadecuados', has_comment: true },
    { parent_code: 'S6_C2_5', code: 'S6_C2_5_1', name: 'Evaluación inadecuada de necesidades y riesgos', has_comment: true },
    { parent_code: 'S6_C2_5', code: 'S6_C2_5_2', name: 'Consideración inadecuada de factores humanos/ ergonomía', has_comment: true },
    { parent_code: 'S6_C2_5', code: 'S6_C2_5_3', name: 'Estándares o especificaciones inadecuadas', has_comment: true },
    { parent_code: 'S6_C2_5', code: 'S6_C2_5_4', name: 'Disponibilidad inadecuada', has_comment: true },
    { parent_code: 'S6_C2_5', code: 'S6_C2_5_5', name: 'Ajuste/ reparación / mantenimiento inadecuados', has_comment: true },
    { parent_code: 'S6_C2_5', code: 'S6_C2_5_6', name: 'Recuperación y rehabilitación inadecuadas', has_comment: true },
    { parent_code: 'S6_C2_5', code: 'S6_C2_5_7', name: 'Remoción y reemplazo inadecuado de artículos inapropiados', has_comment: true },

  { parent_code: 'S6_C2', code: 'S6_C2_6', name: 'Estándares de Trabajo Inadecuados', has_comment: true },
    { parent_code: 'S6_C2_6', code: 'S6_C2_6_1', name: 'Desarrollo inadecuado de estándares', has_comment: true },
    { parent_code: 'S6_C2_6', code: 'S6_C2_6_2', name: 'Comunicación inadecuada de estándares', has_comment: true },
    { parent_code: 'S6_C2_6', code: 'S6_C2_6_3', name: 'Mantenimiento inadecuado de Estándares', has_comment: true },
    { parent_code: 'S6_C2_6', code: 'S6_C2_6_4', name: 'Monitoreo Inadecuado del Cumplimiento', has_comment: true },

  { parent_code: 'S6_C2', code: 'S6_C2_7', name: 'Desgaste Excesivo', has_comment: true },
    { parent_code: 'S6_C2_7', code: 'S6_C2_7_1', name: 'Planificación inadecuada del uso', has_comment: true },
    { parent_code: 'S6_C2_7', code: 'S6_C2_7_2', name: 'Ampliación indebida de la vía útil', has_comment: true },
    { parent_code: 'S6_C2_7', code: 'S6_C2_7_3', name: 'Inspección y /o monitoreo inadecuados', has_comment: true },
    { parent_code: 'S6_C2_7', code: 'S6_C2_7_4', name: 'Carga o velocidad de uso incorrectas', has_comment: true },
    { parent_code: 'S6_C2_7', code: 'S6_C2_7_5', name: 'Mantenimiento inadecuado', has_comment: true },
    { parent_code: 'S6_C2_7', code: 'S6_C2_7_6', name: 'Uso por personal no calificado o no entrenado', has_comment: true },
    { parent_code: 'S6_C2_7', code: 'S6_C2_7_7', name: 'Uso para el propósito equivocado', has_comment: true },

  { parent_code: 'S6_C2', code: 'S6_C2_8', name: 'Abuso o Mal Uso', has_comment: true },
    { parent_code: 'S6_C2_8', code: 'S6_C2_8_1', name: 'Conducta impropia que es condonada', has_comment: true },
    { parent_code: 'S6_C2_8', code: 'S6_C2_8_2', name: 'Conducta impropia que no es condonada', has_comment: true },

  // PASO 7: NECESIDADES DE ACCIÓN DE CONTROL (NAC) = FALTA DE CONTROL
  {
    parent_code: null,
    code: 'STEP_7',
    name: 'Necesidades de Acción de Control (NAC) = Falta de Control',
    has_comment: false
  },
  
  { parent_code: 'STEP_7', code: 'S7_C1', name: 'LIDERAZGO Y ADMINISTRACIÓN', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_1', name: 'Política General', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_2', name: 'Coordinador del Programa', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_3', name: 'Participación de Gerencia Superior y Media', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_4', name: 'Estándares de Desempeño Gerencial', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_5', name: 'Participación de Gerencia', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_6', name: 'Presentación en Reuniones de Gerencia', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_7', name: 'Manual de Referencia de Gerencia', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_8', name: 'Realización de Auditorías de Gerencia', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_9', name: 'Responsabilidad individual de Seguridad y Salud / Control de Pérdidas en Descripciones de Puestos', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_10', name: 'Establecimiento de Objetivos Anuales de Seguridad y Salud/Control de Pérdidas', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_11', name: 'Comités Conjuntos de Seguridad y Salud y/o Delegados de Seguridad y Salud', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_12', name: 'Negativa a trabajar debido al Procedimiento de Peligros de Seguridad y Salud', has_comment: true },
    { parent_code: 'S7_C1', code: 'S7_C1_13', name: 'Biblioteca de Referencia', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C2', name: 'ENTRENAMIENTO DE GERENCIA', has_comment: true },
    { parent_code: 'S7_C2', code: 'S7_C2_1', name: 'Programa de Orientación/ Inducción de Gerencia', has_comment: true },
    { parent_code: 'S7_C2', code: 'S7_C2_2', name: 'Entrenamiento Formal Inicial del Personal de Gerencia Superior', has_comment: true },
    { parent_code: 'S7_C2', code: 'S7_C2_3', name: 'Revisión Formal y Entrenamiento Actualizado del Personal de Gerencia Superior', has_comment: true },
    { parent_code: 'S7_C2', code: 'S7_C2_4', name: 'Entrenamiento Inicial Formal para Personal de Gerencia Media y Supervisores', has_comment: true },
    { parent_code: 'S7_C2', code: 'S7_C2_5', name: 'Revisión Formal y Entrenamiento Actualizado del Personal de Gerencia Media y Supervisores', has_comment: true },
    { parent_code: 'S7_C2', code: 'S7_C2_6', name: 'Entrenamiento Formal del Coordinador del Programa', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C3', name: 'INSPECCIONES PLANIFICADAS', has_comment: true },
    { parent_code: 'S7_C3', code: 'S7_C3_1', name: 'Inspecciones Generales Planificadas', has_comment: true },
    { parent_code: 'S7_C3', code: 'S7_C3_2', name: 'Procedimientos de Seguimiento', has_comment: true },
    { parent_code: 'S7_C3', code: 'S7_C3_3', name: 'Análisis de Informe de Inspección', has_comment: true },
    { parent_code: 'S7_C3', code: 'S7_C3_4', name: 'Programa de Inspección de Piezas/Rubros Críticos', has_comment: true },
    { parent_code: 'S7_C3', code: 'S7_C3_5', name: 'Programa de Mantenimiento Preventivo', has_comment: true },
    { parent_code: 'S7_C3', code: 'S7_C3_6', name: 'Inspección Previa al uso de Equipo Móvil y de Manipulación de Materiales', has_comment: true },
    { parent_code: 'S7_C3', code: 'S7_C3_7', name: 'Sistema de Informe de Condiciones Alternas', has_comment: true },
    { parent_code: 'S7_C3', code: 'S7_C3_8', name: 'Mantenimiento del Informe de Inspección General Planificada', has_comment: true },
    { parent_code: 'S7_C3', code: 'S7_C3_9', name: 'Monitoreo Regular del Programa', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C4', name: 'ANÁLISIS Y PROCEDIMIENTOS DE TAREAS', has_comment: true },
    { parent_code: 'S7_C4', code: 'S7_C4_1', name: 'Directiva de Gerencia sobre la Importancia', has_comment: true },
    { parent_code: 'S7_C4', code: 'S7_C4_2', name: 'Inventario de Tareas Críticas', has_comment: true },
    { parent_code: 'S7_C4', code: 'S7_C4_3', name: 'Objetivos de Análisis de Tareas y Procedimientos de Tareas', has_comment: true },
    { parent_code: 'S7_C4', code: 'S7_C4_4', name: 'Análisis y Procedimientos de Tareas Efectuados para Tareas Críticas y Actualizados Periódicamente', has_comment: true },
    { parent_code: 'S7_C4', code: 'S7_C4_5', name: 'Peligros de Seguridad y Salud en los Análisis y Procedimientos de Tareas Críticas', has_comment: true },
    { parent_code: 'S7_C4', code: 'S7_C4_6', name: 'Monitoreo Regular del Programa', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C5', name: 'INVESTIGACIÓN DE ACCIDENTE / INCIDENTE', has_comment: true },
    { parent_code: 'S7_C5', code: 'S7_C5_1', name: 'Procedimiento de investigación de Accidente/Incidente', has_comment: true },
    { parent_code: 'S7_C5', code: 'S7_C5_2', name: 'Alcance e Investigaciones establecidos', has_comment: true },
    { parent_code: 'S7_C5', code: 'S7_C5_3', name: 'Seguimiento y Medidas de Corrección', has_comment: true },
    { parent_code: 'S7_C5', code: 'S7_C5_4', name: 'Utilización de Anuncio de Accidente Mayor', has_comment: true },
    { parent_code: 'S7_C5', code: 'S7_C5_5', name: 'Uso de Información de Alto Potencial de Incidente', has_comment: true },
    { parent_code: 'S7_C5', code: 'S7_C5_6', name: 'Participación de la Gerencia de Operaciones', has_comment: true },
    { parent_code: 'S7_C5', code: 'S7_C5_7', name: 'Informe e Investigación de Incidentes', has_comment: true },
    { parent_code: 'S7_C5', code: 'S7_C5_8', name: 'Mantenimiento de Informes de Accidente/Incidente', has_comment: true },
    { parent_code: 'S7_C5', code: 'S7_C5_9', name: 'Monitoreo Periódico del Programa', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C6', name: 'OBSERVACIÓN DE TAREAS', has_comment: true },
    { parent_code: 'S7_C6', code: 'S7_C6_1', name: 'Directiva de Gerencia sobre su importancia', has_comment: true },
    { parent_code: 'S7_C6', code: 'S7_C6_2', name: 'Programa Completo de Observación de Tareas', has_comment: true },
    { parent_code: 'S7_C6', code: 'S7_C6_3', name: 'Nivel de Observación Completa de Tareas', has_comment: true },
    { parent_code: 'S7_C6', code: 'S7_C6_4', name: 'Programa de Observación de Tareas Parciales', has_comment: true },
    { parent_code: 'S7_C6', code: 'S7_C6_5', name: 'Análisis de Informe de Observación de Tareas', has_comment: true },
    { parent_code: 'S7_C6', code: 'S7_C6_6', name: 'Monitoreo Periódico del Programa', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C7', name: 'PREPARACIÓN PARA EMERGENCIAS', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_1', name: 'Coordinador Designado', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_2', name: 'Plan de Emergencia por Escrito', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_3', name: 'Entrenamiento de Primeros Auxilios para Supervisor', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_4', name: 'Entrenamiento de Primeros Auxilios para el Personal (10%)', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_5', name: 'Iluminación y Energía de Emergencia Adecuadas', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_6', name: 'Controles Principales con Código de Color y Rotulados', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_7', name: 'Equipo de Protección y de Rescate', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_8', name: 'Entrenamiento y Ejercicios del Equipo de Emergencia', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_9', name: 'Asistentes de Primeros Auxilios Calificados', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_10', name: 'Ayuda Exterior y Auxilio Mutuo Organizados', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_11', name: 'Protección de Registros Vitales', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_12', name: 'Planificación para Etapa Posterior al Evento', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_13', name: 'Se provee Comunicación de Emergencia', has_comment: true },
    { parent_code: 'S7_C7', code: 'S7_C7_14', name: 'Comunicaciones de Seguridad Pública Planificadas', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C8', name: 'REGLAMENTOS DE LA COMPAÑÍA', has_comment: true },
    { parent_code: 'S7_C8', code: 'S7_C8_1', name: 'Reglamento General de Seguridad y Salud', has_comment: true },
    { parent_code: 'S7_C8', code: 'S7_C8_2', name: 'Reglamento de Trabajo Especializado', has_comment: true },
    { parent_code: 'S7_C8', code: 'S7_C8_3', name: 'Sistemas de Permiso de Trabajo y Procedimientos Especiales', has_comment: true },
    { parent_code: 'S7_C8', code: 'S7_C8_4', name: 'Programa de Educación y Revisión del Reglamento', has_comment: true },
    { parent_code: 'S7_C8', code: 'S7_C8_5', name: 'Esfuerzo de Cumplimiento del Reglamento', has_comment: true },
    { parent_code: 'S7_C8', code: 'S7_C8_6', name: 'Uso de Símbolos Educativos y Código de Colores', has_comment: true },
    { parent_code: 'S7_C8', code: 'S7_C8_7', name: 'Monitoreo Periódico del Programa', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C9', name: 'ANÁLISIS DE ACCIDENTE / INCIDENTE', has_comment: true },
    { parent_code: 'S7_C9', code: 'S7_C9_1', name: 'Cálculo y Uso de Estadísticas de Desempeño', has_comment: true },
    { parent_code: 'S7_C9', code: 'S7_C9_2', name: 'Análisis de Lesiones y Enfermedades Ocupacionales', has_comment: true },
    { parent_code: 'S7_C9', code: 'S7_C9_3', name: 'Identificación y Análisis de Daños a la Propiedad y Equipo', has_comment: true },
    { parent_code: 'S7_C9', code: 'S7_C9_4', name: 'Equipos de Proyecto para Solución de Problemas', has_comment: true },
    { parent_code: 'S7_C9', code: 'S7_C9_5', name: 'Análisis de Incidentes (Cuasi accidentes )', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C10', name: 'ENTRENAMIENTO DEL PERSONAL', has_comment: true },
    { parent_code: 'S7_C10', code: 'S7_C10_1', name: 'Análisis de Necesidades de Entrenamiento', has_comment: true },
    { parent_code: 'S7_C10', code: 'S7_C10_2', name: 'Programa de Entrenamiento del Personal', has_comment: true },
    { parent_code: 'S7_C10', code: 'S7_C10_3', name: 'Evaluación del Programa de Entrenamiento', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C11', name: 'EQUIPO DE PROTECCIÓN PERSONAL', has_comment: true },
    { parent_code: 'S7_C11', code: 'S7_C11_1', name: 'Estándares para Equipo de Protección Personal', has_comment: true },
    { parent_code: 'S7_C11', code: 'S7_C11_2', name: 'Registros de Equipo de Protección Personal', has_comment: true },
    { parent_code: 'S7_C11', code: 'S7_C11_3', name: 'Cumplimiento de Estándares', has_comment: true },
    { parent_code: 'S7_C11', code: 'S7_C11_4', name: 'Monitoreo Periódico del Programa', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C12', name: 'CONTROL DE LA SALUD', has_comment: true },
    { parent_code: 'S7_C12', code: 'S7_C12_1', name: 'Identificación de Peligros para la Salud', has_comment: true },
    { parent_code: 'S7_C12', code: 'S7_C12_2', name: 'Control de Peligros de la Salud', has_comment: true },
    { parent_code: 'S7_C12', code: 'S7_C12_3', name: 'Información / Entrenamiento / Educación', has_comment: true },
    { parent_code: 'S7_C12', code: 'S7_C12_4', name: 'Monitoreo de Higiene Industrial', has_comment: true },
    { parent_code: 'S7_C12', code: 'S7_C12_5', name: 'Programa de Mantenimiento de la Salud', has_comment: true },
    { parent_code: 'S7_C12', code: 'S7_C12_6', name: 'Asistencia Médica Profesional', has_comment: true },
    { parent_code: 'S7_C12', code: 'S7_C12_7', name: 'Comunicaciones de Salud a los Trabajadores', has_comment: true },
    { parent_code: 'S7_C12', code: 'S7_C12_8', name: 'Mantenimiento de Registros', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C13', name: 'SISTEMA DE EVALUACIÓN DEL PROGRAMA', has_comment: true },
    { parent_code: 'S7_C13', code: 'S7_C13_1', name: 'Auditoría Completa del Cumplimiento de Estándares del Programa', has_comment: true },
    { parent_code: 'S7_C13', code: 'S7_C13_2', name: 'Auditoría Completa del Cumplimiento de Estándares de Condiciones Físicas', has_comment: true },
    { parent_code: 'S7_C13', code: 'S7_C13_3', name: 'Auditoría Completa del Cumplimiento de Estándares de Prevención y Control de incendios', has_comment: true },
    { parent_code: 'S7_C13', code: 'S7_C13_4', name: 'Auditoría Completa del Cumplimiento de Estándares de Salud Ocupacional', has_comment: true },
    { parent_code: 'S7_C13', code: 'S7_C13_5', name: 'Registro de Sistemas de Evaluación de Programa', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C14', name: 'CONTROLES DE INGENIERÍA', has_comment: true },
    { parent_code: 'S7_C14', code: 'S7_C14_1', name: 'Consideraciones de Seguridad y Salud de ingeniería de Diseño en la Concepción y el Diseño', has_comment: true },
    { parent_code: 'S7_C14', code: 'S7_C14_2', name: 'Consideraciones de Seguridad y Salud de Ingeniería de Proceso en la Concepción y el Diseño', has_comment: true },
    { parent_code: 'S7_C14', code: 'S7_C14_3', name: 'Monitoreo Periódico del Programa', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C15', name: 'COMUNICACIONES AL PERSONAL', has_comment: true },
    { parent_code: 'S7_C15', code: 'S7_C15_1', name: 'Entrenamiento en Técnicas de Comunicación al Personal', has_comment: true },
    { parent_code: 'S7_C15', code: 'S7_C15_2', name: 'Orientación / Inducción de Trabajo para Personal Nuevo/Transferido', has_comment: true },
    { parent_code: 'S7_C15', code: 'S7_C15_3', name: 'Entrenamiento y Uso Adecuado de Instrucción de Tarea', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C16', name: 'REUNIONES GRUPALES', has_comment: true },
    { parent_code: 'S7_C16', code: 'S7_C16_1', name: 'Realización de Reuniones Grupales', has_comment: true },
    { parent_code: 'S7_C16', code: 'S7_C16_2', name: 'Registro del Asunto, Ayudas Visuales, Asistencia y Problemas Tratados', has_comment: true },
    { parent_code: 'S7_C16', code: 'S7_C16_3', name: 'Participación de la Gerencia Superior y Media', has_comment: true },
    { parent_code: 'S7_C16', code: 'S7_C16_4', name: 'Monitoreo Periódico del Programa', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C17', name: 'PROMOCIÓN GENERAL', has_comment: true },
    { parent_code: 'S7_C17', code: 'S7_C17_1', name: 'Programa de Periódico Mural de Seguridad', has_comment: true },
    { parent_code: 'S7_C17', code: 'S7_C17_2', name: 'Uso de Estadísticas y Hechos del Programa', has_comment: true },
    { parent_code: 'S7_C17', code: 'S7_C17_3', name: 'Promoción de Temas Críticos', has_comment: true },
    { parent_code: 'S7_C17', code: 'S7_C17_4', name: 'Uso de Premios o Reconocimiento', has_comment: true },
    { parent_code: 'S7_C17', code: 'S7_C17_5', name: 'Publicaciones de Información el Programa', has_comment: true },
    { parent_code: 'S7_C17', code: 'S7_C17_6', name: 'Promoción del Desempeño en Grupo', has_comment: true },
    { parent_code: 'S7_C17', code: 'S7_C17_7', name: 'Promoción del Orden y la Limpieza', has_comment: true },
    { parent_code: 'S7_C17', code: 'S7_C17_8', name: 'Registros de Actividades de Promoción del Programa', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C18', name: 'CONTRATACIÓN Y COLOCACIÓN DE PERSONAL', has_comment: true },
    { parent_code: 'S7_C18', code: 'S7_C18_1', name: 'Análisis de la Capacidad Física', has_comment: true },
    { parent_code: 'S7_C18', code: 'S7_C18_2', name: 'Examen Médico Pre-Ocupacional', has_comment: true },
    { parent_code: 'S7_C18', code: 'S7_C18_3', name: 'Programa de Orientación / Inducción General', has_comment: true },
    { parent_code: 'S7_C18', code: 'S7_C18_4', name: 'Verificación de Calificaciones Previa a la Contratación y Colocación', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C19', name: 'CONTROLES DE COMPRA', has_comment: true },
    { parent_code: 'S7_C19', code: 'S7_C19_1', name: 'Compras Incluyen la Seguridad y Salud en las Especificaciones y Logística', has_comment: true },
    { parent_code: 'S7_C19', code: 'S7_C19_2', name: 'Selección y Control de Contratistas', has_comment: true },

  { parent_code: 'STEP_7', code: 'S7_C20', name: 'SEGURIDAD FUERA DEL TRABAJO', has_comment: true },
    { parent_code: 'S7_C20', code: 'S7_C20_1', name: 'Establecimiento de Sistema de Informes y Análisis de Estadísticas', has_comment: true },
    { parent_code: 'S7_C20', code: 'S7_C20_2', name: 'Comunicación de información de Seguridad Fuera del Trabajo', has_comment: true },
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