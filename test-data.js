// Datos de prueba para cargar en localStorage
const testData = {
  "step1Fields": [
    {
      "fieldId": 9,
      "comment": "adssfd"
    },
    {
      "fieldId": 10,
      "comment": "sadffsa"
    },
    {
      "fieldId": 11,
      "comment": "2025-07-09"
    }
  ],
  "step2Fields": [
    {
      "fieldId": 12,
      "comment": "Charles Duck"
    },
    {
      "fieldId": 13,
      "comment": "asfd"
    },
    {
      "fieldId": 14,
      "comment": "75867760"
    },
    {
      "fieldId": 15,
      "comment": "Jefe de proyecto"
    },
    {
      "fieldId": 16,
      "comment": "Diego"
    },
    {
      "fieldId": 17,
      "comment": "Soles"
    },
    {
      "fieldId": 18,
      "comment": "22"
    },
    {
      "fieldId": 19,
      "comment": "12345678"
    },
    {
      "fieldId": 20,
      "comment": "Minero"
    },
    {
      "fieldId": 21,
      "comment": "Minera Anaconda"
    },
    {
      "fieldId": 22,
      "comment": "IDK"
    }
  ],
  "step3Fields": [
    {
      "fieldId": 60,
      "comment": "AAA"
    },
    {
      "fieldId": 62,
      "comment": "VVV"
    },
    {
      "fieldId": 66,
      "comment": "DDD"
    }
  ],
  "step4Fields": [
    {
      "fieldId": 27,
      "comment": "ADSASS"
    },
    {
      "fieldId": 28,
      "comment": "DSASD"
    }
  ],
  "step5Fields": [
    {
      "fieldId": 68,
      "comment": "CADS"
    },
    {
      "fieldId": 237,
      "comment": "AACD"
    }
  ],
  "step6Fields": [
    {
      "fieldId": 101,
      "comment": "zxcz"
    },
    {
      "fieldId": 298,
      "comment": "asdxz"
    }
  ],
  "step7Fields": [
    {
      "fieldId": 413,
      "comment": "avds"
    },
    {
      "fieldId": 414,
      "comment": "vxzn"
    }
  ]
};

// Función para cargar los datos de prueba en localStorage
function loadTestData() {
  localStorage.setItem('empty_project', JSON.stringify(testData));
  console.log('Datos de prueba cargados en localStorage');
  console.log('Recarga la página para ver los datos');
}

// Función para limpiar localStorage
function clearTestData() {
  localStorage.removeItem('empty_project');
  console.log('Datos de prueba eliminados de localStorage');
}

// Exportar para uso en consola del navegador
if (typeof window !== 'undefined') {
  window.loadTestData = loadTestData;
  window.clearTestData = clearTestData;
  window.testData = testData;
}

console.log('Funciones disponibles:');
console.log('- loadTestData(): Cargar datos de prueba');
console.log('- clearTestData(): Limpiar datos de prueba');
console.log('- testData: Ver los datos de prueba');