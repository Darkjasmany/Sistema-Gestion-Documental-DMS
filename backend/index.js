import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

dotenv.config(); // Escanea y busca el archivo .env

const app = express();

const PORT = process.env.PORT || 3000;

conectarDB();

// Routing
app.use("/api/usuarios", usuarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando por el puerto: ${PORT}`);
});
