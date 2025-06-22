// src/components/Navbar.jsx
"use client"; // Indicamos que es un componente de cliente

import React, { useState, useEffect } from 'react'; // Importamos React y los Hooks
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // Importamos useRouter y usePathname de next/navigation
import { useAuth } from '@/context/AuthContext';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    // Obtener el estado del usuario, la función de cerrar sesión y el estado de carga del AuthContext
    const { usuario, cerrarSesion, isLoading } = useAuth();

    const [isOpen, setIsOpen] = useState(false); // Para el menú móvil

    // No necesitamos un useEffect aquí para leer localStorage,
    // el estado `usuario` del contexto ya lo maneja de forma centralizada.

    const handleLogout = () => {
        cerrarSesion(); // Llama a la función de cerrar sesión de tu contexto
        // El cerrarSesion del contexto ya redirige a la raíz, así que no necesitamos router.push aquí a menos que quieras otra página.
        // router.push('/'); // Mantener si quieres una redirección específica después de cerrar sesión
    };

    let navigation = [];
    if (usuario && usuario.rol === 'admin') {
        navigation = [
            { name: 'Inicio', to: '/admin' },
            { name: 'Gestionar Usuarios', to: '/admin/usuarios' },
            { name: 'Visitas Tecnicas', to: '/admin/visitatecnica' },
            { name: 'Cotizaciones', to: '/admin/cotizaciones' },
            { name: 'Servicios e Informes', to: '/admin/servicios' },
        ];
    } else if (usuario && usuario.rol === 'usuario') {
        navigation = [
            { name: 'Inicio', to: '/usuario' },
            { name: 'Visitas Tecnicas', to: '/usuario/visitatecnica' },
            { name: 'Cotizaciones', to: '/usuario/cotizaciones' },
            { name: 'Servicios e Informes', to: '/usuario/serviciosinformes' },
            { name: 'Contacto', to: '/contacto' },
        ];
    } else if (usuario && usuario.rol === 'tecnico') {
        navigation = [
            { name: 'Inicio', to: '/tecnico' },
            { name: 'Visitas Asignadas', to: '/tecnico/visitasasignadas' },
            { name: 'Cotizaciones', to: '/tecnico/cotizaciones' },
            { name: 'Servicios e informes', to: '/tecnico/serviciosinformes' },
        ];
    } else {
        navigation = [
            { name: 'Inicio', to: '/' },
            { name: 'Servicios', to: '/servicios' },
            { name: 'Contactanos', to: '/contacto' },
            { name: 'Quienes somos', to: '/quienessomos' },
        ];
    }

    // Función para determinar si un enlace está activo usando usePathname
    const isActive = (path) => {
        // Para la ruta raíz, debe ser una coincidencia exacta
        if (path === '/') {
            return pathname === '/';
        }
        // Para otras rutas, verifica si la ruta actual comienza con la ruta del enlace
        return pathname.startsWith(path);
    };

    // Opcional: Mostrar un indicador de carga o simplemente no renderizar el navbar
    // mientras el AuthContext está inicializando el estado de autenticación.
    if (isLoading) {
        return null; // O un esqueleto de carga para el navbar
    }

    return (
        <nav className="shadow-md min-h-[60px]">
            <div className="mx-auto w-full px-2 sm:px-5 lg:px-8">
                <div className="relative flex items-center justify-around">
                    <div className="absolute inset-y-0 left-0 flex items-center xl:hidden">
                        {/* Botón del menú móvil */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="cursor-pointer inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white mt-3"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center xl:items-stretch xl:justify-around mt-3 xl:mt-0">
                        <div className="flex shrink-0 items-center">
                            {/* Usa el componente Image de Next.js para optimización, si quieres */}
                            {/* Asegúrate de que tu next.config.js tenga configurados los dominios de imagen si son externos */}
                            <img
                                alt="Logo miat"
                                src="/assets/images/navbar/logo_miat_rojo.png"
                                className="h-8 w-auto"
                            />
                            <p className="text-3xl font-bold">MIAT</p>
                        </div>
                        <div className="hidden ml-2 sm:ml-6 xl:block bg-red-500 py-3 px-7 rounded-full my-2">
                            <div className="flex space-x-4 items-center">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.to}
                                        href={item.to}
                                        className={classNames(
                                            isActive(item.to)
                                                ? 'bg-white text-black rounded-sm px-2 text-sm font-semibold text-center'
                                                : 'text-black hover:bg-white rounded-sm px-2 text-sm font-semibold text-center'
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {/* Botón de cerrar sesión */}
                        <div className="absolute inset-y-0 -right-3 xl:flex items-center pr-2 xl:static xl:inset-auto xl:ml-1 xl:pr-0 mt-2 xl:mt-0">
                            <a
                                className={
                                    !usuario ? "hidden" : "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-700 hover:text-white border-2 border-gray-200 cursor-pointer rounded-4xl text-center"
                                }
                                role="menuitem"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleLogout();
                                }}
                            >
                                <span className='hidden xl:block'>Cerrar sesión</span>
                                <div className='block xl:hidden'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.9} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menú móvil */}
            <div className={`xl:hidden ${isOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.to}
                            href={item.to}
                            className={classNames(
                                isActive(item.to)
                                    ? 'bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium block'
                                    : 'text-gray-700 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium block cursor-pointer'
                            )}
                            onClick={() => setIsOpen(false)} // Cerrar el menú al hacer clic
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};