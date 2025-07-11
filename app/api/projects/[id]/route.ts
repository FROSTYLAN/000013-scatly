import { NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/services/project-service';
import { UpdateProjectInput } from '@/types/database-types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log(`🔍 GET /api/projects/${params.id} - Iniciando...`);
  
  try {
    console.log(`📊 Buscando proyecto con ID: ${params.id}`);
    const project = await getProjectById(Number(params.id));
    
    if (!project) {
      console.log(`❌ Proyecto con ID ${params.id} no encontrado`);
      return NextResponse.json(
        { 
          success: false,
          timestamp: new Date().toISOString(),
          error: 'Proyecto no encontrado' 
        },
        { status: 404 }
      );
    }
    
    console.log(`✅ Proyecto con ID ${params.id} encontrado`);
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      project
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  console.log(`✏️ PUT /api/projects/${params.id} - Iniciando...`);
  
  try {
    const input: UpdateProjectInput = await request.json();
    console.log(`📊 Actualizando proyecto con ID: ${params.id}`);
    
    const project = await updateProject(Number(params.id), input);
    
    if (!project) {
      console.log(`❌ Proyecto con ID ${params.id} no encontrado para actualizar`);
      return NextResponse.json(
        { 
          success: false,
          timestamp: new Date().toISOString(),
          error: 'Proyecto no encontrado' 
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  console.log(`🗑️ DELETE /api/projects/${params.id} - Iniciando...`);
  
  try {
    console.log(`📊 Eliminando proyecto con ID: ${params.id}`);
    const success = await deleteProject(Number(params.id));
    
    if (!success) {
      console.log(`❌ Proyecto con ID ${params.id} no encontrado para eliminar`);
      return NextResponse.json(
        { 
          success: false,
          timestamp: new Date().toISOString(),
          error: 'Proyecto no encontrado' 
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