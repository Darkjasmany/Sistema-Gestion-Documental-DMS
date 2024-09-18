import pg from "pg"; // Importar el cliente de PostgreSQL

const conectarDB = async () => {
  try {
    // Crear una nueva instancia de Pool
    const Pool = pg.Pool;
    const pool = new Pool({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
    });

    // console.log(pool);

    // Verificar conexión
    const res = await pool.query("SELECT NOW()");
    console.log(
      `PostgreSQL conectado en: ${pool.options.host}:${pool.options.port} - Hora actual: ${res.rows[0].now}`
    );
    return pool; // Devuelve el pool para ser usado en otros módulos si es necesario
  } catch (error) {
    console.error(`Error de conexión a PostgreSQL: ${error.message}`);
    process.exit(1); // Salir del proceso si hay un error de conexión
  }
};

export default conectarDB;
