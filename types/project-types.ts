export interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  nombre: string;
  descripcion: string;
  fecha: string;
}

export interface UpdateProjectInput extends CreateProjectInput {}