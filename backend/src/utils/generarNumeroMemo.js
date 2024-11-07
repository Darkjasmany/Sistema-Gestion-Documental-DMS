import { Tramite } from "../models/Tramite.model.js";
import { config } from "../config/parametros.config.js";

export const generarNumeroMemo = async () => {
  // Obtenemos el último número de trámite de forma asíncrona
  const lastTramite = await Tramite.findOne({
    order: [["numero_oficio", "DESC"]],
  });

  const numeroMemo = lastTramite
    ? lastTramite.numero_oficio + 1
    : parseInt(config.MEMO);

  return numeroMemo;
};
