import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/services/project-service';
import { UpdateProjectInput } from '@/types/database-types';
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