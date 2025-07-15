import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';
import { 
  getProjectFieldByIds,
  updateProjectField,
  deleteProjectField
} from '@/lib/services/project-field-service';
import { getProjectByIdAndUserId } from '@/lib/services/project-service';
import { UpdateProjectFieldInput } from '@/types/database-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; fieldId: string } }
) {
  try {
    const projectId = parseInt(params.id);
    const fieldId = parseInt(params.fieldId);
    console.log(`🔍 GET /api/projects/${projectId}/fields/${fieldId} - Obteniendo campo del proyecto...`);
    
    // Verificar autenticación
    const authResult = verifyAuth(request);
    if (!authResult.success) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (isNaN(projectId) || isNaN(fieldId)) {
      console.log('❌ IDs inválidos:', { projectId: params.id, fieldId: params.fieldId });
      return NextResponse.json(
        { 
          success: false, 
          error: 'IDs de proyecto o campo inválidos' 
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
    
    const projectField = await getProjectFieldByIds(projectId, fieldId);
    
    if (!projectField) {
      console.log(`❌ Campo ${fieldId} no encontrado en el proyecto ${projectId}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo no encontrado en este proyecto' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Campo ${fieldId} del proyecto ${projectId} obtenido exitosamente`);
    return NextResponse.json({
      success: true,
      data: projectField
    });
  } catch (error) {
    console.error(`❌ Error en GET /api/projects/${params.id}/fields/${params.fieldId}:`, error);
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
  { params }: { params: { id: string; fieldId: string } }
) {
  try {
    const projectId = parseInt(params.id);
    const fieldId = parseInt(params.fieldId);
    console.log(`✏️ PUT /api/projects/${projectId}/fields/${fieldId} - Actualizando campo del proyecto...`);
    
    // Verificar autenticación
    const authResult = verifyAuth(request);
    if (!authResult.success) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (isNaN(projectId) || isNaN(fieldId)) {
      console.log('❌ IDs inválidos:', { projectId: params.id, fieldId: params.fieldId });
      return NextResponse.json(
        { 
          success: false, 
          error: 'IDs de proyecto o campo inválidos' 
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
    console.log('📝 Datos de actualización recibidos:', body);

    const projectFieldData: UpdateProjectFieldInput = {
      comment: body.comment !== undefined ? body.comment : null
    };
    
    const updatedProjectField = await updateProjectField(projectId, fieldId, projectFieldData);
    
    if (!updatedProjectField) {
      console.log(`❌ Campo ${fieldId} no encontrado en el proyecto ${projectId}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo no encontrado en este proyecto' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Campo ${fieldId} del proyecto ${projectId} actualizado exitosamente`);
    return NextResponse.json({
      success: true,
      message: 'Campo del proyecto actualizado exitosamente',
      data: updatedProjectField
    });
  } catch (error) {
    console.error(`❌ Error en PUT /api/projects/${params.id}/fields/${params.fieldId}:`, error);
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
  { params }: { params: { id: string; fieldId: string } }
) {
  try {
    const projectId = parseInt(params.id);
    const fieldId = parseInt(params.fieldId);
    console.log(`🗑️ DELETE /api/projects/${projectId}/fields/${fieldId} - Eliminando campo del proyecto...`);
    
    // Verificar autenticación
    const authResult = verifyAuth(request);
    if (!authResult.success) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    if (isNaN(projectId) || isNaN(fieldId)) {
      console.log('❌ IDs inválidos:', { projectId: params.id, fieldId: params.fieldId });
      return NextResponse.json(
        { 
          success: false, 
          error: 'IDs de proyecto o campo inválidos' 
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
    
    const deleted = await deleteProjectField(projectId, fieldId);
    
    if (!deleted) {
      console.log(`❌ Campo ${fieldId} no encontrado en el proyecto ${projectId}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo no encontrado en este proyecto' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Campo ${fieldId} eliminado del proyecto ${projectId} exitosamente`);
    return NextResponse.json({
      success: true,
      message: 'Campo eliminado del proyecto exitosamente'
    });
  } catch (error) {
    console.error(`❌ Error en DELETE /api/projects/${params.id}/fields/${params.fieldId}:`, error);
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