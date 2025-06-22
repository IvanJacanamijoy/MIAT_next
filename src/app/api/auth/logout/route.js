// src/app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
    const cookie = serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0, // Establece la edad máxima a 0 para eliminarla inmediatamente
        path: '/',
        sameSite: 'Lax',
    });

    const response = NextResponse.json({ message: 'Sesión cerrada exitosamente' });
    response.headers.set('Set-Cookie', cookie);
    return response;
}