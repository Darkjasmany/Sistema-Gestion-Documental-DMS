import { Router } from "express";
import {
  agregarDespachador,
  cargarDespachadores,
  obtenerDespachadorPorDepartamento,
} from "../controllers/despachador.controller.js";

const router = Router();

router.route("/").get(cargarDespachadores).post(agregarDespachador);

router.get(
  "/por-departamento/:departamentoId",
  obtenerDespachadorPorDepartamento
);

export default router;
