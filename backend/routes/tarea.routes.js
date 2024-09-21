import express from "express";
import {
  agregarTarea,
  obtenerTareas,
} from "../controllers/tarea.controller.js";

const router = express.Router();

router.get("/tarea", obtenerTareas);
router.post("/tarea", agregarTarea);
router.put("/tarea/:id");
router.delete("/tarea/:id");
router.get("/tarea/:id");
export default router;
