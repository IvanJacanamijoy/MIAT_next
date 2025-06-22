//importamos knex y pasamos la configuracion para la conexion a la base de datos
const knex = require('knex')(require('../config/knexfile').development);


class ServicioModel {
    /**
     * Obtiene un servicio por su ID, con detalles de la cotización, diagnóstico y usuarios.
     * @param {number} id - El ID del servicio.
     * @returns {object|null} El objeto de servicio o null si no se encuentra.
     */
    async getById(id) {
        const servicio = await knex('Servicio as S')
            .select(
                'S.*',
                'C.CostoMateriales', 'C.CostoManoObra', 'C.PrecioTotal', 'C.Garantia', 'C.Observaciones as CotizacionObservaciones',
                'D.Descripcion as DiagnosticoDescripcion', 'D.Medidas', 'D.Materiales as DiagnosticoMateriales', 'D.FotoDiagnostico',
                'CS.Fecha as CitaFecha', 'CS.Hora as CitaHora', 'CS.Direccion as CitaDireccion',
                'Cliente.Nombres as ClienteNombres', 'Cliente.Apellidos as ClienteApellidos', 'Cliente.Email as ClienteEmail',
                'Tecnico.Nombres as TecnicoNombres', 'Tecnico.Apellidos as TecnicoApellidos', 'Tecnico.Email as TecnicoEmail',
                'ES.Descripcion as EstadoServicioDescripcion',
                'EC.Descripcion as EstadoCotizacionDescripcion'
            )
            .join('Cotizacion as C', 'S.IdCotizacion', '=', 'C.IdCotizacion')
            .join('Diagnostico as D', 'C.IdDiagnostico', '=', 'D.IdDiagnostico')
            .join('VisitaTecnica as VT', 'D.IdVisita', '=', 'VT.IdVisita')
            .join('CitaServicio as CS', 'VT.IdCita', '=', 'CS.IdCita')
            .join('Usuario as Cliente', 'S.IdCliente', '=', 'Cliente.IdUsuario')
            .join('Usuario as Tecnico', 'S.IdTecnico', '=', 'Tecnico.IdUsuario')
            .join('Estado as ES', 'S.IdEstado', '=', 'ES.IdEstado')
            .join('Estado as EC', 'C.IdEstado', '=', 'EC.IdEstado')
            .where('S.IdServicio', id)
            .first(); // Usar .first() para obtener solo el primer resultado

        if (!servicio) return null;

        // Obtener los tipos de servicio asociados
        const tiposServicio = await knex('ServicioTipoServicio as STS')
            .select('TS.IdTipoServicio', 'TS.Descripcion')
            .join('TipoServicio as TS', 'STS.IdTipoServicio', '=', 'TS.IdTipoServicio')
            .where('STS.IdServicio', id);

        servicio.TiposServicio = tiposServicio;

        return servicio;
    }

    /**
     * Obtiene todos los servicios, con opciones de filtrado, paginación y unión de tablas.
     * param {object} filters - Objeto con filtros (ej. { clienteId, tecnicoId, estadoId, tipoServicioId }).
     * param {object} options - Opciones de paginación (ej. { limit, offset, orderBy, orderDirection }).
     * returns {Array<object>} Array de objetos de servicio.
     */
    async getAll(filters = {}, options = {}) {
        const query = knex('Servicio as S')
            .select(
                'S.IdServicio', 'S.Descripcion', 'S.FotosAntes', 'S.FotosDespues', 'S.HoraInicial', 'S.HoraFinal', 'S.Observaciones',
                'S.IdCliente', 'S.IdTecnico', 'S.IdCotizacion', 'S.IdEstado',
                'C.CostoMateriales', 'C.CostoManoObra', 'C.PrecioTotal',
                'Cliente.Nombres as ClienteNombres', 'Cliente.Apellidos as ClienteApellidos',
                'Tecnico.Nombres as TecnicoNombres', 'Tecnico.Apellidos as TecnicoApellidos',
                'ES.Descripcion as EstadoServicioDescripcion',
                knex.raw('GROUP_CONCAT(TS.Descripcion SEPARATOR \', \') AS TiposServicio')
            )
            .join('Cotizacion as C', 'S.IdCotizacion', '=', 'C.IdCotizacion')
            .join('Usuario as Cliente', 'S.IdCliente', '=', 'Cliente.IdUsuario')
            .join('Usuario as Tecnico', 'S.IdTecnico', '=', 'Tecnico.IdUsuario')
            .join('Estado as ES', 'S.IdEstado', '=', 'ES.IdEstado')
            .leftJoin('ServicioTipoServicio as STS', 'S.IdServicio', '=', 'STS.IdServicio')
            .leftJoin('TipoServicio as TS', 'STS.IdTipoServicio', '=', 'TS.IdTipoServicio');

        // Aplicar filtros
        if (filters.clienteId) {
            query.where('S.IdCliente', filters.clienteId);
        }
        if (filters.tecnicoId) {
            query.where('S.IdTecnico', filters.tecnicoId);
        }
        if (filters.estadoId) {
            query.where('S.IdEstado', filters.estadoId);
        }
        if (filters.cotizacionId) {
            query.where('S.IdCotizacion', filters.cotizacionId);
        }
        // ... otros filtros

        // === ESTA ES LA CLÁUSULA CRUCIAL QUE PROBABLEMENTE TE FALTA O ESTÁ MAL UBICADA ===
        // Agrupa los resultados por el ID único de cada servicio.
        // Esto asegura que GROUP_CONCAT funcione por cada servicio, no para toda la consulta.
        query.groupBy('S.IdServicio');
        // ===============================================================================

        // Ordenamiento
        const orderBy = options.orderBy || 'IdServicio';
        const orderDirection = options.orderDirection || 'DESC';
        query.orderBy(orderBy, orderDirection);

        // Paginación
        if (options.limit) {
            query.limit(options.limit);
        }
        if (options.offset) {
            query.offset(options.offset);
        }

        const rows = await query;
        return rows;
    }

}

module.exports = new ServicioModel();