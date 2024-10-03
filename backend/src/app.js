import express from "express";

const app = express();

// Import routes
import usuarioRoutes from "./routes/usuario.routes.js";
import tramiteRoutes from "./routes/tramite.routes.js";
import empleadoRoutes from "./routes/empleado.routes.js";
import departamentoRoutes from "./routes/departamento.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// Middleware
app.use(express.json());

// Routes
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tramites", tramiteRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/departamentos", departamentoRoutes);

// Routes Admin
app.use("/api/admin", adminRoutes);

export default app;
