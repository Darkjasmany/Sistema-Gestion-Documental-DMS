import { generarAno } from "./generarAno.js";
import { generarSecuencia } from "./generarSecuencia.js";

export const generarMemo = async (multiplesDestinatarios = false, tipo) => {
  const year = generarAno();
  const numeroSecuencia = await generarSecuencia();

  const prefijo = multiplesDestinatarios ? "-Circular" : "";

  const numeroMemo = `${tipo}${prefijo}-SEC-${year}-${String(
    numeroSecuencia
  ).padStart(5, "0")}`;

  return numeroMemo;
};
