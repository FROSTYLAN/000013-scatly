import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';
import { 
  getAllFields, 
  createField 
} from '@/lib/services/field-service';
import { CreateFieldInput } from '@/types/database-types';

export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/fields - Obteniendo campos...');
    
    // Obtener parámetro de parent_code si existe
    const { searchParams } = new URL(request.url);
    const parentCodeParam = searchParams.get('parent_code');
    
    let parentCode: string | null | undefined = undefined;
    
    if (parentCodeParam !== null) {
      if (parentCodeParam === 'null' || parentCodeParam === '') {
        parentCode = null; // Campos raíz
      } else {
        parentCode = parentCodeParam;
      }
    }
    
    console.log('🔍 Filtro de parent_code:', parentCode);
    
    const fields = await getAllFields(parentCode);
    
    console.log(`✅ ${fields.length} campos obtenidos exitosamente`);
    return NextResponse.json(fields);
  } catch (error) {
    console.error('❌ Error en GET /api/fields:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('➕ POST /api/fields - Creando nuevo campo...');
    
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

    const body = await request.json();
    console.log('📝 Datos del campo recibidos:', body);
    
    // Validar datos requeridos
    if (!body.name || !body.code) {
      console.log('❌ Datos faltantes en la solicitud');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos faltantes',
          details: 'Se requieren name y code'
        },
        { status: 400 }
      );
    }

    // Validar que parent_code sea un string válido o null
    if (body.parent_code !== null && body.parent_code !== undefined) {
      if (typeof body.parent_code !== 'string' || body.parent_code.trim() === '') {
        console.log('❌ parent_code inválido:', body.parent_code);
        return NextResponse.json(
          { 
            success: false,
            error: 'parent_code inválido',
            details: 'parent_code debe ser un string válido o null'
          },
          { status: 400 }
        );
      }
    }

    const fieldData: CreateFieldInput = {
      name: body.name,
      code: body.code,
      parent_code: body.parent_code || null,
      has_comment: body.has_comment || false
    };
    
    const newField = await createField(fieldData);
    
    console.log(`✅ Campo creado exitosamente: ${newField.name}`);
    return NextResponse.json({
      success: true,
      message: 'Campo creado exitosamente',
      data: newField
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error en POST /api/fields:', error);
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