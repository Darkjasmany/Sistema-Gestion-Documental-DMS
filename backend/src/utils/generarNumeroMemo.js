import { config } from "../config/parametros.config.js";
import { generarAno } from "./generarAno.js";
import { TramiteSecuencia } from "../models/TramiteSecuencia.model.js";

export const generarNumeroMemo = async () => {
  const tipoOficio = "numero_oficio:";
  const anioActual = generarAno();

  let secuencia = await TramiteSecuencia.findOne({
    where: { tipo: tipoOficio, anio: anioActual },
  });

  if (!secuencia) {
    secuencia = await TramiteSecuencia.create({
      tipo: tipoOficio,
      anio: anioActual,
      valor_actual: parseInt(config.MEMO),
    });
    return secuencia.valor_actual;
  } else {
    secuencia.valor_actual += 1;
    await secuencia.save();
    return secuencia.valor_actual;
  }
};
