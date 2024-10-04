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
  .route("/coordinador")
  .get(
    checkAuth,
    checkRole("COORDINADOR"),
    tramiteCoordinador.obtenerTramitesPorEstado
  );

router
  .route("/coordinador/:id")
  .get(checkAuth, checkRole("COORDINADOR"), tramiteCoordinador.obtenerTramite)
  .post(
    checkAuth,
    checkRole("COORDINADOR"),
    tramiteCoordinador.actualizarTramite
  )
  .delete(
    checkAuth,
    checkRole("COORDINADOR"),
    tramiteCoordinador.eliminarTramite
  );

router
  .route("/coordinador/:id/asignar-revisor")
  .put(checkAuth, checkRole("COORDINADOR"), tramiteCoordinador.asignarRevisor);

// Rutas exclusivas para el revisor

router.route("/revisor").get(checkAuth, checkRole("revisor"), () => {
  res.send("Listar trámites asignados al revisor ");
});

router
  .route("/revisor/:id")
  .get(checkAuth, checkRole("REVISOR"), () => {
    res.send("Obtener 1 trámites asignado al revisor ");
  })
  .put(checkAuth, checkRole("REVISOR"), () => {
    res.send("Obtener 1 trámites asignado al revisor ");
  });

export default router;
