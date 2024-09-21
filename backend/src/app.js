import express from "express";

const app = express();

// Import routes
import usuarioRoutes from "./routes/usuario.routes.js";
import tareaRoutes from "./routes/tarea.routes.js";

// Middleware
app.use(express.json());

// Routes
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tareas", tareaRoutes);

export default app;
