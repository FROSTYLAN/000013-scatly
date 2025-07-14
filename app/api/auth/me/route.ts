import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { getUserById } from '@/lib/services/user-service';

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'scatly-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Obtener token del header Authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    console.log('🔍 /api/auth/me - Token encontrado en header:', !!token);
    console.log('🔍 /api/auth/me - Authorization header:', authHeader?.substring(0, 20) + '...');
    
    if (!token) {
      console.log('❌ /api/auth/me - No hay token en Authorization header, devolviendo 401');
      return NextResponse.json({
        success: false,
        error: 'No autorizado - Token requerido en Authorization header',
      }, { 
        status: 401,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': 'http://localhost:3000'
        }
      });
    }
    
    // Verificar token
    console.log('🔐 /api/auth/me - Verificando token JWT...');
    const decoded = verify(token, JWT_SECRET) as { userId: number };
    console.log('✅ /api/auth/me - Token válido, userId:', decoded.userId);
    
    // Obtener información del usuario
    const user = await getUserById(decoded.userId);
    console.log('👤 /api/auth/me - Usuario encontrado:', !!user);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      user
    }, {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'http://localhost:3000'
      }
    });
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    
    // Token inválido o expirado
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      return NextResponse.json({
        success: false,
        error: 'Token inválido o expirado',
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error al obtener información del usuario',
      details: error instanceof Error ? error.message : 'Error desconocido',
    }, { status: 500 });
  }
}