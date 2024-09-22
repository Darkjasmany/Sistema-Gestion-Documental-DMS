import { Router } from "express";
import {
  agregarTarea,
  obtenerTareas,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
} from "../controllers/tarea.controller.js";

const router = Router();

router.route("/").post(agregarTarea).get(obtenerTareas);

router
  .route("/:id")
  .get(obtenerTarea)
  .put(actualizarTarea)
  .delete(eliminarTarea);

// router.get("/", obtenerTareas);
// router.post("/tarea", agregarTarea);
// router.put("/tarea/:id");
// router.delete("/tarea/:id");
// router.get("/tarea/:id");
export default router;
