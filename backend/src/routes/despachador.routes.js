import { Router } from "express";
import {
  agregarDespachador,
  obtenerDespachadorPorDepartamento,
} from "../controllers/despachador.controller.js";

const router = Router();

router.route("/").post(agregarDespachador);
router.get(
  "/por-departamento/:departamentoId",
  obtenerDespachadorPorDepartamento
);

export default router;
