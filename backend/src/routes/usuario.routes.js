import { Router } from "express";
import { perfil, registrar } from "../controllers/usuario.controller.js";
import { obtenerTareas } from "../controllers/tarea.controller.js";

const router = Router();

router.post("/", registrar);

router.get("/perfil", perfil);

router.get("/:id/tareas", obtenerTareas);

export default router;
