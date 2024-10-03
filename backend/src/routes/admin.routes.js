import { Router } from "express";
import { checkAuth, isAdmin } from "../middlewares/auth.middleware.js";
import * as adminController from "../controllers/admin.controller.js";
const router = Router();

// Ruta para listar todos los trámites
router
  .route("/tramites")
  .get(checkAuth, isAdmin, adminController.listarTodosLosTramites);

// Ruta para listar todos los empleados
router
  .route("/empleados")
  .get(checkAuth, isAdmin, adminController.listarTodosLosEmpleados);

// Ruta para listar todos los empleados
router
  .route("/departamentos")
  .get(checkAuth, isAdmin, adminController.listarTodosLosDepartamentos);

export default router;
