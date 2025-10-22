import { Sequelize } from "sequelize-typescript";
import { exit } from "node:process";
import colors from "colors";
import { PG_DATABASE, PG_USER, PG_PASSWORD, PG_HOST, PG_PORT } from "./env.js";
import { models } from "../models/index.js";

interface TimeRow {
  now: string;
}

// Crear una instancia de Sequelize
export const sequelize = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  port: Number(PG_PORT) || 5432, // Puerto
  dialect: "postgres", // Dialecto (en este caso, PostgreSQL)
  timezone: "America/Guayaquil", // Zona horaria de Ecuador
  logging: false, // Opcional: desactiva el logging de SQL en la consola
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  models, // Importamos los modelos
});

// Verificar la conexión
export const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(colors.green("✅ Autenticación exitosa con la base de datos."));

    await sequelize.sync();
    //await sequelize.sync({ force: true });
    console.log(colors.magenta("✅ Modelos sincronizados correctamente."));

    const [row] = await sequelize.query("SELECT NOW()");
    const now = (row as TimeRow[])[0]?.now;
    console.log(
      colors.cyan(
        `✅ PostgreSQL conectado en: ${sequelize.config.host}:${sequelize.config.port} - Hora actual: ${now}`
      )
    );
  } catch (error: any) {
    console.error(
      colors.red(`❌ Error de conexión a PostgreSQL: ${error.message}`)
    );
    exit(1); // Termina el proceso si ocurre un error
  }
};
