import { Tramite } from "../models/Tramite.model.js";
import { generarAno } from "./generarAno.js";
import { generarNumeroMemo } from "./generarNumeroMemo.js";

export const generarMemo = async (tipo) => {
  const year = generarAno();

  // Llamamos a generarNumeroMemo para obtener y almacenar el nuevo numeroMemo en la BD
  const numeroMemo = await generarNumeroMemo();

  // Generamos el número completo según el tipo de trámite
  if (tipo === "MEMO") {
    return `Memorandum-SEC-${numeroMemo}-${year}`;
  } else {
    return `Circular-SEC-${numeroMemo}-${year}`;
  }
};
