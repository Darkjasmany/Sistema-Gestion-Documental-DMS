import { Sequelize } from "sequelize"; // Importar el ORM de Sequelize

// Crear una instancia de Sequelize
export const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT || 5432, // Puerto
    dialect: "postgres", // Dialecto (en este caso, PostgreSQL)
    timezone: "America/Guayaquil", // Zona horaria de Ecuador
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
export const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Autenticación exitosa con la base de datos.");

    await sequelize.sync();
    //await sequelize.sync({ force: true });
    console.log("Modelos sincronizados correctamente.");

    const res = await sequelize.query("SELECT NOW()");
    console.log(
      `PostgreSQL conectado en: ${sequelize.config.host}:${sequelize.config.port} - Hora actual: ${res[0][0].now}`
    );
  } catch (error) {
    console.error(`Error de conexión a PostgreSQL: ${error.message}`);
    process.exit(1); // Termina el proceso si ocurre un error
  }
};
