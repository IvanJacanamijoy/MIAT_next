// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import UsuarioModel from '../../../../lib/models/UsuarioModel';
import jwtConfig from '../../../../lib/jwtConfig';
import { serialize } from 'cookie';

export async function POST(request) {
    console.log("------------------------------------------");
    console.log("DEBUG: Inicio de POST en /api/auth/login"); // LOG 1: Entrada a la ruta

    try {
        const { email, password } = await request.json();
        console.log(`DEBUG: Solicitud de login para email: ${email}`); // LOG 2: Datos recibidos

        // Verifica el secreto JWT
        const secret = jwtConfig.secret || process.env.JWT_SECRET;
        if (!secret) {
            console.error("ERROR: JWT_SECRET no está definido. Revisa tu .env.local");
            return new NextResponse(JSON.stringify({ message: "Error de configuración del servidor (JWT_SECRET)." }), { status: 500 });
        }
        console.log("DEBUG: JWT_SECRET verificado."); // LOG 3: JWT secreto OK

        // ------------------------------------------------------------------
        // LA LÍNEA MÁS CRÍTICA: Llama al modelo de usuario para el login
        console.log("DEBUG: Intentando llamar a UsuarioModel.loginUsuario..."); // LOG 4: Antes de llamar al modelo
        const loginUsuario = await UsuarioModel.loginUsuario(email, password);
        console.log("DEBUG: Resultado de UsuarioModel.loginUsuario:", loginUsuario); // LOG 5: Resultado del modelo
        // ------------------------------------------------------------------

        if (loginUsuario) {
            const rolString = loginUsuario.IdRol === 1 ? 'usuario' :
                loginUsuario.IdRol === 2 ? 'tecnico' :
                    loginUsuario.IdRol === 3 ? 'admin' :
                        'desconocido';

            const payload = {
                user: {
                    id: loginUsuario.IdUsuario,
                    email: loginUsuario.Email,
                    rol: rolString, // Ya es string aquí en el payload
                    nombre: loginUsuario.Nombres,
                }
            };

            const token = jwt.sign(
                payload,
                secret,
                { expiresIn: jwtConfig.expiresIn }
            );

            // *** ESENCIAL: Establecer la cookie HTTP-only en la respuesta ***
            const cookie = serialize('token', token, { // <-- El nombre de la cookie es 'token'
                httpOnly: true, // ¡IMPORTANTE! No accesible por JavaScript del lado del cliente
                secure: process.env.NODE_ENV === 'production', // Solo 'true' si usas HTTPS en producción
                maxAge: 60 * 60 * 24 * 7, // Duración de la cookie (ej. 1 semana)
                path: '/', // La cookie será accesible en todas las rutas
                sameSite: 'Lax', // Protección CSRF recomendada
            });

            const response = NextResponse.json({
                // Puedes seguir enviando el token en el cuerpo si tu frontend lo necesita para decodificarlo.
                token,
                id: loginUsuario.IdUsuario,
                email: loginUsuario.Email,
                rol: rolString,
                nombre: loginUsuario.Nombres,
            });

            // Añadir la cookie a los encabezados de la respuesta
            response.headers.set('Set-Cookie', cookie);
            return response;
        } else {
            return new NextResponse(JSON.stringify({ message: 'Usuario o contraseña incorrectos' }), { status: 401 });
        }
    } catch (error) {
        console.error('ERROR CRÍTICO en /api/auth/login:', error.message); // LOG ERROR: Atrapando cualquier error
        console.error('Stack Trace:', error.stack); // Muestra el rastro completo del error
        return new NextResponse(JSON.stringify({ message: `Error interno del servidor: ${error.message}` }), { status: 500 });
    } finally {
        console.log("DEBUG: Fin de POST en /api/auth/login"); // LOG 8: Fin de la ruta
        console.log("------------------------------------------");
    }
}