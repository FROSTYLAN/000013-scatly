import { db } from '@/lib/database';
import { ProjectField, CreateProjectFieldInput, UpdateProjectFieldInput } from '@/types/database-types';

export async function getProjectFieldsByProjectId(projectId: number, parentCode?: string | null): Promise<ProjectField[]> {
  try {
    console.log(`📋 Obteniendo campos del proyecto ${projectId} con parent_code: ${parentCode}...`);
    
    let query = `
      SELECT pf.*, f.name as field_name, f.code as field_code, f.parent_code as field_parent_code, f.has_comment as field_has_comment
      FROM project_fields pf
      JOIN fields f ON pf.field_id = f.id
      WHERE pf.project_id = $1`;
    
    const params: any[] = [projectId];
    
    if (parentCode === null) {
      query += ` AND f.parent_code IS NULL`;
    } else if (parentCode !== undefined) {
      query += ` AND f.parent_code = $2`;
      params.push(parentCode);
    }
    
    query += ` ORDER BY f.name`;
    
    const result = await db.query(query, params);
    console.log(`✅ ${result.rows.length} campos obtenidos para el proyecto ${projectId}`);
    return result.rows;
  } catch (error) {
    console.error(`❌ Error obteniendo campos del proyecto ${projectId}:`, error);
    throw new Error('Error al obtener los campos del proyecto');
  }
}

export async function getProjectFieldsByFieldId(fieldId: number): Promise<ProjectField[]> {
  try {
    console.log(`📋 Obteniendo proyectos que usan el campo ${fieldId}...`);
    const result = await db.query(
      `SELECT pf.*, p.nombre as project_name
       FROM project_fields pf
       JOIN projects p ON pf.project_id = p.id
       WHERE pf.field_id = $1
       ORDER BY p.nombre`,
      [fieldId]
    );
    console.log(`✅ ${result.rows.length} proyectos obtenidos para el campo ${fieldId}`);
    return result.rows;
  } catch (error) {
    console.error(`❌ Error obteniendo proyectos del campo ${fieldId}:`, error);
    throw new Error('Error al obtener los proyectos del campo');
  }
}

export async function getProjectFieldByIds(projectId: number, fieldId: number): Promise<ProjectField | null> {
  try {
    console.log(`🔍 Buscando relación proyecto ${projectId} - campo ${fieldId}...`);
    const result = await db.query(
      'SELECT * FROM project_fields WHERE project_id = $1 AND field_id = $2',
      [projectId, fieldId]
    );
    
    if (result.rows.length === 0) {
      console.log(`❌ Relación proyecto ${projectId} - campo ${fieldId} no encontrada`);
      return null;
    }
    
    console.log(`✅ Relación encontrada`);
    return result.rows[0];
  } catch (error) {
    console.error(`❌ Error buscando relación proyecto ${projectId} - campo ${fieldId}:`, error);
    throw new Error('Error al buscar la relación proyecto-campo');
  }
}

export async function createProjectField(projectFieldData: CreateProjectFieldInput): Promise<ProjectField> {
  try {
    console.log('➕ Creando nueva relación proyecto-campo:', projectFieldData);
    
    const result = await db.query(
      'INSERT INTO project_fields (project_id, field_id, comment) VALUES ($1, $2, $3) RETURNING *',
      [projectFieldData.project_id, projectFieldData.field_id, projectFieldData.comment || null]
    );
    
    console.log(`✅ Relación proyecto-campo creada exitosamente`);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error creando relación proyecto-campo:', error);
    if (error instanceof Error && error.message.includes('unique')) {
      throw new Error('Esta relación proyecto-campo ya existe');
    }
    throw new Error('Error al crear la relación proyecto-campo');
  }
}

export async function updateProjectField(
  projectId: number, 
  fieldId: number, 
  projectFieldData: UpdateProjectFieldInput
): Promise<ProjectField | null> {
  try {
    console.log(`✏️ Actualizando relación proyecto ${projectId} - campo ${fieldId}:`, projectFieldData);
    
    const result = await db.query(
      'UPDATE project_fields SET comment = $1 WHERE project_id = $2 AND field_id = $3 RETURNING *',
      [projectFieldData.comment || null, projectId, fieldId]
    );
    
    if (result.rows.length === 0) {
      console.log(`❌ Relación proyecto ${projectId} - campo ${fieldId} no encontrada para actualizar`);
      return null;
    }
    
    console.log(`✅ Relación proyecto-campo actualizada exitosamente`);
    return result.rows[0];
  } catch (error) {
    console.error(`❌ Error actualizando relación proyecto ${projectId} - campo ${fieldId}:`, error);
    throw new Error('Error al actualizar la relación proyecto-campo');
  }
}

export async function deleteProjectField(projectId: number, fieldId: number): Promise<boolean> {
  try {
    console.log(`🗑️ Eliminando relación proyecto ${projectId} - campo ${fieldId}...`);
    
    const result = await db.query(
      'DELETE FROM project_fields WHERE project_id = $1 AND field_id = $2',
      [projectId, fieldId]
    );
    
    if (result.rowCount === 0) {
      console.log(`❌ Relación proyecto ${projectId} - campo ${fieldId} no encontrada para eliminar`);
      return false;
    }
    
    console.log(`✅ Relación proyecto-campo eliminada exitosamente`);
    return true;
  } catch (error) {
    console.error(`❌ Error eliminando relación proyecto ${projectId} - campo ${fieldId}:`, error);
    throw new Error('Error al eliminar la relación proyecto-campo');
  }
}

export async function deleteAllProjectFields(projectId: number): Promise<number> {
  try {
    console.log(`🗑️ Eliminando todos los campos del proyecto ${projectId}...`);
    
    const result = await db.query(
      'DELETE FROM project_fields WHERE project_id = $1',
      [projectId]
    );
    
    console.log(`✅ ${result.rowCount} relaciones proyecto-campo eliminadas`);
    return result.rowCount || 0;
  } catch (error) {
    console.error(`❌ Error eliminando campos del proyecto ${projectId}:`, error);
    throw new Error('Error al eliminar los campos del proyecto');
  }
}

export async function getProjectFieldsByUserAndProjectId(userId: number, projectId: number, parentCode?: string | null): Promise<ProjectField[]> {
  try {
    console.log(`📋 Obteniendo campos del proyecto ${projectId} para el usuario ${userId} con parent_code: ${parentCode}...`);
    
    let query = `
      SELECT pf.*, f.name as field_name, f.code as field_code, f.parent_code as field_parent_code, f.has_comment as field_has_comment
      FROM project_fields pf
      JOIN fields f ON pf.field_id = f.id
      JOIN projects p ON pf.project_id = p.id
      WHERE pf.project_id = $1 AND p.user_id = $2`;
    
    const params: any[] = [projectId, userId];
    
    if (parentCode === null) {
      query += ` AND f.parent_code IS NULL`;
    } else if (parentCode !== undefined) {
      query += ` AND f.parent_code = $3`;
      params.push(parentCode);
    }
    
    query += ` ORDER BY f.name`;
    
    const result = await db.query(query, params);
    console.log(`✅ ${result.rows.length} campos obtenidos para el proyecto ${projectId} del usuario ${userId}`);
    return result.rows;
  } catch (error) {
    console.error(`❌ Error obteniendo campos del proyecto ${projectId} para el usuario ${userId}:`, error);
    throw new Error('Error al obtener los campos del proyecto');
  }
}