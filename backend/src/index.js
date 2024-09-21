import app from "./app.js";
import { sequelize } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config(); // Escanea y busca el archivo .env

async function main() {
  try {
    await sequelize.sync({ force: false }); // force o alter

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando por el puerto: ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

main();
