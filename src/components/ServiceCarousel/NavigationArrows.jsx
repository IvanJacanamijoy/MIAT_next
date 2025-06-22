//flechas de navegacion resive un valor de vista anterior y un valor de vista siguiente
const NavigationArrows = ({ vistaAnterior, VistaSiguiente }) => {
  return (
    <>
      {/* boton de flecha anterior */}
      <button
        onClick={vistaAnterior}
        className="absolute left-4 top-1/2 z-10 bg-black rounded-full p-2 bg-black/70 shadow-md hover:bg-black transition-colors cursor-pointer"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* boton de flecha siguiente */}
      <button
        onClick={VistaSiguiente}
        className="absolute right-4 top-1/2 -traslate-y-1/2 z-10 bg-black rounded-full p-2 bg-black/70 shadow-md hover:bg-black transition-colors cursor-pointer"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  )
}

export default NavigationArrows;