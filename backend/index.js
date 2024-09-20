import express from "express"; // Importar express
import dotenv from "dotenv";
import { sequelize } from "./config/db.js"; // Importamos la Instancia del Objeto Sequelize
import "./models/Usuario.js";

async function main() {
  try {
    const app = express();
    dotenv.config(); // Escanea y busca el archivo .env

    // await sequelize.authenticate();
    await sequelize.sync();
    const res = await sequelize.query("SELECT NOW()");
    console.log(
      `PostgreSQL conectado en: ${sequelize.config.host}:${sequelize.config.port} - Hora actual: ${res[0][0].now}`
    );

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando por el puerto: ${PORT}`);
    });
  } catch (error) {
    console.error(`Error de conexión a PostgreSQL: ${error.message}`);
    process.exit(1); // Termina el proceso en caso de error
  }
}

main();
