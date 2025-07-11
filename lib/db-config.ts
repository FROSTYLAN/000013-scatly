import { createProjectsTable } from './db';

export async function initDatabase() {
  try {
    await createProjectsTable();
    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}