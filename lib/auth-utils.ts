import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'scatly-secret-key';

export interface AuthResult {
  success: boolean;
  userId?: number;
  user?: { id: number; username: string; email: string; role: string };
  error?: string;
}

export function verifyAuth(request: NextRequest): AuthResult {
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
    
    const decoded = verify(token, JWT_SECRET) as { 
      userId: number; 
      username: string; 
      email: string; 
      role: string; 
    };
    console.log('✅ verifyAuth - Token válido, payload decodificado:', JSON.stringify(decoded));
    console.log('=== FIN verifyAuth (ÉXITO) ===\n');
    
    return { 
      success: true, 
      userId: decoded.userId,
      user: {
        id: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role
      }
    };
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

export async function verifyAuthAsync(request: NextRequest): Promise<AuthResult> {
  return verifyAuth(request);
}