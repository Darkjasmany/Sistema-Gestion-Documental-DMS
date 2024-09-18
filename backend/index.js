import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";

dotenv.config(); // Escanea y busca el archivo .env

const app = express();

const PORT = process.env.PORT || 3000;

conectarDB();

// Routing
app.use("/", (req, res) => {
  console.log("Hola Mundo");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando por el puerto: ${PORT}`);
});
