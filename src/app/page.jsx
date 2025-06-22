// app/page.jsx
"use client"; // ¡IMPORTANTE! Este componente debe ser de cliente

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Usamos useRouter de next/navigation para el App Router
import HomeForm from '@/components/HomeForm'; // Ajusta la ruta si tu componente HomeForm está en otro lugar
import { ServiceCarousel } from '@/components/ServiceCarousel';

// Asegúrate de que tu AuthContext esté bien definido y adaptado para el App Router.
// Si tu AuthContext.jsx está en `context/AuthContext.jsx` y este archivo es `app/page.jsx`
// la ruta sería '../context/AuthContext';
import { useAuth } from '@/context/AuthContext';


export default function HomePage() { // Renombré a HomePage para la convención del App Router
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { iniciarSesion, usuario } = useAuth();

  // Verificar si ya hay un usuario logueado y redirigir
  // Esto se activa cada vez que `user` o `router` cambian.
  useEffect(() => {
    if (usuario) {
      // Redirigir al dashboard específico del rol
      // Asegúrate de que las rutas '/admin', '/tecnico', '/usuario' existan
      router.replace(`/${usuario.rol}`);
    }
  }, [usuario, router]); // Dependencias del useEffect

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
      // *** CAMBIO CLAVE: Apunta al API Route de Next.js ***
      const response = await fetch('/api/auth/login', { // Ruta relativa
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Si la respuesta es OK, significa que el login fue exitoso.
        // Pasa SOLO el token a iniciarSesion. El contexto se encargará de decodificarlo.
        if (data.token) {
          iniciarSesion(data.token); // <--- ¡CORRECCIÓN CLAVE AQUÍ!
          router.push('/dashboard'); // Redirige a tu dashboard o página principal del usuario
        } else {
          setError('Respuesta de éxito inesperada: No se recibió un token.');
        }
      } else {
        // Si la respuesta no es OK (ej. 401, 500), muestra el mensaje de error del backend
        setError(data.message || 'Error al iniciar sesión. Credenciales incorrectas.');
      }
    } catch (error) {
      setError(`Error: ${error.message || 'Hubo un problema al iniciar sesión. Por favor, intenta de nuevo.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const carouselItems = [
    { titulo: "Servicio Eléctrico Residencial", descripcion: "Soluciones completas para tu hogar con garantía de 2 años", imageUrl: "/assets/images/servicecarousel/servicio_1.png", textoBoton: "Ver Mas" },
    { titulo: "Servicio Eléctrico otro", descripcion: "Soluciones completas para tu hogar con garantía de 2 años", imageUrl: "/assets/images/servicecarousel/servicio_2.png", textoBoton: "Ver Mas" },
    { titulo: "Servicio otro Residencial", descripcion: "Soluciones completas para tu hogar con garantía de 2 años", imageUrl: "/assets/images/servicecarousel/servicio_3.png", textoBoton: "Ver Mas" },
    { titulo: "Servicio Eléctrico Residencial", descripcion: "Soluciones completas para tu hogar con garantía de 2 años", imageUrl: "/assets/images/servicecarousel/servicio_1.png", textoBoton: "Ver Mas" },
    { titulo: "Servicio Eléctrico otro", descripcion: "Soluciones completas para tu hogar con garantía de 2 años", imageUrl: "/assets/images/servicecarousel/servicio_2.png", textoBoton: "Ver Mas" },
    { titulo: "Servicio otro Residencial", descripcion: "Soluciones completas para tu hogar con garantía de 2 años", imageUrl: "/assets/images/servicecarousel/servicio_3.png", textoBoton: "Ver Mas" }
  ];

  return (
    <div className='flex flex-col items-center'>

      {/* Sección principal con HomeFormulario de login */}
      <section className="
        relative
        lg:h-[500px]
        md:w-[945px]
        lg:w-[1280px]
        max-w-full
      ">
        {/* Capa de fondo con opacidad */}
        <div
          className="
            absolute
            inset-0
            bg-[url(/assets/images/home/imagen_fondo.png)] {/* <--- RUTA CORREGIDA */}
            bg-local
            bg-center
            bg-cover
            h-auto
            opacity-80"
        ></div>

        {/* Contenido principal */}
        <div className={error !== '' ? 'relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-10' : 'relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-22'}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-4 md:gap-12 items-center h-full my-7 md:my-0">
              {/* Texto principal */}
              <div className="">
                <h2 className="text-4xl font-bold text-gray-950 mb-6 text-shadow-lg">Calidad y precisión en cada conexión</h2>
                <p className="text-lg text-white mb-8 font-semibold text-shadow-lg">
                  Cotiza y agenda tu servicio de manera rápida y confiable, con la mejor atención y el respaldo de técnicos altamente experimentados. Garantizamos soluciones eléctricas seguras y de calidad para tu tranquilidad.
                </p>
              </div>

              {/* HomeFormulario de inicio de sesión */}
              <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg">
                <HomeForm
                  onSubmit={handleLogin}
                  styles="space-y-4"
                  inputs={[
                    {
                      label: 'Correo electronico',
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
        </div>
      </section>

      {/* Sección de "Agenda Tu servicio" */}
      <section className="
        mx-auto
        max-h-screen
        grid grid-cols-2
        md:grid-cols-5
        lg:grid-cols-3
        bg-white
        h-[400px]
        md:h-[500px]
        md:w-[945px]
        lg:w-[1280px]
        max-w-full
      ">
        <div className="my-auto flex flex-col px-4 sm:px-10 py-4 col-span-2 md:col-span-3 lg:col-span-2">
          <h2 className='text-4xl lg:text-7xl font-bold'>
            Agenda Tu Servicio
          </h2>
          <p className='py-6 text-lg font-semibold'>
            Agenda el servicio que necesitas y recibe una visita técnica para evaluar tu requerimiento. Nuestro equipo especializado realizará un análisis detallado y te proporcionará una cotización precisa para continuar con la solución más adecuada.
          </p>
          <button className="cursor-pointer inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors justify-center max-w-xs mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            ¡Agenda AQUI!
          </button>
        </div>
        {/* <img src="/src/assets/images/home/imagen_fondo_agendar.png" alt="" className='max-h-screen min-h-[500px] hidden md:block md:col-span-2 lg:col-span-1 box-border' /> */}
        {/* Cambiado a div con fondo para consistencia con bg-[url] */}
        <div className='max-h-screen min-h-[500px] hidden md:block md:col-span-2 lg:col-span-1 box-border bg-[url(/assets/images/home/imagen_fondo_agendar.png)] bg-cover bg-center'></div>
      </section>

      {/* Sección carrusel de servicios */}
      <section className='
        bg-[url(/assets/images/home/imagen_fondo_servicios.png)] bg-local
        bg-cover
        bg-center
        max-w-full
        h-[560px]
        md:w-[945px]
        lg:w-[1280px]
      '>
        <ServiceCarousel items={carouselItems} />
      </section>

      {/* Sección "Nose revisar" (Asumo que es una sección "Sobre Nosotros" o similar) */}
      <section className='
        bg-[url(/assets/images/home/imagen_fondo_nosotros.png)] bg-local {/* <--- RUTA CORREGIDA */}
        bg-cover
        bg-center
        max-w-full
        h-[560px]
        w-full
        md:w-[945px]
        lg:w-[1280px]
        flex
        justify-center
        items-center'>
        <div className='text-center w-2xl lg:w-8xl xl:w-4xl flex flex-col items-center bg-gray-950 py-15 px-10 lg:px-25 rounded-2xl my-10 m-4 sm:m-0'>
          {/* Si usas el componente Image de Next.js, deberías importarlo y usarlo así:
          import Image from 'next/image';
          ...
          <Image
            src="/assets/images/navbar/logo_miat_rojo.png" // <--- RUTA CORREGIDA
            alt="logo miat"
            width={160} // Ancho en píxeles
            height={40} // Alto en píxeles
            className='w-40 lg:w-50 mb-4' // Mantén tus clases de Tailwind
          />
          */}
          <img
            src="/assets/images/navbar/logo_miat_rojo.png" // <--- RUTA CORREGIDA
            alt="logo miat"
            className='w-40 lg:w-50 mb-4'
          />
          <p className='font-semibold lg:font-bold text-white text-md lg:text-xl'>Nuestras cotizaciones son detalladas y transparentes, permitiéndote conocer el costo estimado de tu servicio antes de aprobarlo. A través del sistema, podrás verificar cada cotización y decidir si aceptarla o rechazarla, asegurando que tengas el control total sobre tu solicitud.</p>
        </div>
      </section>
    </div>
  );
};