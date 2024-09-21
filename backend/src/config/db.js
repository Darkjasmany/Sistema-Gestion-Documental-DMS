import { Sequelize } from "sequelize"; // Importar el ORM de Sequelize
import dotenv from "dotenv";

dotenv.config(); // Cargar el archivo .env

export const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432, // Puerto
    dialect: "postgres", // Dialecto (en este caso, PostgreSQL)
    logging: false, // Opcional: desactiva el logging de SQL en la consola
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Verificar la conexión
(async () => {
  try {
    await sequelize.authenticate();
    const res = await sequelize.query("SELECT NOW()");
    console.log(
      `PostgreSQL conectado en: ${sequelize.config.host}:${sequelize.config.port} - Hora actual: ${res[0][0].now}`
    );
  } catch (error) {
    console.error(`Error de conexión a PostgreSQL: ${error.message}`);
    process.exit(1); // Termina el proceso en caso de error
  }
})();
