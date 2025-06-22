//importamos knex y pasamos la configuracion para la conexion a la base de datos
// const knex = require('knex')(require('../config/knexfile').development);
const knex = require('knex')(require('@/lib/config/knexfile').development);
//importamos bcrypt para encriptar las contraseñas
const bcrypt = require('bcrypt')

class UsuarioModel {
    /*Obtener una Usuario por ID 
        funcion asincrona que espera el resultado de la consulta ()*/
    async getUsuarioById(id) {
        //intentamos ajecutar la consulta (manejo de errores)
        try {
            //guardamos el primer registro que cumpla con la condicion (IdUsuario = id)
            // y retornamos el resultado de la consulta
            const resultQuery = knex('usuario').where({ IdUsuario: id }).first();
            return resultQuery;
        } catch (error) {
            //en caso de algun error retornamos el error
            return 'Error buscando Usuario con id ' + id + ': ' + error;
        }
    }
    /*Obtener una Usuario por su email 
    funcion asincrona que busca a un usuario por su email*/
    async getUsuarioByEmail(email) {
        /* Manejamos algun posible error */
        try {
            // lanzamos la consulta y en caso de que haya algun resultado se retornara el resultado de dicha consulta
            const resultQuery = knex('usuario').where({ Email: email }).first();
            if (resultQuery) {
                return resultQuery;
            } else {
                // en caso de que no se haya encontrado ningun usuario retornara un mensaje indicando que no se encontro ningun usuario
                return false;
            }
        } catch (error) {
            return error;
        }
    }

    /* Obtener todos los usuarios
    funcion asincrona que espera todos los usuarios*/
    async getTodosLosUsuarios() {
        try {
            const dataUsers = await knex('usuario').select('*');
            return dataUsers;
        } catch (error) {
            return 'Error buscando usuarios: ' + error;
        }
    }
    /* funcion asincrona para encripitar la contraseña */
    async hashPassword(password) {
        if (!password) {
            throw new Error('La contraseña no puede estar vacia')
        }
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt)
    }
    /*Crear una Usuario
        funcion asincrona que espera el resultado de la consulta*/
    async createUsuario(UsuarioData) {
        //intentamos ajecutar la consulta (manejo de errores)
        try {
            //guardamos la contraseña ingresada por el usuario
            const password = UsuarioData.Contraseña;
            //encriptamos la contraseña
            const contraseñaHash = await this.hashPassword(password);
            //guardamos el resultado de la consulta
            const [IdUsuario] = await knex('usuario').insert({
                nombres: UsuarioData.Nombres,
                apellidos: UsuarioData.Apellidos,
                email: UsuarioData.Email,
                identificacion: UsuarioData.Identificacion,
                contraseña: contraseñaHash,
                direccion: UsuarioData.Direccion,
                telefono: UsuarioData.Telefono,
                IdRol: UsuarioData.IdRol,
                IdEstado: 1,
            });
            //guardamos la Usuario recien creada ejecutando una consulta
            const newUsuario = this.getUsuarioById(IdUsuario);
            //retornamos la Usuario creado
            return newUsuario;
        } catch (error) {
            //en caso de algun error retornamos el error
            return 'Error creando un Usuario : ' + error;
        }
    }
    /*Actualizando una Usuario
        funcion asincrona que espera el resultado de la consulta*/
    async updateUsuario(id, UsuarioData) {
        //intentamos ajecutar la consulta (manejo de errores)
        try {
            //guardamos el resultado de la consulta
            const affectRows = await knex('usuario').where({ IdUsuario: id }).update(UsuarioData);
            //si nunguna fue afectada se retorna un string indicando que no se encontro a la Usuario con dicho id
            if (affectRows === 0) {
                return 'No se encontro a la usuario con ese id'
            }
            //devolvemos la Usuario actualizada
            return this.getUsuarioById(id);
        } catch (error) {
            //en caso de algun error retornamos el error
            return 'Error actualizando usuario con id ' + id + ': ' + error;
        }
    }
    /*Eliminando una Usuario
        funcion asincrona que espera el resultado de la consulta*/
    async deleteUsuario(id) {
        //intentamos ajecutar la consulta (manejo de errores)
        try {
            //capturamos la cantidad de filas afectadas
            const affectRows = await knex('usuario').where({ IdUsuario: id }).del();
            return 'se elimino a la Usuario correctamente';
        } catch (error) {
            //en caso de algun error retornamos el error
            return 'Error al eliminar la Usuario con el ' + id + ': ' + error;
        }
    }
    /* Login del usuario
        funcion asincrona para buscar un usuario por email y verificar contraseña */
    async loginUsuario(email, password) {
        try {
            // 1. Buscar al usuario por correo electrónico.
            const usuario = await knex('usuario').where({ Email: email }).first();

            // Si no se encuentra el usuario, retornar false.
            if (!usuario) {
                return false;
            }

            // 2. Comparar la contraseña ingresada con el hash almacenado en la base de datos.
            const contraseñaCoincide = bcrypt.compare(password, usuario.Contraseña);
            // Si las contraseñas coinciden, retornar la información del usuario.
            if (contraseñaCoincide) {
                return this.getUsuarioById(usuario.IdUsuario); // Asumiendo que tienes este método
            }
            // Si la contraseña no coincide, retornar false.
            return false;
        } catch (error) {
            // Manejar errores (logging, etc.)
            console.error('Error al iniciar sesión:', error);
            return false; // Importante: retornar false en caso de error para que el frontend lo maneje
        }
    }
}
//exportamos una instancia del modelo
module.exports = new UsuarioModel();