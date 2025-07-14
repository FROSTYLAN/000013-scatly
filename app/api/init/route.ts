import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { DEFAULT_FIELDS } from '@/lib/default-fields';

async function resetDatabase() {
  try {
    console.log('🧹 Limpiando base de datos...');
    
    // Eliminar tablas si existen
    await db.query('DROP TABLE IF EXISTS project_fields CASCADE');
    await db.query('DROP TABLE IF EXISTS fields CASCADE');
    await db.query('DROP TABLE IF EXISTS projects CASCADE');
    await db.query('DROP TABLE IF EXISTS users CASCADE');
    
    // Eliminar función de actualización si existe
    await db.query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE');
    
    // Eliminar triggers si existen
    await db.query('DROP TRIGGER IF EXISTS update_project_fields_updated_at ON project_fields CASCADE');
    await db.query('DROP TRIGGER IF EXISTS update_fields_updated_at ON fields CASCADE');
    await db.query('DROP TRIGGER IF EXISTS update_projects_updated_at ON projects CASCADE');
    await db.query('DROP TRIGGER IF EXISTS update_users_updated_at ON users CASCADE');
    
    console.log('✅ Base de datos limpiada exitosamente');
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
    throw error;
  }
}

async function createProjectsTable() {
  try {
    // Crear función para actualizar updated_at
    await db.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Crear tabla projects
    await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        fecha DATE,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Crear trigger para updated_at
    await db.query(`
      DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
      CREATE TRIGGER update_projects_updated_at
        BEFORE UPDATE ON projects
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Tabla projects creada exitosamente');
  } catch (error) {
    console.error('❌ Error al crear la tabla projects:', error);
    throw error;
  }
}

async function insertTestData() {
  try {
    console.log('📊 Insertando datos de prueba...');
    
    const testProjects = [
      {
        nombre: 'Proyecto Alpha',
        descripcion: 'Sistema de gestión empresarial con dashboard interactivo',
        fecha: '2024-01-15',
        user_id: 1 // admin
      },
      {
        nombre: 'Proyecto Beta',
        descripcion: 'Aplicación móvil para seguimiento de tareas',
        fecha: '2024-02-20',
        user_id: 2 // usuario
      },
      {
        nombre: 'Proyecto Gamma',
        descripcion: 'Plataforma de e-commerce con integración de pagos',
        fecha: '2024-03-10',
        user_id: 1 // admin
      },
      {
        nombre: 'Proyecto Delta',
        descripcion: 'API REST para microservicios',
        fecha: '2024-04-05',
        user_id: 2 // usuario
      },
      {
        nombre: 'Proyecto Epsilon',
        descripcion: 'Sistema de análisis de datos en tiempo real',
        fecha: '2024-05-12',
        user_id: 1 // admin
      }
    ];

    for (const project of testProjects) {
      await db.query(
        'INSERT INTO projects (nombre, descripcion, fecha, user_id) VALUES ($1, $2, $3, $4)',
        [project.nombre, project.descripcion, project.fecha, project.user_id]
      );
    }
    
    console.log(`✅ ${testProjects.length} proyectos de prueba insertados`);
    return testProjects.length;
  } catch (error) {
    console.error('❌ Error insertando datos de prueba:', error);
    throw error;
  }
}

async function createUsersTable() {
  try {
    // Crear función para actualizar automáticamente updated_at si no existe
    await db.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Crear tabla de usuarios
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Crear trigger para actualizar automáticamente updated_at
    await db.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Tabla users creada exitosamente');
  } catch (error) {
    console.error('❌ Error al crear la tabla users:', error);
    throw error;
  }
}

async function insertTestUsers() {
  console.log('👥 Insertando usuarios de prueba...');
  
  const testUsers = [
    {
      username: 'admin',
      email: 'admin@scatly.com',
      password_hash: '$2b$10$rQJ8kHqBqzKzQzKzQzKzQOzKzQzKzQzKzQzKzQzKzQzKzQzKzQzKz', // admin123
      role: 'admin'
    },
    {
      username: 'usuario',
      email: 'usuario@scatly.com', 
      password_hash: '$2b$10$rQJ8kHqBqzKzQzKzQzKzQOzKzQzKzQzKzQzKzQzKzQzKzQzKzQzKz', // usuario123
      role: 'user'
    }
  ];

  let insertedCount = 0;
  
  for (const user of testUsers) {
    try {
      await db.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        [user.username, user.email, user.password_hash, user.role]
      );
      insertedCount++;
      console.log(`✅ Usuario insertado: ${user.username}`);
    } catch (error) {
      console.error(`❌ Error insertando usuario ${user.username}:`, error);
    }
  }
  
  console.log(`📊 Total usuarios insertados: ${insertedCount}`);
  return insertedCount;
}

async function createFieldsTable() {
  console.log('🏗️ Creando tabla fields...');
  
  const createFieldsTableSQL = `
    CREATE TABLE IF NOT EXISTS fields (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(50) NOT NULL UNIQUE,
      parent_code VARCHAR(50) REFERENCES fields(code) ON DELETE CASCADE,
      has_comment BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  
  const createFieldsUpdateTriggerSQL = `
    DROP TRIGGER IF EXISTS update_fields_updated_at ON fields;
    CREATE TRIGGER update_fields_updated_at
      BEFORE UPDATE ON fields
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `;
  
  try {
    await db.query(createFieldsTableSQL);
    await db.query(createFieldsUpdateTriggerSQL);
    console.log('✅ Tabla fields creada exitosamente');
  } catch (error) {
    console.error('❌ Error creando tabla fields:', error);
    throw error;
  }
}

async function createProjectFieldsTable() {
  console.log('🏗️ Creando tabla project_fields...');
  
  const createProjectFieldsTableSQL = `
    CREATE TABLE IF NOT EXISTS project_fields (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL,
      field_id INTEGER NOT NULL,
      comment TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
      UNIQUE(project_id, field_id)
    )
  `;
  
  const createProjectFieldsUpdateTriggerSQL = `
    DROP TRIGGER IF EXISTS update_project_fields_updated_at ON project_fields;
    CREATE TRIGGER update_project_fields_updated_at
      BEFORE UPDATE ON project_fields
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `;
  
  try {
    await db.query(createProjectFieldsTableSQL);
    await db.query(createProjectFieldsUpdateTriggerSQL);
    console.log('✅ Tabla project_fields creada exitosamente');
  } catch (error) {
    console.error('❌ Error creando tabla project_fields:', error);
    throw error;
  }
}

async function insertTestFields() {
  console.log('🏷️ Insertando campos por defecto...');
  
  let insertedCount = 0;
  const insertedCodes = new Set<string>(); // Códigos ya insertados
  
  // Primero insertar campos raíz (sin parent_code)
  const rootFields = DEFAULT_FIELDS.filter(field => field.parent_code === null);
  for (const field of rootFields) {
    try {
      const result = await db.query(
        'INSERT INTO fields (name, code, parent_code, has_comment) VALUES ($1, $2, $3, $4) RETURNING id',
        [field.name, field.code, field.parent_code, field.has_comment]
      );
      const generatedId = result.rows[0].id;
      insertedCodes.add(field.code);
      insertedCount++;
      console.log(`✅ Campo raíz insertado: ${field.name} (${field.code}) - ID: ${generatedId}`);
    } catch (error) {
      console.error(`❌ Error insertando campo raíz ${field.name}:`, error);
    }
  }
  
  // Luego insertar campos hijos usando parent_code
  const childFields = DEFAULT_FIELDS.filter(field => field.parent_code !== null);
  
  // Ordenar por niveles de jerarquía
  let remainingFields = [...childFields];
  let maxIterations = 10; // Prevenir bucles infinitos
  
  while (remainingFields.length > 0 && maxIterations > 0) {
    const fieldsToInsert = [];
    const fieldsToDefer = [];
    
    for (const field of remainingFields) {
      // Verificar si el campo padre ya fue insertado
      if (field.parent_code && insertedCodes.has(field.parent_code)) {
        fieldsToInsert.push(field);
      } else {
        fieldsToDefer.push(field);
      }
    }
    
    // Insertar campos que tienen su padre disponible
    for (const field of fieldsToInsert) {
      try {
        const result = await db.query(
          'INSERT INTO fields (name, code, parent_code, has_comment) VALUES ($1, $2, $3, $4) RETURNING id',
          [field.name, field.code, field.parent_code, field.has_comment]
        );
        const generatedId = result.rows[0].id;
        insertedCodes.add(field.code);
        insertedCount++;
        console.log(`✅ Campo hijo insertado: ${field.name} (${field.code}) - ID: ${generatedId}, Padre: ${field.parent_code}`);
      } catch (error) {
        console.error(`❌ Error insertando campo hijo ${field.name}:`, error);
      }
    }
    
    remainingFields = fieldsToDefer;
    maxIterations--;
  }
  
  if (remainingFields.length > 0) {
    console.warn(`⚠️ ${remainingFields.length} campos no pudieron ser insertados por dependencias circulares`);
  }
  
  console.log(`📊 Total campos insertados: ${insertedCount}`);
  return insertedCount;
}

async function insertTestProjectFields() {
  console.log('🔗 Insertando relaciones proyecto-campo de prueba...');
  
  const testProjectFields = [
    { project_id: 1, field_id: 1, comment: 'Revisión completa de seguridad industrial' },
    { project_id: 1, field_id: 2, comment: null },
    { project_id: 1, field_id: 3, comment: 'Verificar estado del casco' },
    { project_id: 2, field_id: 5, comment: 'Evaluación de impacto ambiental' },
    { project_id: 2, field_id: 6, comment: null },
    { project_id: 3, field_id: 8, comment: null },
    { project_id: 3, field_id: 9, comment: 'Control de calidad en proceso' },
    { project_id: 4, field_id: 1, comment: 'Seguridad en construcción' },
    { project_id: 4, field_id: 7, comment: 'Manejo de residuos de construcción' },
    { project_id: 5, field_id: 10, comment: 'Inspección final de calidad' }
  ];

  let insertedCount = 0;
  
  for (const projectField of testProjectFields) {
    try {
      await db.query(
        'INSERT INTO project_fields (project_id, field_id, comment) VALUES ($1, $2, $3)',
        [projectField.project_id, projectField.field_id, projectField.comment]
      );
      insertedCount++;
      console.log(`✅ Relación proyecto-campo insertada: Proyecto ${projectField.project_id} - Campo ${projectField.field_id}`);
    } catch (error) {
      console.error(`❌ Error insertando relación proyecto ${projectField.project_id} - campo ${projectField.field_id}:`, error);
    }
  }
  
  console.log(`📊 Total relaciones proyecto-campo insertadas: ${insertedCount}`);
  return insertedCount;
}

export async function GET() {
  console.log('🔄 Iniciando reinicio completo de la base de datos...');
  
  try {
    // Paso 1: Limpiar base de datos
    await resetDatabase();
    
    // Paso 2: Crear tablas (en orden de dependencias)
    console.log('🔧 Creando tablas...');
    await createUsersTable();
    await createProjectsTable();
    await createFieldsTable();
    await createProjectFieldsTable();
    
    // Paso 3: Insertar datos de prueba (en orden de dependencias)
    const insertedUsersCount = await insertTestUsers();
    const insertedProjectsCount = await insertTestData();
    const insertedFieldsCount = await insertTestFields();
    const insertedProjectFieldsCount = await insertTestProjectFields();
    
    console.log('🎉 Base de datos reiniciada exitosamente');
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos reiniciada y configurada correctamente',
      actions: [
        'Tablas eliminadas',
        'Tablas creadas con triggers',
        `${insertedUsersCount} usuarios de prueba insertados`,
        `${insertedProjectsCount} proyectos de prueba insertados`,
        `${insertedFieldsCount} campos de prueba insertados`,
        `${insertedProjectFieldsCount} relaciones proyecto-campo insertadas`
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error en reinicio de base de datos:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al reiniciar la base de datos',
      details: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}