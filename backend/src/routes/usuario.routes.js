import { Router } from "express";
import {
  perfil,
  registrar,
  obtenerTareas,
} from "../controllers/usuario.controller.js";

const router = Router();

router.post("/", registrar);

router.get("/perfil", perfil);

router.get("/:id/tareas", obtenerTareas);

export default router;
