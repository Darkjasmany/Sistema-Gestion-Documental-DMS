import express from "express";
import cors from "cors"; // Proteger una API para evitar que los datos no se consuman de alguien que no sabemos

// Import routes
import adminRoutes from "./modules/administration/routes/admin.routes.js";
import usuarioRoutes from "./modules/administration/routes/usuario.routes.js";
import empleadoRoutes from "./modules/administration/routes/empleado.routes.js";
import departamentoRoutes from "./modules/administration/routes/departamento.routes.js";
import tramiteRoutes from "./modules/document-management/routes/tramite.routes.js";
import despachadorRoutes from "./modules/document-management/routes/despachador.routes.js";

const app = express();

const dominiosPermitidos = [process.env.FRONTEND_URL, "http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    //origin : URL de la peticion que esta realizando a la API, -1 no lo encontro

    // Permitir solicitudes sin origen (por ejemplo, Postman) o si el origen está en la lista de permitidos
    if (!origin || dominiosPermitidos.indexOf(origin) !== -1) {
      //Esta es para que solo permita 1 dominio
      // if (dominiosPermitidos.indexOf(origin) !== -1) {
      // El Origen del Request esta permitido
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

// Middleware
app.use(cors(corsOptions)); // Habilita CORS para todas las rutas
app.use(express.json());

// Servir archivos estáticos
// app.use("/uploads", express.static("uploads")); // Sirve la carpeta "uploads" como estática
app.use("/home/jasmany/uploads/", express.static("/home/jasmany/uploads/")); // Sirve la carpeta "uploads" como estática

// Routes
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/tramites", tramiteRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/departamentos", departamentoRoutes);
app.use("/api/despachadores", despachadorRoutes);
app.use("/api/admin", adminRoutes);

/*

// Middleware para manejo de errores
app.use(notFound); // Manejar rutas no encontradas
app.use(errorHandler); // Manejar errores de la aplicación
*/
export default app;
