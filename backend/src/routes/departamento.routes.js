import { Router } from "express";
import {
  cargarDepartamentos,
  obtenerDepartamento,
  actualizarDepartamento,
  eliminarDepartamento,
} from "../controllers/departamento.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", cargarDepartamentos);

// TODO: Validacion para que solo la ruta pueda revisarla el usuario ADMIN
router
  .route("/:id")
  .get(obtenerDepartamento)
  .put(actualizarDepartamento)
  .delete(eliminarDepartamento);
// .get(checkAuth, obtenerDepartamento)
// .put(checkAuth, actualizarDepartamento)
// .delete(checkAuth, eliminarDepartamento);

export default router;
