// src/app/login/page.jsx
'use client'; // ¡Esencial para componentes que usan hooks de cliente!

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <-- Importa useRouter de Next.js
import HomeForm from '@/components/HomeForm';
import { useAuth } from '@/context/AuthContext';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // <-- Usa el hook useRouter de Next.js
    const { iniciarSesion, usuario } = useAuth();

    // Verificar si ya hay un usuario logueado
    useEffect(() => {
        // Asegúrate de que `usuario` y `usuario.rol` estén definidos y no sean `null`
        // También, si tu AuthContext tiene `isLoading`, considera usarlo aquí:
        // if (!isLoadingAuth && usuario && usuario.rol) { ... }
        if (usuario && usuario.rol) {
            router.push(`/${usuario.rol}`); // <-- Usa router.push para navegar
        }
    }, [router, usuario]); // router es una dependencia para useEffect

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Por favor, ingresa tu email y contraseña.');
            setIsLoading(false);
            return;
        }

        try {
            // *** CAMBIO CLAVE: Usa la ruta relativa a tu API Route de Next.js ***
            // Si tu API Route de login es `src/app/api/auth/login/route.js`,
            // la URL para el fetch DEBE ser `/api/auth/login`.
            // No uses `http://localhost:3000/auth/login` a menos que sea un backend completamente separado.
            // Si es un backend separado, asegúrate de que Next.js no intente renderizarlo en el server.
            const response = await fetch('/api/auth/login', { // <-- ¡Cambiado a la ruta relativa de Next.js API Route!
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.token) {
                    iniciarSesion(data.token); // Actualiza el contexto y localStorage/cookies
                    // La redirección ya se maneja en el useEffect del AuthContext
                    // o aquí si prefieres que sea inmediato después del login exitoso.
                    // Si ya tienes un router.push en el AuthContext, puedes quitar este.
                    // Si no, puedes añadir router.push(`/${data.rol}`); aquí
                } else {
                    setError('Respuesta de éxito inesperada: No se recibió un token.');
                }
            } else {
                setError(data.message || 'Error al iniciar sesión. Credenciales incorrectas.');
            }
        } catch (error) {
            setError(`Error: ${error.message || 'Hubo un problema al iniciar sesión. Por favor, intenta de nuevo.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='absolute top-0 h-screen w-full bg-red-50'>
            <div className='flex flex-col items-center justify-center min-h-screen bg-[url("/assets/images/home/imagen_fondo.png")] bg-local bg-center bg-cover bg-opacity-70'> {/* Nota: Ruta de imagen ajustada */}
                <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                    <HomeForm
                        onSubmit={handleLogin}
                        styles="space-y-4"
                        inputs={[
                            {
                                label: 'Email',
                                type: 'email',
                                value: email,
                                onChange: (e) => setEmail(e.target.value),
                                placeholder: 'Ingresa tu email',
                                disabled: isLoading,
                            },
                            {
                                label: 'Contraseña',
                                type: 'password',
                                value: password,
                                onChange: (e) => setPassword(e.target.value),
                                placeholder: 'Ingresa tu contraseña',
                                disabled: isLoading,
                            },
                        ]}
                        error={error}
                        isLoading={isLoading}
                        buttonText={isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                    />
                </div>
            </div>
        </div>
    );
};