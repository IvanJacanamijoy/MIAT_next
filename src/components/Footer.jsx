
export default function Footer () {

  const images = {
    logo_miat_negro: '/assets/images/footer/logo_miat_negro.png',
    logo_telefono: '/assets/images/footer/logo_telefono.png',
    logo_gmail: '/assets/images/footer/logo_gmail.png',
    logo_whatsapp: '/assets/images/footer/logo_whatsapp.png',
  }

  return (
    <footer className="bg-red-500 py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 h-auto">
      <div className="max-w-full mx-auto">
        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Sección del logo */}
          <div className="flex flex-col items-center mb-4">
            <img
              src={images.logo_miat_negro}
              alt="Logo miat"
              className="h-24 w-auto"
            />
            <span className="ml-2 text-white text-md font-semibold">Politica de privacidad</span>
            <span className="ml-2 text-white text-md font-semibold">Politica de cookies</span>

          </div>

          {/* Sección "Qué podemos hacer por ti" */}
          <div className="text-center md:text-left mb-4">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Qué podemos hacer por ti</h2>
            <ul className="space-y-2 flex flex-col items-center">
              <li>
                <a href="#" className="text-white hover:text-gray-900 transition-colors block">
                  Contactanos
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-900 transition-colors block">
                  Iniciar Sesión
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-gray-900 transition-colors block">
                  Registrarse
                </a>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div className="text-center sm:items-end">
            <h3 className="text-xl font-bold text-white mb-4">Comunicate con nosotros</h3>
            <div className="space-y-2">
              <div className='flex justify-around max-w-72 m-auto'>
                <a href="#">
                  <img className='h-10 w-auto' src={images.logo_whatsapp} alt="logo de whatsapp" />
                </a>
                <a href="#">
                  <img className='h-10 w-auto' src={images.logo_gmail} alt="logo de gmail" />
                </a>
                <a href="#">
                  <img className='h-10 w-auto' src={images.logo_telefono} alt="logo de telefono" />
                </a>
              </div>
              <a
                href="mailto:miatsoluciones@gmail.com"
                className="text-white hover:text-gray-900 transition-colors inline-block text-lg underline font-semibold"
              >
                miatsoluciones@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-300 pt-6">
          <p className="text-sm text-white text-center">
            © 2024 Edwin y Empresa. Soluciones Electricas HH - Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}