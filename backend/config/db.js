import { Sequelize } from "sequelize"; // Importar el ORM de Sequelize

const conectarDB = async () => {
  try {
    // Crear la instancia de Sequelize
    const sequelize = new Sequelize(
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
        define: {
          timestamps: false, // Opcional: desactiva la creación automática de timestamps en los modelos
        },
      }
    );

    await sequelize.authenticate(); // Probar la conexión

    const res = await sequelize.query("SELECT NOW()");
    console.log(
      `PostgreSQL conectado en: ${sequelize.config.host}:${sequelize.config.port} - Hora actual: ${res[0][0].now}`
    );

    return sequelize; // Devuelve la instancia de Sequelize
  } catch (error) {
    console.error(`Error de conexión a PostgreSQL: ${error.message}`);
    process.exit(1); // Termina el proceso en caso de error
  }
};

export default conectarDB;
