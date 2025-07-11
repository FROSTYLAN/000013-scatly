import { NextResponse } from 'next/server';
import { createProject, getAllProjects } from '@/lib/services/project-service';
import { CreateProjectInput } from '@/types/database-types';

export async function GET() {
  console.log('🔍 GET /api/projects - Iniciando...');
  
  try {
    console.log('📊 Obteniendo proyectos de la base de datos...');
    const projects = await getAllProjects();
    console.log('✅ Proyectos obtenidos:', projects.length);
    
    return NextResponse.json({ 
      success: true,
      timestamp: new Date().toISOString(),
      count: projects.length, 
      projects 
    });
  } catch (error) {
    console.error('❌ Error al obtener proyectos:', error);
    
    return NextResponse.json(
      { 
        success: false,
        timestamp: new Date().toISOString(),
        error: 'Error al obtener proyectos de la base de datos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log('📝 POST /api/projects - Iniciando...');
  
  try {
    const input: CreateProjectInput = await request.json();
    console.log('📊 Creando nuevo proyecto:', input.nombre);
    
    const project = await createProject(input);
    console.log('✅ Proyecto creado con ID:', project.id);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Proyecto creado exitosamente',
      project
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error al crear proyecto:', error);
    
    return NextResponse.json(
      { 
        success: false,
        timestamp: new Date().toISOString(),
        error: 'Error al crear el proyecto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}