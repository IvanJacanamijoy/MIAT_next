// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Asegúrate de tener cualquier otra configuración que uses aquí
  // Por ejemplo: experimental: { appDir: true } si lo tienes

  webpack: (config, { isServer }) => {
    // Si no estamos en el servidor (es decir, estamos en el cliente),
    // queremos que Knex y TODOS los drivers de base de datos sean "externos".
    // Esto evita que Webpack intente empaquetarlos en el bundle del navegador.
    if (!isServer) {
      config.externals.push(
        'knex',          // Excluir la biblioteca Knex completa
        'oracledb',      // Excluir dialectos específicos que Knex intenta resolver
        'mssql',
        'tedious',
        'pg',
        'pg-native',
        'pg-query-stream', // ¡Añadimos este explícitamente!
        'sqlite3',
        'mysql2'         // <--- Importante: Excluir también tu driver de MySQL para el cliente
      );
    }

    // Cuando estamos en el servidor, solo necesitamos excluir los dialectos que NO usamos.
    // Knex y mysql2 sí son necesarios en el servidor.
    if (isServer) {
      config.externals.push(
        'oracledb',
        'mssql',
        'tedious',
        'pg',
        'pg-native',
        'pg-query-stream', // ¡Añadimos este explícitamente también para el servidor!
        'sqlite3'
        // NOTA: 'mysql2' NO está aquí, ya que es el driver que sí usas en el servidor.
      );
    }

    return config;
  },
};

export default nextConfig;