import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';
import { 
  getFieldById, 
  updateField, 
  deleteField 
} from '@/lib/services/field-service';
import { UpdateFieldInput } from '@/types/database-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fieldId = parseInt(params.id);
    console.log(`🔍 GET /api/fields/${fieldId} - Obteniendo campo...`);
    
    // Verificar autenticación
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (isNaN(fieldId)) {
      console.log('❌ ID de campo inválido:', params.id);
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de campo inválido' 
        },
        { status: 400 }
      );
    }
    
    const field = await getFieldById(fieldId);
    
    if (!field) {
      console.log(`❌ Campo ${fieldId} no encontrado`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo no encontrado' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Campo ${fieldId} obtenido exitosamente`);
    return NextResponse.json({
      success: true,
      data: field
    });
  } catch (error) {
    console.error(`❌ Error en GET /api/fields/${params.id}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fieldId = parseInt(params.id);
    console.log(`✏️ PUT /api/fields/${fieldId} - Actualizando campo...`);
    
    // Verificar autenticación
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin
    if (authResult.user?.role !== 'admin') {
      console.log('❌ Usuario sin permisos de administrador');
      return NextResponse.json(
        { error: 'Se requieren permisos de administrador' },
        { status: 403 }
      );
    }

    if (isNaN(fieldId)) {
      console.log('❌ ID de campo inválido:', params.id);
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de campo inválido' 
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    console.log('📝 Datos de actualización recibidos:', body);
    
    // Validar parent_code si se proporciona
    if (body.parent_code !== null && body.parent_code !== undefined) {
      if (typeof body.parent_code !== 'string' || body.parent_code.trim() === '') {
        console.log('❌ parent_code inválido:', body.parent_code);
        return NextResponse.json(
          { 
            success: false, 
            error: 'parent_code debe ser un string válido o null'
          },
          { status: 400 }
        );
      }
    }

    const fieldData: UpdateFieldInput = {};
    if (body.name) fieldData.name = body.name;
    if (body.code) fieldData.code = body.code;
    if (body.parent_code !== undefined) fieldData.parent_code = body.parent_code;
    if (body.has_comment !== undefined) fieldData.has_comment = body.has_comment;
    
    const updatedField = await updateField(fieldId, fieldData);
    
    if (!updatedField) {
      console.log(`❌ Campo ${fieldId} no encontrado para actualizar`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo no encontrado' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Campo ${fieldId} actualizado exitosamente`);
    return NextResponse.json({
      success: true,
      message: 'Campo actualizado exitosamente',
      data: updatedField
    });
  } catch (error) {
    console.error(`❌ Error en PUT /api/fields/${params.id}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fieldId = parseInt(params.id);
    console.log(`🗑️ DELETE /api/fields/${fieldId} - Eliminando campo...`);
    
    // Verificar autenticación
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el usuario sea admin
    if (authResult.user?.role !== 'admin') {
      console.log('❌ Usuario sin permisos de administrador');
      return NextResponse.json(
        { error: 'Se requieren permisos de administrador' },
        { status: 403 }
      );
    }

    if (isNaN(fieldId)) {
      console.log('❌ ID de campo inválido:', params.id);
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de campo inválido' 
        },
        { status: 400 }
      );
    }
    
    const deleted = await deleteField(fieldId);
    
    if (!deleted) {
      console.log(`❌ Campo ${fieldId} no encontrado para eliminar`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo no encontrado' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Campo ${fieldId} eliminado exitosamente`);
    return NextResponse.json({
      success: true,
      message: 'Campo eliminado exitosamente'
    });
  } catch (error) {
    console.error(`❌ Error en DELETE /api/fields/${params.id}:`, error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}