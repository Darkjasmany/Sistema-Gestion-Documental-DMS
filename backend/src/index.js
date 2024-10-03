import app from "./app.js"; // Importamos la app con Express configurado
import { conectarDB } from "./config/db.js"; // Importamos la conexión a la base de datos

// Función principal para iniciar la aplicación
const startServer = async () => {
  try {
    await conectarDB(); // Conectar a la base de datos

    const PORT = process.env.PORT ?? 3000;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando por el puerto: ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

// Inicializa la App
startServer();
