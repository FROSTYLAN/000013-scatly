import { NextRequest, NextResponse } from 'next/server';
import { createProject, getAllProjects, getProjectsByUserId } from '@/lib/services/project-service';
import { CreateProjectInput } from '@/types/database-types';
import { verifyAuth } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  console.log('🔍 GET /api/projects - Iniciando...');
  debugger
  // Verificar autenticación
  const auth = verifyAuth(request);
  if (!auth.success) {
    console.log('❌ GET /api/projects - No autorizado:', auth.error);
    return NextResponse.json(
      { 
        success: false,
        error: auth.error
      },
      { status: 401 }
    );
  }
  
  console.log('✅ GET /api/projects - Usuario autenticado:', auth.userId);
  
  try {
    console.log('📊 Obteniendo proyectos del usuario:', auth.userId);
    const projects = await getProjectsByUserId(auth.userId!);
    console.log('✅ Proyectos obtenidos para el usuario:', projects.length);
    
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

export async function POST(request: NextRequest) {
  console.log('📝 POST /api/projects - Iniciando...');
  
  // Verificar autenticación
  const auth = verifyAuth(request);
  if (!auth.success) {
    console.log('❌ POST /api/projects - No autorizado:', auth.error);
    return NextResponse.json(
      { 
        success: false,
        error: auth.error
      },
      { status: 401 }
    );
  }
  
  console.log('✅ POST /api/projects - Usuario autenticado:', auth.userId);
  
  try {
    const inputData = await request.json();
    const input: CreateProjectInput = {
      ...inputData,
      user_id: auth.userId!
    };
    console.log('📊 Creando nuevo proyecto:', input.nombre, 'para usuario:', input.user_id);
    
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