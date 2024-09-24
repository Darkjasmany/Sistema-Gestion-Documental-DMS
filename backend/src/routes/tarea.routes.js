import { Router } from "express";
import {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  obtenerAllTareas,
} from "../controllers/tarea.controller.js";

const router = Router();

router.route("/").post(agregarTarea).get(obtenerAllTareas);

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
