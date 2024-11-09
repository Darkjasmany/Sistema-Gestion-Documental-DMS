import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";
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

// Ruta para asignar departamento, solo accesible para el admin
router.post(
  "/asignar-departamento",
  isAdmin,
  adminController.asignarDepartamento
);

// Parametros
router
  .route("/parametros")
  .post(checkAuth, adminController.agregarParametros)
  .get(checkAuth, adminController.listarParametros);

router
  .route("/parametros/:id")
  .put(checkAuth, adminController.actualizarParametros)
  .delete(checkAuth, adminController.eliminarParametros);

// Tramite Secuancual
router
  .route("/tramite-secuencia")
  .get(checkAuth, adminController.cargarSecuencia)
  .post(checkAuth, adminController.agregarSecuencia);

router
  .route("/tramite-secuencia/:id")
  .put(checkAuth, adminController.actualizarSecuencia);

export default router;

// TODO, tengo que crear la funcionalidad para que el admin vea todos los usuarios confirmados, seleccione 1 y asigne departamento, asi mismo definir bien las rutas del admin en relacion a la creacion de departamentos y empleados, definir un modelo para los roles
