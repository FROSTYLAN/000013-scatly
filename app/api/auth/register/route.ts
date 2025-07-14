import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/services/user-service';
import { CreateUserInput } from '@/types/user-types';
import { sign } from 'jsonwebtoken';

// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'scatly-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos de entrada
    if (!body.username || !body.email || !body.password) {
      return NextResponse.json({
        success: false,
        error: 'Datos incompletos. Se requiere username, email y password',
      }, { status: 400 });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({
        success: false,
        error: 'Formato de email inválido',
      }, { status: 400 });
    }
    
    // Validar longitud de contraseña
    if (body.password.length < 6) {
      return NextResponse.json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      }, { status: 400 });
    }
    
    const userData: CreateUserInput = {
      username: body.username,
      email: body.email,
      password: body.password
    };
    
    const newUser = await createUser(userData);
    
    // Generar token JWT para el nuevo usuario
    const token = sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('✅ Register - Token generado exitosamente:', token.substring(0, 20) + '...');
    
    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token: token, // Enviar token al cliente
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    }, {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'http://localhost:3000'
      }
    });
  } catch (error) {
    console.error('Error en registro de usuario:', error);
    
    // Manejar error de email duplicado
    if (error instanceof Error && error.message.includes('email ya está registrado')) {
      return NextResponse.json({
        success: false,
        error: 'El email ya está registrado',
      }, { status: 409 }); // Conflict
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error al registrar usuario',
      details: error instanceof Error ? error.message : 'Error desconocido',
    }, { status: 500 });
  }
}