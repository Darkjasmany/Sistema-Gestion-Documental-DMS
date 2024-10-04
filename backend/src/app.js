import express from "express";
// import {
//   notFound,
//   errorHandler,
// } from "./middlewares/errorHandler.middleware.js";

// Import routes
import usuarioRoutes from "./routes/usuario.routes.js";
import tramiteRoutes from "./routes/tramite.routes.js";
import empleadoRoutes from "./routes/empleado.routes.js";
import departamentoRoutes from "./routes/departamento.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tramites", tramiteRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/departamentos", departamentoRoutes);
app.use("/api/admin", adminRoutes);
/*
// Middleware para manejo de errores
app.use(notFound); // Manejar rutas no encontradas
app.use(errorHandler); // Manejar errores de la aplicación
*/
export default app;
