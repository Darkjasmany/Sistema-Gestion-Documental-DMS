import { Router } from "express";
import {
  perfilUsuario,
  registrarUsuario,
  obtenerTramitesUsuario,
  confirmarCuenta,
  autenticarUsuario,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
} from "../controllers/usuario.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas Públicas
router.post("/", registrarUsuario);
router.get("/confirmar/:token", confirmarCuenta);
router.post("/login", autenticarUsuario);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

// Rutas Privadas
router.get("/perfil", checkAuth, perfilUsuario);
router.get("/:id/tareas", obtenerTramitesUsuario);

export default router;
