// Usamos las variables de entorno. Es crucial especificar la ruta a .env.local
// para asegurar que las variables se carguen correctamente para Knex.
require('dotenv').config({ path: '../../.env.local' }); // <--- ¡Ajuste importante aquí!

//Exportamos la configuración de knex para realizar la conexion a la base de datos
// pasando las variables para la conexion a traves de las variables de entorno
module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        }
    }
}
