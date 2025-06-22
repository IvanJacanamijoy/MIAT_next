// src/context/AuthContext.js
"use client"; // Indica que este es un Client Component

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de haber instalado 'jwt-decode': npm install jwt-decode

// ----------------------------------------------------
// NO NECESITAMOS roleIdToName AQUÍ si el backend ya envía el nombre del rol como string
// Puedes eliminar o comentar el siguiente objeto:
/*
const roleIdToName = {
    1: 'usuario',
    2: 'tecnico',
    3: 'admin',
};
*/
// ----------------------------------------------------

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null); // Almacena los datos decodificados del usuario
    const [authToken, setAuthToken] = useState(null); // Almacena el token JWT en bruto
    const [isLoading, setIsLoading] = useState(true); // Indica si el proceso de carga inicial de sesión ha terminado
    const router = useRouter(); // Hook de Next.js para la navegación

    // Función auxiliar para decodificar un token y extraer los datos del usuario
    // Envuelto en useCallback para optimización
    const decodeAndSetUser = useCallback((tokenToDecode) => {
        try {
            const decoded = jwtDecode(tokenToDecode);

            // 1. Verificar la expiración del token
            if (decoded.exp * 1000 < Date.now()) {
                console.log('Token expirado.');
                return null; // El token está expirado
            }

            // 2. Usar el rol directamente del token (asumiendo que ya es una cadena como "admin")
            // No se necesita `roleIdToName` si el backend ya envía "admin", "usuario", etc.
            if (decoded.user && decoded.user.rol) { // Asegura que 'user' y 'rol' existan en el payload
                return {
                    id: decoded.user.id,
                    email: decoded.user.email,
                    rol: decoded.user.rol, // El rol ya viene como string del backend
                    nombre: decoded.user.nombre,
                    // Puedes añadir otras propiedades del payload aquí si las necesitas
                };
            } else {
                console.error('El token decodificado no contiene información de usuario o rol válida:', decoded.user);
                return null; // Datos de usuario/rol inválidos en el token
            }
        } catch (error) {
            console.error("Error decodificando token:", error);
            return null; // El token es inválido o corrupto
        }
    }, []); // No tiene dependencias externas, solo las importaciones

    // Función de cierre de sesión centralizada
    // Envuelto en useCallback para optimización
    const cerrarSesion = useCallback(async () => { // Marcar como async
        console.log("Cerrando sesión...");
        setAuthToken(null);
        setUsuario(null); // Limpiar los datos del usuario

        // Llama a la API de logout para eliminar la cookie HTTP-only
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error("Error al llamar a la API de logout:", error);
        }

        router.push('/'); // Redirigir a la página de inicio/login
    }, [router]);

    // Función para iniciar sesión, recibe **SOLO EL TOKEN JWT en bruto**
    // Envuelto en useCallback para optimización
    const iniciarSesion = useCallback((token) => {
        setAuthToken(token); // Almacena el token en el estado del contexto

        const user = decodeAndSetUser(token); // Decodifica el token para obtener los datos del usuario
        if (user) {
            setUsuario(user); // Establece los datos del usuario en el estado
            // Opcional: Podrías redirigir aquí si prefieres que la redirección sea responsabilidad del contexto
            // router.push(`/${user.rol}`);
        } else {
            // Si la decodificación falla (token inválido o expirado), cierra la sesión
            cerrarSesion();
        }
    }, [decodeAndSetUser, cerrarSesion]); // Dependencias: funciones usadas dentro de iniciarSesion

    // useEffect se ejecuta solo en el cliente después del montaje inicial
    // para cargar el estado de autenticación desde localStorage/cookies
    useEffect(() => {
        // Cuando usamos cookies HTTP-only, el token no es accesible aquí en el cliente.
        // El `AuthContext` se inicializa como si no hubiera un usuario.
        // La información del usuario solo estará disponible después de un inicio de sesión exitoso
        // y una vez que el middleware haya permitido el acceso a una ruta protegida.
        // La bandera `isLoading` simplemente indica que la configuración inicial del contexto ha terminado.
        setIsLoading(false);
    }, []);

    // Objeto de valor del contexto que será proporcionado a los componentes hijos
    const valorContexto = {
        usuario,      // { id, email, rol, nombre }
        authToken,    // El token JWT en bruto
        iniciarSesion, // Función para loguear al usuario
        cerrarSesion,  // Función para cerrar la sesión
        isLoading      // Estado de carga inicial
    };

    // Muestra un indicador de carga mientras se verifica el estado de la sesión
    if (isLoading) {
        return <div>Cargando sesión...</div>;
    }

    // Provee el contexto a los componentes hijos
    return (
        <AuthContext.Provider value={valorContexto}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para consumir el contexto de autenticación
const useAuth = () => {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return contexto;
};

// Exportar el proveedor y el hook personalizado
export { AuthProvider, useAuth };