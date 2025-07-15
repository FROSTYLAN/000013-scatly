import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';
import { 
  getProjectFieldsByUserAndProjectId,
  createProjectField,
  deleteAllProjectFields
} from '@/lib/services/project-field-service';
import { getProjectByIdAndUserId } from '@/lib/services/project-service';
import { CreateProjectFieldInput } from '@/types/database-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    console.log(`📋 GET /api/projects/${projectId}/fields - Obteniendo campos del proyecto...`);
    
    // Verificar autenticación
    const authResult = verifyAuth(request);
    if (!authResult.success) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (isNaN(projectId)) {
      console.log('❌ ID de proyecto inválido:', params.id);
      return NextResponse.json(
        { error: 'ID de proyecto inválido' },
        { status: 400 }
      );
    }

    const userId = authResult.user!.id;
    
    // Verificar que el proyecto pertenezca al usuario
    const project = await getProjectByIdAndUserId(projectId, userId);
    if (!project) {
      console.log(`❌ Proyecto ${projectId} no encontrado o no pertenece al usuario ${userId}`);
      return NextResponse.json(
        { error: 'Proyecto no encontrado o sin permisos' },
        { status: 404 }
      );
    }
    
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
    
    const projectFields = await getProjectFieldsByUserAndProjectId(userId, projectId, parentCode);
    
    console.log(`✅ ${projectFields.length} campos obtenidos para el proyecto ${projectId}`);
    return NextResponse.json(projectFields);
  } catch (error) {
    console.error(`❌ Error en GET /api/projects/${params.id}/fields:`, error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    console.log(`➕ POST /api/projects/${projectId}/fields - Agregando campo al proyecto...`);
    
    // Verificar autenticación
    const authResult = verifyAuth(request);
    if (!authResult.success) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (isNaN(projectId)) {
      console.log('❌ ID de proyecto inválido:', params.id);
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de proyecto inválido' 
        },
        { status: 400 }
      );
    }

    const userId = authResult.user!.id;
    
    // Verificar que el proyecto pertenezca al usuario
    const project = await getProjectByIdAndUserId(projectId, userId);
    if (!project) {
      console.log(`❌ Proyecto ${projectId} no encontrado o no pertenece al usuario ${userId}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Proyecto no encontrado o sin permisos' 
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    console.log('📝 Datos del campo recibidos:', body);
    
    // Validar datos requeridos
    if (!body.field_id) {
      console.log('❌ field_id faltante en la solicitud');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos faltantes',
          details: 'Se requiere field_id'
        },
        { status: 400 }
      );
    }

    const projectFieldData: CreateProjectFieldInput = {
      project_id: projectId,
      field_id: body.field_id,
      comment: body.comment || null
    };
    
    const newProjectField = await createProjectField(projectFieldData);
    
    console.log(`✅ Campo agregado al proyecto ${projectId} exitosamente`);
    return NextResponse.json({
      success: true,
      message: 'Campo agregado al proyecto exitosamente',
      data: newProjectField
    }, { status: 201 });
  } catch (error) {
    console.error(`❌ Error en POST /api/projects/${params.id}/fields:`, error);
    
    // Manejar error de duplicado
    if (error instanceof Error && error.message.includes('ya existe')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El campo ya está asociado a este proyecto'
        },
        { status: 409 }
      );
    }
    
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
    const projectId = parseInt(params.id);
    console.log(`🗑️ DELETE /api/projects/${projectId}/fields - Eliminando todos los campos del proyecto...`);
    
    // Verificar autenticación
    const authResult = verifyAuth(request);
    if (!authResult.success) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (isNaN(projectId)) {
      console.log('❌ ID de proyecto inválido:', params.id);
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de proyecto inválido' 
        },
        { status: 400 }
      );
    }

    const userId = authResult.user!.id;
    
    // Verificar que el proyecto pertenezca al usuario
    const project = await getProjectByIdAndUserId(projectId, userId);
    if (!project) {
      console.log(`❌ Proyecto ${projectId} no encontrado o no pertenece al usuario ${userId}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Proyecto no encontrado o sin permisos' 
        },
        { status: 404 }
      );
    }
    
    const deletedCount = await deleteAllProjectFields(projectId);
    
    console.log(`✅ ${deletedCount} campos eliminados del proyecto ${projectId}`);
    return NextResponse.json({
      success: true,
      message: `${deletedCount} campos eliminados del proyecto exitosamente`,
      deletedCount
    });
  } catch (error) {
    console.error(`❌ Error en DELETE /api/projects/${params.id}/fields:`, error);
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