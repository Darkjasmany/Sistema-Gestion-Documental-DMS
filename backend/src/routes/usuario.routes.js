import { Router } from "express";
import {
  perfil,
  registrar,
  obtenerTareas,
  confirmar,
} from "../controllers/usuario.controller.js";

const router = Router();

// Rutas Públicas
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);

// Rutas Privadas
router.get("/perfil", perfil);
router.get("/:id/tareas", obtenerTareas);

export default router;
