import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    console.log('🗑️ Logout - Sesión cerrada (token manejado en cliente)');
    
    return NextResponse.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error al cerrar sesión',
      details: error instanceof Error ? error.message : 'Error desconocido',
    }, { status: 500 });
  }
}