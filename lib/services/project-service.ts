import { db } from '@/lib/database';
import { Project, CreateProjectInput, UpdateProjectInput } from '@/types/database-types';

export async function getAllProjects(): Promise<Project[]> {
  try {
    const result = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    return result.rows as Project[];
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
}

export async function getProjectById(id: number): Promise<Project | null> {
  try {
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows.length > 0 ? result.rows[0] as Project : null;
  } catch (error) {
    console.error('Error al obtener proyecto por ID:', error);
    throw error;
  }
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  try {
    const { nombre, descripcion, fecha } = input;
    const result = await db.query(
      'INSERT INTO projects (nombre, descripcion, fecha) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, fecha]
    );
    return result.rows[0] as Project;
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    throw error;
  }
}

export async function updateProject(id: number, input: UpdateProjectInput): Promise<Project | null> {
  try {
    const { nombre, descripcion, fecha } = input;
    const result = await db.query(
      'UPDATE projects SET nombre = $1, descripcion = $2, fecha = $3 WHERE id = $4 RETURNING *',
      [nombre, descripcion, fecha, id]
    );
    return result.rows.length > 0 ? result.rows[0] as Project : null;
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    throw error;
  }
}

export async function deleteProject(id: number): Promise<boolean> {
  try {
    const result = await db.query(
      'DELETE FROM projects WHERE id = $1',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    throw error;
  }
}