import { sql } from '@vercel/postgres';
import { Project, CreateProjectInput, UpdateProjectInput } from '@/types/project-types';

export async function getAllProjects(): Promise<Project[]> {
  const { rows } = await sql<Project>`
    SELECT * FROM projects 
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function getProjectById(id: number): Promise<Project | null> {
  const { rows } = await sql<Project>`
    SELECT * FROM projects 
    WHERE id = ${id}
  `;
  return rows[0] || null;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const { nombre, descripcion, fecha } = input;
  const { rows } = await sql<Project>`
    INSERT INTO projects (nombre, descripcion, fecha)
    VALUES (${nombre}, ${descripcion}, ${fecha})
    RETURNING *
  `;
  return rows[0];
}

export async function updateProject(id: number, input: UpdateProjectInput): Promise<Project | null> {
  const { nombre, descripcion, fecha } = input;
  const { rows } = await sql<Project>`
    UPDATE projects 
    SET nombre = ${nombre}, 
        descripcion = ${descripcion}, 
        fecha = ${fecha}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] || null;
}

export async function deleteProject(id: number): Promise<boolean> {
  const { rowCount } = await sql`
    DELETE FROM projects 
    WHERE id = ${id}
  `;
  return rowCount > 0;
}