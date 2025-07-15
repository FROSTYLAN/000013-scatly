const fs = require('fs');
const path = require('path');

// Leer el archivo
const filePath = '/Users/charlescastillo/WebstormProjects/scatly/lib/default-fields.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Patrón para encontrar campos con sub_elements
const pattern = /{ parent_code: '([^']+)', code: '([^']+)', name: '([^']+)', has_comment: true, sub_elements: \[\{ code: 'P', name: 'P' \}, \{ code: 'E', name: 'E' \}, \{ code: 'C', name: 'C' \}\] },/g;

// Reemplazar cada coincidencia
content = content.replace(pattern, (match, parentCode, code, name) => {
  return `{ parent_code: '${parentCode}', code: '${code}', name: '${name}', has_comment: true },
      { parent_code: '${code}', code: '${code}_1', name: 'P', has_comment: false },
      { parent_code: '${code}', code: '${code}_2', name: 'E', has_comment: false },
      { parent_code: '${code}', code: '${code}_3', name: 'C', has_comment: false },`;
});

// Escribir el archivo modificado
fs.writeFileSync(filePath, content, 'utf8');
console.log('Archivo corregido exitosamente');