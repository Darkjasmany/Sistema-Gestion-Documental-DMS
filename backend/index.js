import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
// import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();
app.use(express.json()); //Indicar a Express que vamos a recibir datos en forma de JSON

dotenv.config(); // Escanea y busca el archivo .env

const PORT = process.env.PORT || 3000;

conectarDB();

// Routing
// app.use("/api/usuarios", usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando por el puerto: ${PORT}`);
});
