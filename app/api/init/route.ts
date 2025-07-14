import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

async function resetDatabase() {
  try {
    console.log('🧹 Limpiando base de datos...');
    
    // Eliminar tablas si existen
    await db.query('DROP TABLE IF EXISTS projects CASCADE');
    await db.query('DROP TABLE IF EXISTS users CASCADE');
    
    // Eliminar función de actualización si existe
    await db.query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE');
    
    // Eliminar triggers si existen
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        fecha: '2024-01-15'
      },
      {
        nombre: 'Proyecto Beta',
        descripcion: 'Aplicación móvil para seguimiento de tareas',
        fecha: '2024-02-20'
      },
      {
        nombre: 'Proyecto Gamma',
        descripcion: 'Plataforma de e-commerce con integración de pagos',
        fecha: '2024-03-10'
      },
      {
        nombre: 'Proyecto Delta',
        descripcion: 'API REST para microservicios',
        fecha: '2024-04-05'
      },
      {
        nombre: 'Proyecto Epsilon',
        descripcion: 'Sistema de análisis de datos en tiempo real',
        fecha: '2024-05-12'
      }
    ];

    for (const project of testProjects) {
      await db.query(
        'INSERT INTO projects (nombre, descripcion, fecha) VALUES ($1, $2, $3)',
        [project.nombre, project.descripcion, project.fecha]
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
      CREATE TABLE users (
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
  try {
    console.log('👤 Insertando usuarios de prueba...');
    
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    
    const testUsers = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'usuario',
        email: 'usuario@example.com',
        password: 'usuario123',
        role: 'user'
      }
    ];

    for (const user of testUsers) {
      const passwordHash = await bcrypt.hash(user.password, saltRounds);
      
      await db.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        [user.username, user.email, passwordHash, user.role]
      );
    }
    
    console.log(`✅ ${testUsers.length} usuarios de prueba insertados`);
    return testUsers.length;
  } catch (error) {
    console.error('❌ Error insertando usuarios de prueba:', error);
    throw error;
  }
}

export async function GET() {
  console.log('🔄 Iniciando reinicio completo de la base de datos...');
  
  try {
    // Paso 1: Limpiar base de datos
    await resetDatabase();
    
    // Paso 2: Crear tablas
    console.log('🔧 Creando tablas...');
    await createProjectsTable();
    await createUsersTable();
    
    // Paso 3: Insertar datos de prueba
    const insertedProjectsCount = await insertTestData();
    const insertedUsersCount = await insertTestUsers();
    
    console.log('🎉 Base de datos reiniciada exitosamente');
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos reiniciada y configurada correctamente',
      actions: [
        'Tablas eliminadas',
        'Tablas creadas con triggers',
        `${insertedProjectsCount} proyectos de prueba insertados`,
        `${insertedUsersCount} usuarios de prueba insertados`
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