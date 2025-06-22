// middleware.js
import { NextResponse } from 'next/server';
import * as jose from 'jose'; // Importamos la librería JOSE

// Asegúrate de que esta clave secreta sea EXACTAMENTE la misma que usas en tu backend
// para firmar los tokens JWT. Es crucial.
const jwtSecret = process.env.JWT_SECRET; // Elimina el fallback para producción
if (!jwtSecret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno. Es crucial para la seguridad.');
}
// Define las rutas que son públicas y no requieren autenticación
const publicRoutes = ['/login', '/register', '/', '/servicios', '/contacto', '/quienessomos'];

// --- NUEVO: Define las rutas permitidas por cada rol ---
// Estas son las rutas *base* a las que cada rol tiene acceso.
// Por ejemplo, si 'admin' puede acceder a '/admin/usuarios', con '/admin' ya lo cubres.
const roleProtectedRoutes = {
    admin: ['/admin'],
    usuario: ['/usuario'],
    tecnico: ['/tecnico'],
};

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // --- 1. Manejar Rutas Públicas y API Routes de Autenticación ---
    // Si la ruta es pública o es una API Route relacionada con la autenticación (ej. /api/auth/login),
    // permite el acceso sin verificar el token.
    if (publicRoutes.includes(pathname) || pathname.startsWith('/api/auth/')) {
        return NextResponse.next();
    }

    // --- 2. Obtener el Token JWT de la Cookie ---
    const token = request.cookies.get('token')?.value;

    // --- 3. Verificar si Existe un Token ---
    if (!token) {
        const redirectUrl = new URL('/login', request.nextUrl.origin);
        redirectUrl.searchParams.set('error', 'no_auth_token');
        redirectUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    let decodedPayload;
    let userRole;

    // --- 4. Verificar la Validez del Token y Decodificarlo con JOSE ---
    try {
        const secret = new TextEncoder().encode(jwtSecret);
        // jwtVerify no solo verifica, también devuelve el payload decodificado
        const { payload } = await jose.jwtVerify(token, secret);
        decodedPayload = payload;

        // Extraer el rol del payload. Asegúrate de que el payload del token tenga una estructura como { user: { rol: 'admin' } }
        userRole = decodedPayload.user?.rol;

        if (!userRole) {
            console.error('Middleware: Token válido pero no se encontró el rol del usuario en el payload:', decodedPayload);
            throw new Error('Rol de usuario no encontrado en el token.');
        }

    } catch (error) {
        console.error('Error de verificación o decodificación de token en middleware:', error);
        // Si el token es inválido o ha expirado, redirige al login
        const redirectUrl = new URL('/login', request.nextUrl.origin);
        redirectUrl.searchParams.set('error', 'session_expired');
        redirectUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // --- 5. Lógica de Protección de Rutas Basada en Roles ---
    // Verificar si el rol del usuario tiene permiso para la ruta actual
    const allowedRoutesForRole = roleProtectedRoutes[userRole];

    // Si el rol no está definido en roleProtectedRoutes o no tiene rutas asignadas
    if (!allowedRoutesForRole) {
        console.warn(`Middleware: Rol desconocido o sin rutas permitidas: ${userRole}`);
        const redirectUrl = new URL('/login', request.nextUrl.origin);
        redirectUrl.searchParams.set('error', 'unauthorized_role');
        redirectUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Verificar si la ruta solicitada comienza con alguna de las rutas permitidas para el rol
    const isAuthorized = allowedRoutesForRole.some(allowedPath => pathname.startsWith(allowedPath));

    if (isAuthorized) {
        // Si el usuario está autorizado para la ruta, permite el acceso.
        return NextResponse.next();
    } else {
        // Si el usuario no está autorizado para la ruta
        console.warn(`Middleware: Acceso denegado. Usuario con rol '${userRole}' intentó acceder a '${pathname}'`);
        // Redirige al usuario a una página de "Acceso Denegado" o a la página de login con un error.
        const redirectUrl = new URL('/login', request.nextUrl.origin);
        redirectUrl.searchParams.set('error', 'access_denied');
        redirectUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(redirectUrl);
    }
}

// --- Configuración del Matcher: ¡CRUCIAL para el rendimiento y la funcionalidad! ---
// Define para qué rutas se ejecutará el middleware.
// Es vital EXCLUIR archivos estáticos y rutas internas de Next.js para evitar problemas de carga.
export const config = {
    matcher: [
        /*
         * Coincide con todas las rutas EXCEPTO las que empiezan por:
         * - /api (tus propias API routes que no son de autenticación)
         * - /_next/static (archivos estáticos de Next.js como JS, CSS, fuentes)
         * - /_next/image (imágenes optimizadas por el componente next/image)
         * - /favicon.ico (el icono de tu sitio web)
         * - /login (tu página de login)
         * - /register (tu página de registro)
         * - /images (¡Importante si tus imágenes están en public/images!)
         * - /assets (¡Importante si tus assets están en public/assets!)
         * Puedes añadir aquí cualquier otra carpeta de activos estáticos que tengas directamente en `public/`.
         */
        '/((?!api|_next/static|_next/image|favicon.ico|login|register|images|assets).*)',
    ],
};