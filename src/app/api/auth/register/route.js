// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import UsuarioModel from '../../../../lib/models/UsuarioModel'; // Ajusta la ruta

export async function POST(request) {
    try {
        const usuarioData = await request.json();

        // Lógica de registro del controlador AuthController
        const existingUser = await UsuarioModel.getUsuarioByEmail(usuarioData.Email);
        if (existingUser) {
            return new NextResponse(JSON.stringify({ message: 'El usuario ya existe' }), { status: 409 });
        }

        await UsuarioModel.createUsuario(usuarioData);
        return new NextResponse(JSON.stringify({ message: 'Usuario registrado correctamente' }), { status: 201 });

    } catch (error) {
        console.error('Error en /api/auth/register:', error);
        return new NextResponse(JSON.stringify({ message: `Error registrando al Usuario: ${error.message}` }), { status: 500 });
    }
}