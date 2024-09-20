import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import defineUsuario from "./models/Usuario.js";

const app = express();
app.use(express.json()); //Indicar a Express que vamos a recibir datos en forma de JSON

dotenv.config(); // Escanea y busca el archivo .env

const PORT = process.env.PORT || 3000;

// conectarDB();

/*Codigo ´por probar */
// Conectar a la base de datos
const sequelize = await conectarDB();

// Definir el modelo pasándole la instancia de Sequelize
const Usuario = defineUsuario(sequelize);

// Sincronizar los modelos
sequelize
  .sync()
  .then(() => {
    console.log("Tablas sincronizadas correctamente");
  })
  .catch((error) => {
    console.error("Error al sincronizar las tablas:", error);
  });

// Routing
app.use("/api/usuarios", usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando por el puerto: ${PORT}`);
});
