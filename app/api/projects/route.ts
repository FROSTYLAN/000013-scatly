import { NextRequest, NextResponse } from 'next/server';
import { createProject, getProjectsByUserId } from '@/lib/services/project-service';
import { createMultipleProjectFields } from '@/lib/services/project-field-service';
import { CreateProjectInput } from '@/types/database-types';
import { verifyAuth } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  console.log('🔍 GET /api/projects - Iniciando...');
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
    console.log('📥 Datos recibidos:', inputData);
    
    // Extraer stepFields del input
    const { step1Fields, step2Fields, step3Fields, step4Fields, step5Fields, step6Fields, step7Fields } = inputData;
    
    // Crear proyecto con valores por defecto ya que solo manejamos stepFields
    const input: CreateProjectInput = {
      nombre: `Proyecto ${new Date().toISOString().split('T')[0]}`,
      descripcion: 'Proyecto generado automáticamente',
      fecha: new Date().toISOString().split('T')[0],
      user_id: auth.userId!
    };
    console.log('📊 Creando nuevo proyecto automático para usuario:', input.user_id);
    
    // Crear el proyecto primero
    const project = await createProject(input);
    console.log('✅ Proyecto creado con ID:', project.id);
    
    // Combinar todos los stepFields en un solo array
    const allFields: { fieldId: number; comment: string }[] = [];
    
    if (step1Fields) allFields.push(...step1Fields);
    if (step2Fields) allFields.push(...step2Fields);
    if (step3Fields) allFields.push(...step3Fields);
    if (step4Fields) allFields.push(...step4Fields);
    if (step5Fields) allFields.push(...step5Fields);
    if (step6Fields) allFields.push(...step6Fields);
    if (step7Fields) allFields.push(...step7Fields);
    
    // Guardar todos los campos en la tabla intermedia si hay campos
    let projectFields = [];
    if (allFields.length > 0) {
      console.log(`📋 Guardando ${allFields.length} campos para el proyecto ${project.id}...`);
      projectFields = await createMultipleProjectFields(project.id, allFields);
      console.log(`✅ ${projectFields.length} campos guardados exitosamente`);
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Proyecto creado exitosamente',
      project,
      fieldsCount: projectFields.length
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