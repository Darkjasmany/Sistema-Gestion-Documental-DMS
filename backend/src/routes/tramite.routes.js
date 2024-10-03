import { Router } from "express";
import {
  agregarTramite,
  obtenerTramite,
  actualizarTramite,
  eliminarTramite,
  listarTramitesUsuario,
} from "../controllers/tramite.controller.js";
import { checkAuth, checkRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas para usuario normal (usuarioCreacion)
router
  .route("/")
  .post(checkAuth, agregarTramite)
  .get(checkAuth, listarTramitesUsuario);

router
  .route("/:id")
  .get(checkAuth, obtenerTramite)
  .put(checkAuth, actualizarTramite)
  .delete(checkAuth, eliminarTramite);

/*
  // Rutas exclusivas para el coordinador
router
  .route("/coordinador/tramites")
  .get(checkAuth, checkRole("coordinador"), listarTramitesCoordinador);

router
  .route("/coordinador/tramites/:id/asignar-revisor")
  .put(checkAuth, checkRole("coordinador"), asignarRevisor);

// Rutas exclusivas para el revisor
router
  .route("/revisor/tramites")
  .get(checkAuth, checkRole("revisor"), listarTramitesRevisor);

router
  .route("/revisor/tramites/:id")
  .get(checkAuth, checkRole("revisor"), obtenerTramiteRevisor)
  .put(checkAuth, checkRole("revisor"), actualizarTramiteRevisor);
*/
export default router;
