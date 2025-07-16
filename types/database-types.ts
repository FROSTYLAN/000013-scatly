export interface Project {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  projectFields: (ProjectField & {
      field_name: string;
      field_code: string;
      field_parent_code: string | null;
      field_has_comment: boolean;
    })[];
}

export interface CreateProjectInput {
  nombre: string;
  descripcion: string;
  fecha: string;
  user_id: number;
}

export interface UpdateProjectInput {
  nombre: string;
  descripcion: string;
  fecha: string;
}

export interface Field {
  id: number;
  name: string;
  code: string;
  parent_code: string | null;
  has_comment: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateFieldInput {
  name: string;
  code: string;
  parent_code: string | null;
  has_comment: boolean;
}

export interface UpdateFieldInput {
  name?: string;
  code?: string;
  parent_code?: string | null;
  has_comment?: boolean;
}

export interface ProjectField {
  id: number;
  project_id: number;
  field_id: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectFieldInput {
  project_id: number;
  field_id: number;
  comment?: string | null;
}

export interface UpdateProjectFieldInput {
  comment?: string | null;
}