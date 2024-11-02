import { Tramite } from "../models/Tramite.model.js";
import { generarAno } from "../utils/generarAno.js";

export const generarNumeroMemo = async (tipo) => {
  const year = generarAno();

  // Obtenemos el último número de trámite de forma asíncrona
  const lastTramite = await Tramite.findOne({
    order: [["numeroMemo", "DESC"]],
  });

  // Extraemos el último número de trámite y le sumamos 1
  const lastMemo = lastTramite ? lastTramite + 1 : process.env.MEMO;

  if (tipo === "MEMO") {
    return `Memorandum-SEC-${lastMemo}-${year}`;
  } else {
    return `Circular-SEC-${lastMemo}-${year}`;
  }
};
