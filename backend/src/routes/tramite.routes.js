import { Router } from "express";
import {
  agregarTramite,
  obtenerTramite,
  actualizarTramite,
  eliminarTramite,
  obtenerAllTramites,
} from "../controllers/tramite.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(checkAuth, agregarTramite).get(obtenerAllTramites);

router
  .route("/:id")
  .get(obtenerTramite)
  .put(actualizarTramite)
  .delete(eliminarTramite);

export default router;
