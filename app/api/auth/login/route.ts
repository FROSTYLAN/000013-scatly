import { NextRequest, NextResponse } from 'next/server';
import { verifyUserCredentials } from '@/lib/services/user-service';
import { LoginInput } from '@/types/user-types';
import { cookies } from 'next/headers';
import { sign } from 'jsonwebtoken';

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'scatly-secret-key';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada
    if (!body.email || !body.password) {
      return NextResponse.json({
        success: false,
        error: 'Datos incompletos. Se requiere email y password',
      }, { status: 400 });
    }
    
    const loginData: LoginInput = {
      email: body.email,
      password: body.password
    };
    
    // Verificar credenciales
    const user = await verifyUserCredentials(loginData.email, loginData.password);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Credenciales inválidas',
      }, { status: 401 });
    }
    
    // Generar token JWT
    const token = sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('✅ Login - Token generado exitosamente:', token.substring(0, 20) + '...');
    
    return NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token: token, // Enviar token al cliente
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al iniciar sesión',
      details: error instanceof Error ? error.message : 'Error desconocido',
    }, { status: 500 });
  }
}