import { NextRequest, NextResponse } from 'next/server';
import { createProject, getAllProjects } from '@/lib/services/project-service';
import { CreateProjectInput } from '@/types/database-types';
import { verify } from 'jsonwebtoken';

// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'scatly-secret-key';

// Función para verificar autenticación
function verifyAuth(request: NextRequest) {
  console.log('\n=== INICIO verifyAuth ===');
  
  const authHeader = request.headers.get('authorization');
  console.log('🔍 verifyAuth - Authorization header completo:', JSON.stringify(authHeader));
  
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  console.log('🔍 verifyAuth - Token extraído:', token ? `${token.substring(0, 30)}...` : 'NO ENCONTRADO');
  console.log('🔍 verifyAuth - Longitud del token:', token ? token.length : 0);
  
  if (!token) {
    console.log('❌ verifyAuth - No hay token');
    console.log('=== FIN verifyAuth (SIN TOKEN) ===\n');
    return { success: false, error: 'Token requerido en Authorization header' };
  }
  
  try {
    console.log('🔍 verifyAuth - JWT_SECRET presente:', JWT_SECRET ? 'SÍ' : 'NO');
    console.log('🔍 verifyAuth - JWT_SECRET longitud:', JWT_SECRET ? JWT_SECRET.length : 0);
    
    const decoded = verify(token, JWT_SECRET) as { userId: number };
    console.log('✅ verifyAuth - Token válido, payload decodificado:', JSON.stringify(decoded));
    console.log('=== FIN verifyAuth (ÉXITO) ===\n');
    return { success: true, userId: decoded.userId };
  } catch (error) {
    console.log('❌ verifyAuth - Error verificando token:');
    console.log('   - Tipo de error:', error instanceof Error ? error.constructor.name : typeof error);
    console.log('   - Mensaje:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.log('   - Stack:', error.stack.split('\n')[0]);
    }
    console.log('=== FIN verifyAuth (ERROR) ===\n');
    return { success: false, error: 'Token inválido o expirado' };
  }
}

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