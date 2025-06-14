import { Router } from "express";
import {
  perfilUsuario,
  registrarUsuario,
  confirmarCuenta,
  autenticarUsuario,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
  // obtenerRevisorPorDepartamento,
  obtenerUsuariosPorDepartamentoYRol,
} from "../controllers/usuario.controller.js";
import { checkAuth } from "../../../middlewares/auth.middleware.js";

const router = Router();

// Rutas Públicas
router.post("/", registrarUsuario);
router.get("/confirmar/:token", confirmarCuenta);
router.post("/login", autenticarUsuario);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

router.get(
  "/revisor-departamento/:departamentoId/:roles",
  obtenerUsuariosPorDepartamentoYRol
);
// router.get(
//   "/revisor-departamento/:departamentoId",
//   obtenerRevisorPorDepartamento
// );

// Rutas Privadas
router.get("/perfil", checkAuth, perfilUsuario);
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/actualizar-password", checkAuth, actualizarPassword);

export default router;
