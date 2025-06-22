//componente que recibe un titulo, una descripción, una imagen y texto para un boton
const CardService = ({ titulo, descripcion, imageUrl, textoBoton }) => {
    return (
        <div className="bg-red-500 max-w-72 rounded-xl shadow-lg overflow-hidden  duration-300 hover:shadow-xl mx-auto">
            <div className="h-full flex flex-col">
                <div className="h-48 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={titulo}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-8 min-h-72 flex flex-col justify-between">
                    <h3 className="text-3xl font-bold mb-3">
                        {titulo}
                    </h3>
                    <p className="mb-3">
                        {descripcion}
                    </p>
                    <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 mx-auto cursor-pointer">
                        {textoBoton}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CardService;