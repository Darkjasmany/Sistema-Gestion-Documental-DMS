import { Router } from "express";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import { validarCantidadArchivos } from "../middlewares/validarCantidadArchivos.middleware.js";
import { upload } from "../config/multer.config.js"; // Importamos la configuracón de Multer
import * as tramiteController from "../controllers/tramite.controller.js";
import * as tramiteCoordinador from "../controllers/tramiteCoordinador.controller.js";
import * as tramiteRevisor from "../controllers/tramiteRevisor.controller.js";
import { config } from "../config/parametros.config.js";

const router = Router();

// ** Express las rutas son evaluadas en el orden en que están definidas

// *Rutas para usuarios normales
router.get("/buscar", tramiteController.buscarTramites);
// router.get("/buscar", checkAuth, tramiteController.buscarTramites);

router
  .route("/")
  // .post(checkAuth, upload.single("archivo"), tramiteController.agregarTramite) // Cargar 1 archivo
  // upload.array('archivo', cantidadMáxima):'archivo' es el campo esperado y 5 es el máximo de archivos permitidos
  .post(
    checkAuth,
    upload.array("archivos", config.MAX_UPLOAD_FILES), // Si tienes nombres de campos diferentes para cada archivo, podrías usar upload.fields().
    tramiteController.agregarTramite
  )
  .get(checkAuth, tramiteController.listarTramitesUsuario);

router
  .route("/:id")
  .get(checkAuth, tramiteController.obtenerTramite)
  // .put(checkAuth, tramiteController.actualizarTramite)
  .put(
    checkAuth,
    // validarCantidadArchivos,
    upload.array("archivos", config.MAX_UPLOAD_FILES),
    // upload.array("archivosNuevos", config.MAX_UPLOAD_FILES),
    tramiteController.actualizarTramite
  )
  .delete(
    checkAuth,
    // checkRole("COORDINADOR"),
    tramiteController.eliminarTramite
  );

router.put(
  "/:id/eliminar-tramite",
  checkAuth,
  tramiteController.eliminadoLogicoTramite
);

// Ruta para subir archivos
router.put(
  "/:id/subir-archivos",
  checkAuth,
  validarCantidadArchivos, // Middleware que valida que no se pasen de 3 archivos
  upload.array("archivo", config.MAX_UPLOAD_FILES),
  tramiteController.subirArchivos
);

// Ruta para eliminar archivos
router.put(
  "/:id/eliminar-archivos",
  checkAuth,
  tramiteController.eliminarArchivos
);

// * Rutas exclusivas para el coordinador
router
  .route("/coordinador/tramites/:estado")
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

// Ruta para subir archivos Coordinador
router.put(
  "/coordinador/tramites/:id/subir-archivos",
  checkAuth,
  checkRole("COORDINADOR"),
  validarCantidadArchivos, // Middleware que valida que no se pasen de 3 archivos
  upload.array("archivo", config.MAX_UPLOAD_FILES),
  tramiteController.subirArchivos
);

// Ruta para eliminar archivos Coordinador
router.put(
  "/coordinador/tramites/:id/eliminar-archivos",
  checkAuth,
  checkRole("COORDINADOR"),
  tramiteController.eliminarArchivos
);

router.put(
  "/coordinador/tramites/:id/eliminar-tramite",
  checkAuth,
  checkRole("COORDINADOR"),
  tramiteCoordinador.eliminadoLogicoTramite
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
  .put(checkAuth, checkRole("REVISOR"), tramiteRevisor.completarTramiteRevisor);

router.put(
  "/revisor/tramites/:id/actualizar",
  checkAuth,
  checkRole("REVISOR"),
  tramiteRevisor.actualizarTramiteRevisor
);

export default router;
