import { useState, useEffect } from 'react';
import CardService from './CardService';
import NavigationArrows from './NavigationArrows';

/*componente service carousel
el  componente recibe unos items



*/

const ServiceCarousel = ({ items }) => {
  const [indiceActual, setIndiceActual] = useState(0);

  //revisar este codigo
  const [serviciosVisibles, setserviciosVisibles] = useState(1);
  const [anchoCardServicio, setanchoCardServicio] = useState('100%');

  // Ajustar el número de tarjetas visibles según el ancho de pantalla
  //revisar
  useEffect(() => {
    const updateServiciosVisibles = () => {
      const width = window.innerWidth;
      if (width < 640) { // Mobile
        setserviciosVisibles(1);
        setanchoCardServicio('100%');
      } else if (width < 1024) { // Tablet grande
        setserviciosVisibles(2);
        setanchoCardServicio('50%');
      } else { // Desktop
        setserviciosVisibles(3);
        setanchoCardServicio('33%');
      }
    };

    updateServiciosVisibles();
    window.addEventListener('resize', updateServiciosVisibles);
    return () => window.removeEventListener('resize', updateServiciosVisibles);
  }, []);


  const deslizarSiguiente = () => {
    setIndiceActual((prev) => {
      const indiceMaximo = Math.ceil(items.length - serviciosVisibles);
      return prev >= indiceMaximo ? 0 : prev + 1;
    });
  };

  const deslizarAnterior = () => {
    setIndiceActual((prev) => {
      prev === 0 ? Math.floor(items.length - serviciosVisibles) : prev - 1
    });
  };


  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6">
      {/* Contenedor del carrusel */}
      <div className='relative overflow-hidden'>
        {/* Carrusel */}
        <div
          className="flex transition-transform duration-300 ease-in-out py-10"
          style={{
            transform: `translateX(-${indiceActual * (100/serviciosVisibles)}%)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: anchoCardServicio }}
            >
              <div className="px-2">
                <CardService {...item} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controles */}
      <NavigationArrows vistaAnterior={deslizarAnterior} VistaSiguiente={deslizarSiguiente} />
    </div>
  );
};

export default ServiceCarousel;