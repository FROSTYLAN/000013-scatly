import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';
import { 
  getFieldByCode, 
  getFieldWithChildren,
  updateField, 
  deleteField 
} from '@/lib/services/field-service';
import { UpdateFieldInput } from '@/types/database-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const fieldCode = params.code;
    console.log(`🔍 GET /api/fields/${fieldCode} - Obteniendo campo...`);
    
    // Verificar autenticación
    const authResult = verifyAuth(request);
    if (!authResult.success) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (!fieldCode || fieldCode.trim() === '') {
      console.log('❌ Código de campo inválido:', params.code);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Código de campo inválido' 
        },
        { status: 400 }
      );
    }
    
    const fieldWithChildren = await getFieldWithChildren(fieldCode);
    
    if (!fieldWithChildren) {
      console.log(`❌ Campo ${fieldCode} no encontrado`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo no encontrado' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Campo ${fieldCode} con estructura jerárquica obtenido exitosamente`);
    return NextResponse.json({
      success: true,
      data: fieldWithChildren
    });
  } catch (error) {
    console.error(`❌ Error en GET /api/fields/${params.code}:`, error);
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
  { params }: { params: { code: string } }
) {
  try {
    const fieldCode = params.code;
    console.log(`✏️ PUT /api/fields/${fieldCode} - Actualizando campo...`);
    
    // Verificar autenticación
    const authResult = verifyAuth(request);
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

    if (!fieldCode || fieldCode.trim() === '') {
      console.log('❌ Código de campo inválido:', params.code);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Código de campo inválido' 
        },
        { status: 400 }
      );
    }

    // Primero obtener el campo para conseguir su ID
    const existingField = await getFieldByCode(fieldCode);
    if (!existingField) {
      console.log(`❌ Campo ${fieldCode} no encontrado`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo no encontrado' 
        },
        { status: 404 }
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
    
    const updatedField = await updateField(existingField.id, fieldData);
    
    if (!updatedField) {
      console.log(`❌ Campo ${fieldCode} no encontrado para actualizar`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo no encontrado' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Campo ${fieldCode} actualizado exitosamente`);
    return NextResponse.json({
      success: true,
      message: 'Campo actualizado exitosamente',
      data: updatedField
    });
  } catch (error) {
    console.error(`❌ Error en PUT /api/fields/${params.code}:`, error);
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
  { params }: { params: { code: string } }
) {
  try {
    const fieldCode = params.code;
    console.log(`🗑️ DELETE /api/fields/${fieldCode} - Eliminando campo...`);
    
    // Verificar autenticación
    const authResult = verifyAuth(request);
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

    if (!fieldCode || fieldCode.trim() === '') {
      console.log('❌ Código de campo inválido:', params.code);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Código de campo inválido' 
        },
        { status: 400 }
      );
    }
    
    // Primero obtener el campo para conseguir su ID
    const existingField = await getFieldByCode(fieldCode);
    if (!existingField) {
      console.log(`❌ Campo ${fieldCode} no encontrado`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo no encontrado' 
        },
        { status: 404 }
      );
    }
    
    const deleted = await deleteField(existingField.id);
    
    if (!deleted) {
      console.log(`❌ Campo ${fieldCode} no encontrado para eliminar`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo no encontrado' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Campo ${fieldCode} eliminado exitosamente`);
    return NextResponse.json({
      success: true,
      message: 'Campo eliminado exitosamente'
    });
  } catch (error) {
    console.error(`❌ Error en DELETE /api/fields/${params.code}:`, error);
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