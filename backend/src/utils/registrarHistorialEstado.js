import { TramiteHistorialEstado } from "../models/TramiteHistorialEstado.model.js";

export const registrarHistorialEstado = async (
  tramiteId,
  estadoAnterior,
  estadoActual,
  usuarioId,
  transaction
) => {
  try {
    await TramiteHistorialEstado.create(
      {
        tramiteId,
        estadoAnterior,
        estadoActual,
        fechaCambio: new Date(),
        usuarioId,
      },
      {
        transaction,
      }
    );
  } catch (error) {
    console.log(`Error al registrar el historial de estado: ${error.message}`);
    throw error; // Lanza el error para manejarlo en el controlador si es necesario
  }
};
