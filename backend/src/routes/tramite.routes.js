import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import * as tramiteController from "../controllers/tramite.controller.js";
import * as tramiteCoordinador from "../controllers/tramiteCoordinador.controller.js";
import * as tramiteRevisor from "../controllers/tramiteRevisor.controller.js";

const router = Router();

// *Rutas para usuarios normales
router
  .route("/")
  .post(checkAuth, tramiteController.agregarTramite)
  .get(checkAuth, tramiteController.listarTramitesUsuario);

router
  .route("/:id")
  .get(checkAuth, tramiteController.obtenerTramite)
  .put(checkAuth, tramiteController.actualizarTramite)
  .delete(checkAuth, tramiteController.eliminarTramite);

// * Rutas exclusivas para el coordinador
router
  .route("/coordinador/tramites")
  .get(
    checkAuth,
    checkRole("COORDINADOR"),
    tramiteCoordinador.obtenerTramitesPorEstado
  );

router
  .route("/coordinador/tramites/:id")
  .get(checkAuth, checkRole("COORDINADOR"), tramiteCoordinador.obtenerTramite)
  .put(
    checkAuth,
    checkRole("COORDINADOR"),
    tramiteCoordinador.actualizarTramite
  )
  .delete(
    checkAuth,
    checkRole("COORDINADOR"),
    tramiteCoordinador.eliminarTramite
  );

router.put(
  "/coordinador/tramites/:id/revisor",
  checkAuth,
  checkRole("COORDINADOR"),
  tramiteCoordinador.asignarOReasignarRevisor
);
router.put(
  "/coordinador/tramites/:id/completar",
  checkAuth,
  checkRole("COORDINADOR"),
  tramiteCoordinador.completarTramite
);

// * Rutas exclusivas para el revisor

router
  .route("/revisor/tramites")
  .get(checkAuth, checkRole("REVISOR"), tramiteRevisor.listarTramitesRevisor);

router
  .route("/revisor/tramites/:id")
  .get(checkAuth, checkRole("REVISOR"), tramiteRevisor.obtenerTramiteRevisor)
  .put(
    checkAuth,
    checkRole("REVISOR"),
    tramiteRevisor.actualizarTramiteRevisor
  );

export default router;
