import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import * as tramiteController from "../controllers/tramite.controller.js";
import * as tramiteCoordinador from "../controllers/tramiteCoordinador.controller.js";

const router = Router();

// Rutas para usuarios normales
router
  .route("/")
  .post(checkAuth, tramiteController.agregarTramite)
  .get(checkAuth, tramiteController.listarTramitesUsuario);

router
  .route("/:id")
  .get(checkAuth, tramiteController.obtenerTramite)
  .put(checkAuth, tramiteController.actualizarTramite)
  .delete(checkAuth, tramiteController.eliminarTramite);

// Rutas exclusivas para el coordinador

// Ruta para obtener trámites por estado
router
  .route("/coordinador/tramites")
  .get(
    checkAuth,
    checkRole("coordinador"),
    tramiteCoordinador.obtenerTramitesPorEstado
  );

router
  .route("/coordinador/tramites/:id")
  .get(checkAuth, checkRole("coordinador"), tramiteCoordinador.obtenerTramite)
  .post(
    checkAuth,
    checkRole("coordinador"),
    tramiteCoordinador.actualizarTramite
  )
  .delete(
    checkAuth,
    checkRole("coordinador"),
    tramiteCoordinador.eliminarTramite
  );

router
  .route("/coordinador/tramites/:id/asignar-revisor")
  .put(checkAuth, checkRole("coordinador"), tramiteCoordinador.asignarRevisor);

// Rutas exclusivas para el revisor

/*
router
  .route("/revisor/tramites")
  .get(checkAuth, checkRole("revisor"), listarTramitesRevisor);

router
  .route("/revisor/tramites/:id")
  .get(checkAuth, checkRole("revisor"), obtenerTramiteRevisor)
  .put(checkAuth, checkRole("revisor"), actualizarTramiteRevisor);




  // Rutas para revisores
router.get("/revisor", checkAuth, checkRole("revisor"), tramiteRevisorController.obtenerTramitesAsignados);
router.put("/revisor/:id", checkAuth, checkRole("revisor"), tramiteRevisorController.actualizarEstadoTramite);
*/
export default router;
