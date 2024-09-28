import express from "express";

const app = express();

// Import routes
import usuarioRoutes from "./routes/usuario.routes.js";
import tramiteRoutes from "./routes/tramite.routes.js";

// Middleware
app.use(express.json());

// Routes
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tramites", tramiteRoutes);

export default app;
