import { Router } from "express";
import {
  agregarEmpleado,
  cargarEmpleados,
  obtenerEmpleado,
  obtenerEmpleadoPorDepartamento,
  actualizarEmpleado,
  eliminarEmpleado,
} from "../controllers/empleado.controller.js";

const router = Router();

router.route("/").get(cargarEmpleados).post(agregarEmpleado);

router
  .route("/:id")
  .get(obtenerEmpleado)
  .put(actualizarEmpleado)
  .delete(eliminarEmpleado);

router.get("/por-departamento/:departamentoId", obtenerEmpleadoPorDepartamento);

export default router;
