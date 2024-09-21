import express from "express"; // Importar express
import dotenv from "dotenv";
import { sequelize } from "./config/db.js"; // Importamos la Instancia del Objeto Sequelize
import usuarioRoutes from "./routes/usuario.routes.js";
import tareaRoutes from "./routes/tarea.routes.js";

async function main() {
  try {
    // Inicializa Express
    const app = express();

    // Middlewares
    app.use(express.json());

    dotenv.config(); // Escanea y busca el archivo .env

    await sequelize.sync({ force: false }); // force o alter
    console.log("Modelos sincronizados correctamente");

    // Express asi maneja el Routing
    app.use("/api/usuarios", usuarioRoutes);
    app.use("/api/tareas", tareaRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando por el puerto: ${PORT}`);
    });
  } catch (error) {
    console.error(`Error al sincronizar la base de datos: ${error.message}`);
  }
}

main();
