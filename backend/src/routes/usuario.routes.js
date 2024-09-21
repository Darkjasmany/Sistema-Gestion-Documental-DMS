import { Router } from "express";
import { perfil, registrar } from "../controllers/usuario.controller.js";

const router = Router();

router.post("/", registrar);

router.get("/perfil", perfil);

export default router;
