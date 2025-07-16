import { NextRequest, NextResponse } from 'next/server';
import { getProjectByIdAndUserId, updateProjectByUser, deleteProjectByUser } from '@/lib/services/project-service';
import { getProjectFieldsByUserAndProjectId } from '@/lib/services/project-field-service';
import { UpdateProjectInput } from '@/types/database-types';
import { verifyAuth } from '@/lib/auth-utils';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`🔍 GET /api/projects/${params.id} - Iniciando...`);
  
  // Verificar autenticación
  const auth = verifyAuth(request);
  if (!auth.success) {
    console.log(`❌ GET /api/projects/${params.id} - No autorizado:`, auth.error);
    return NextResponse.json(
      { 
        success: false,
        error: auth.error
      },
      { status: 401 }
    );
  }
  
  console.log(`✅ GET /api/projects/${params.id} - Usuario autenticado:`, auth.userId);
  
  try {
    console.log(`📊 Buscando proyecto con ID: ${params.id} para usuario: ${auth.userId}`);
    const project = await getProjectByIdAndUserId(Number(params.id), auth.userId!);
    
    if (!project) {
      console.log(`❌ Proyecto con ID ${params.id} no encontrado o no pertenece al usuario ${auth.userId}`);
      return NextResponse.json(
        { 
          success: false,
          timestamp: new Date().toISOString(),
          error: 'Proyecto no encontrado o no tienes permisos para acceder a él' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Proyecto con ID ${params.id} encontrado`);
    
    // Obtener los project_fields asociados al proyecto
    console.log(`📋 Obteniendo campos del proyecto ${params.id}...`);
    const projectFields = await getProjectFieldsByUserAndProjectId(auth.userId!, Number(params.id));
    console.log(`✅ ${projectFields.length} campos obtenidos para el proyecto ${params.id}`);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...project,
      projectFields
    });
  } catch (error) {
    console.error(`❌ Error al obtener el proyecto ${params.id}:`, error);
    return NextResponse.json(
      { 
        success: false,
        timestamp: new Date().toISOString(),
        error: 'Error al obtener el proyecto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`✏️ PUT /api/projects/${params.id} - Iniciando...`);
  
  // Verificar autenticación
  const auth = verifyAuth(request);
  if (!auth.success) {
    console.log(`❌ PUT /api/projects/${params.id} - No autorizado:`, auth.error);
    return NextResponse.json(
      { 
        success: false,
        error: auth.error
      },
      { status: 401 }
    );
  }
  
  console.log(`✅ PUT /api/projects/${params.id} - Usuario autenticado:`, auth.userId);
  
  try {
    const input: UpdateProjectInput = await request.json();
    console.log(`📊 Actualizando proyecto con ID: ${params.id} para usuario: ${auth.userId}`);
    
    const project = await updateProjectByUser(Number(params.id), auth.userId!, input);
    
    if (!project) {
      console.log(`❌ Proyecto con ID ${params.id} no encontrado para actualizar o no pertenece al usuario ${auth.userId}`);
      return NextResponse.json(
        { 
          success: false,
          timestamp: new Date().toISOString(),
          error: 'Proyecto no encontrado o no tienes permisos para actualizarlo' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Proyecto con ID ${params.id} actualizado exitosamente`);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Proyecto actualizado exitosamente',
      project
    });
  } catch (error) {
    console.error(`❌ Error al actualizar el proyecto ${params.id}:`, error);
    return NextResponse.json(
      { 
        success: false,
        timestamp: new Date().toISOString(),
        error: 'Error al actualizar el proyecto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  console.log(`🗑️ DELETE /api/projects/${params.id} - Iniciando...`);
  
  // Verificar autenticación
  const auth = verifyAuth(request);
  if (!auth.success) {
    console.log(`❌ DELETE /api/projects/${params.id} - No autorizado:`, auth.error);
    return NextResponse.json(
      { 
        success: false,
        error: auth.error
      },
      { status: 401 }
    );
  }
  
  console.log(`✅ DELETE /api/projects/${params.id} - Usuario autenticado:`, auth.userId);
  
  try {
    console.log(`📊 Eliminando proyecto con ID: ${params.id} para usuario: ${auth.userId}`);
    const success = await deleteProjectByUser(Number(params.id), auth.userId!);
    
    if (!success) {
      console.log(`❌ Proyecto con ID ${params.id} no encontrado para eliminar o no pertenece al usuario ${auth.userId}`);
      return NextResponse.json(
        { 
          success: false,
          timestamp: new Date().toISOString(),
          error: 'Proyecto no encontrado o no tienes permisos para eliminarlo' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Proyecto con ID ${params.id} eliminado exitosamente`);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Proyecto eliminado correctamente',
      id: Number(params.id)
    });
  } catch (error) {
    console.error(`❌ Error al eliminar el proyecto ${params.id}:`, error);
    return NextResponse.json(
      { 
        success: false,
        timestamp: new Date().toISOString(),
        error: 'Error al eliminar el proyecto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}