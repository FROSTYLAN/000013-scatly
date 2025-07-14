import { db } from '@/lib/database';
import { Field, CreateFieldInput, UpdateFieldInput } from '@/types/database-types';

// Obtener todos los campos con filtro opcional por parent_code
export async function getAllFields(parentCode?: string | null): Promise<Field[]> {
  let query_text = 'SELECT * FROM fields ORDER BY created_at DESC';
  let params: any[] = [];
  
  if (parentCode !== undefined) {
    if (parentCode === null) {
      query_text = 'SELECT * FROM fields WHERE parent_code IS NULL ORDER BY created_at DESC';
    } else {
      query_text = 'SELECT * FROM fields WHERE parent_code = $1 ORDER BY created_at DESC';
      params = [parentCode];
    }
  }
  
  const result = await db.query(query_text, params);
  return result.rows;
}

export async function getFieldById(id: number): Promise<Field | null> {
  try {
    console.log(`🔍 Buscando campo con ID: ${id}`);
    const result = await db.query('SELECT * FROM fields WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      console.log(`❌ Campo con ID ${id} no encontrado`);
      return null;
    }
    
    console.log(`✅ Campo encontrado: ${result.rows[0].name}`);
    return result.rows[0];
  } catch (error) {
    console.error(`❌ Error buscando campo ${id}:`, error);
    throw new Error('Error al buscar el campo');
  }
}



export async function createField(fieldData: CreateFieldInput): Promise<Field> {
  try {
    console.log('➕ Creando nuevo campo:', fieldData);
    
    const result = await db.query(
      'INSERT INTO fields (name, code, parent_code, has_comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [fieldData.name, fieldData.code, fieldData.parent_code, fieldData.has_comment]
    );
    
    console.log('✅ Campo creado exitosamente:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error creando campo:', error);
    throw new Error('Error al crear el campo');
  }
}

export async function updateField(id: number, fieldData: UpdateFieldInput): Promise<Field | null> {
  try {
    console.log(`🔄 Actualizando campo ${id}:`, fieldData);
    
    // Construir la consulta dinámicamente basada en los campos proporcionados
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    if (fieldData.name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(fieldData.name);
      paramCount++;
    }
    
    if (fieldData.code !== undefined) {
      updates.push(`code = $${paramCount}`);
      values.push(fieldData.code);
      paramCount++;
    }
    
    if (fieldData.parent_code !== undefined) {
      updates.push(`parent_code = $${paramCount}`);
      values.push(fieldData.parent_code);
      paramCount++;
    }
    
    if (fieldData.has_comment !== undefined) {
      updates.push(`has_comment = $${paramCount}`);
      values.push(fieldData.has_comment);
      paramCount++;
    }
    
    if (updates.length === 0) {
      throw new Error('No hay campos para actualizar');
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    const query = `UPDATE fields SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      console.log(`❌ Campo con ID ${id} no encontrado`);
      return null;
    }
    
    console.log('✅ Campo actualizado exitosamente:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error actualizando campo:', error);
    throw new Error('Error al actualizar el campo');
  }
}

export async function deleteField(id: number): Promise<boolean> {
  try {
    console.log(`🗑️ Eliminando campo ${id}...`);
    
    const result = await db.query('DELETE FROM fields WHERE id = $1', [id]);
    
    if (result.rowCount === 0) {
      console.log(`❌ Campo con ID ${id} no encontrado para eliminar`);
      return false;
    }
    
    console.log(`✅ Campo eliminado exitosamente`);
    return true;
  } catch (error) {
    console.error(`❌ Error eliminando campo ${id}:`, error);
    throw new Error('Error al eliminar el campo');
  }
}