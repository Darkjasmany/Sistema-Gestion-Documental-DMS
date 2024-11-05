import { Tramite } from "../models/Tramite.model.js";
import { config } from "../config/parametros.config.js";

export const generarNumeroMemo = async () => {
  // Obtenemos el último número de trámite de forma asíncrona
  const lastTramite = await Tramite.findOne({
    order: [["numeroMemo", "DESC"]],
  });

  // Extraemos el último número de memo, o tomamos el valor de MEMO del .env si no hay ninguno
  const numeroMemo = lastTramite
    ? lastTramite.numeroMemo + 1
    : parseInt(config.MEMO) || 1;

  return numeroMemo;
};
