import cors from "cors";
import express from "express";
import morgan from "morgan";
import { corsConfig } from "./config/cors.js";
import { conectarDB } from "./config/database.js";
import authRoutes from "./modules/auth/routes/authRoutes.js";

conectarDB();

const app = express();

app.use(cors(corsConfig));

app.use(express.json());

app.use(morgan("dev"));

// app.use("/uploads", express.static("uploads")); // Sirve la carpeta "uploads" como estática
app.use("/home/jasmany/uploads/", express.static("/home/jasmany/uploads/")); // Sirve la carpeta "uploads" como estática

app.use("/api/auth", authRoutes);

export default app;
