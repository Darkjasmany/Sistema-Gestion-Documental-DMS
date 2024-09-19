import { Sequelize } from "sequelize"; // Importar el ORM de Sequelize

const conectarDB = async () => {
  try {
    // Configurar la conexión a la base de datos PostgreSQL con Sequelize
    const db = new Sequelize(
      process.env.PG_DATABASE,
      process.env.PG_USER,
      process.env.PG_PASSWORD,
      {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT, // Opcional: el puerto por defecto es 5432
        dialect: "postgres",
        logging: false, // Opcional: desactiva el logging de SQL en la consola
        // Pool Conection: Si se conecta a la base de datos desde un solo proceso, debe crear solo una instancia de Sequelize
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        // Datos Adicionales
        define: {
          timestamps: false,
        },
        operatorsAliases: false,
      }
    );
    // Verificar conexión
    const res = await db.query("SELECT NOW()");
    console.log(
      `PostgreSQL conectado en: ${db.config.host}:${db.config.port} - Hora actual: ${res[0][0].now}`
    );
    return db; // Devuelve el pool para ser usado en otros módulos si es necesario
  } catch (error) {
    console.error(`Error de conexión a PostgreSQL: ${error.message}`);
    process.exit(1); // Salir del proceso si hay un error de conexión
  }
};

export default conectarDB;
