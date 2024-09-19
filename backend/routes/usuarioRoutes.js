import { perfil, registrar } from "../controllers/usuarioController.js";
import express from "express";
const router = express.Router();

router.post("/", registrar);

router.get("/perfil", perfil);

export default router;
