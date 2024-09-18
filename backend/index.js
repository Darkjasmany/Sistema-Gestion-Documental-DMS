import express from "express";
import dotenv from "dotenv";

dotenv.config(); // Escanea y busca el archivo .env

const app = express();
const PORT = process.env.PORT || 3000;

// Routing
app.use("/", (req, res) => {
  console.log("Hola Mundo");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando por el puerto: ${PORT}`);
});
