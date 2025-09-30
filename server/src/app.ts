import express from "express";
import cors from "cors";
import morgan from "morgan";
import { corsConfig } from "./config/cors.js";
import { conectarDB } from "./config/db.js";

// Import routes
// import adminRoutes from "./modules/administration/routes/admin.routes.js";
// import usuarioRoutes from "./modules/administration/routes/usuario.routes.js";
// import empleadoRoutes from "./modules/administration/routes/empleado.routes.js";
// import departamentoRoutes from "./modules/administration/routes/departamento.routes.js";
// import tramiteRoutes from "./modules/document-management/routes/tramite.routes.js";
// import despachadorRoutes from "./modules/document-management/routes/despachador.routes.js";

conectarDB();

const app = express();

app.use(cors(corsConfig));

app.use(express.json());

app.use(morgan("dev"));

// app.use("/uploads", express.static("uploads")); // Sirve la carpeta "uploads" como estática
app.use("/home/jasmany/uploads/", express.static("/home/jasmany/uploads/")); // Sirve la carpeta "uploads" como estática

// Routes
// app.use("/api/usuarios", usuarioRoutes);
// app.use("/api/tramites", tramiteRoutes);
// app.use("/api/empleados", empleadoRoutes);
// app.use("/api/departamentos", departamentoRoutes);
// app.use("/api/despachadores", despachadorRoutes);
// app.use("/api/admin", adminRoutes);

export default app;
