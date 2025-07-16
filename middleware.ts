import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Clave secreta para JWT (en producción debería estar en variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'scatly-secret-key';

// Rutas que no requieren autenticación
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/health',
  '/api/init',
  '/_next',
  '/favicon.ico',
  '/svgs',
  '/imgs',
  '/skills',
  '/projects-imgs',
  '/lottie',
  '/.well-known',
];

// Rutas que requieren autenticación
const protectedPaths = [
  '/new',
  '/project',
  '/api/projects',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Manejar solicitudes OPTIONS para CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  // Verificar si la ruta es pública
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }
  
  // Verificar si la ruta requiere autenticación
  const requiresAuth = protectedPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  
  if (!requiresAuth) {
    return NextResponse.next();
  }
  
  // Verificar si es una ruta de API
  const isApiRoute = pathname.startsWith('/api/');
  
  // Para rutas de página, permitir acceso y dejar que el cliente maneje la autenticación
  if (!isApiRoute) {
    console.log('🔍 Middleware - Ruta de página protegida, permitiendo acceso:', pathname);
    return NextResponse.next();
  }
  
  // Para rutas de API, verificar token en Authorization header
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  console.log('🔍 Middleware - Ruta API protegida:', pathname);
  console.log('🔍 Middleware - Token encontrado en header:', !!token);

  if (!token) {
    console.log('❌ Middleware - No hay token, devolviendo 401');
    // Redirigir a login si no es una ruta de API
    if (!isApiRoute) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
    
    // Devolver error 401 para rutas de API
    return new NextResponse(
      JSON.stringify({ success: false, error: 'No autorizado' }),
      {
        status: 401,
        headers: { 
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
          'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
        }
      }
    );
  }
  
  try {
    // Verificar token
    console.log('🔍 Middleware - Intentando verificar token...');
    console.log('🔍 Middleware - Token (primeros 30 chars):', token.substring(0, 30));
    console.log('🔍 Middleware - JWT_SECRET presente:', !!JWT_SECRET);
    console.log('🔍 Middleware - JWT_SECRET length:', JWT_SECRET?.length);
    
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    console.log('✅ Middleware - Token verificado exitosamente:', payload);
    return NextResponse.next();
  } catch (error) {
    // Token inválido o expirado
    console.log('❌ Middleware - Error type:', error);
    // Redirigir a login si no es una ruta de API
    if (!isApiRoute) {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }
    
    // Devolver error 401 para rutas de API
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Token inválido o expirado' }),
      {
        status: 401,
        headers: { 
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
          'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
        }
      }
    );
  }
}

// Configurar rutas que deben pasar por el middleware
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * 1. Archivos estáticos (/_next/static, /favicon.ico, etc.)
     * 2. Rutas de API que no requieren autenticación (configuradas en publicPaths)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};