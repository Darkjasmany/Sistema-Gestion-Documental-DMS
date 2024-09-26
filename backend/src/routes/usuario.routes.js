import { Router } from "express";
import {
  perfil,
  registrar,
  obtenerTareas,
  confirmar,
  autenticar,
} from "../controllers/usuario.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas Públicas
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);

// Rutas Privadas
router.get("/perfil", checkAuth, perfil);
router.get("/:id/tareas", obtenerTareas);

export default router;
