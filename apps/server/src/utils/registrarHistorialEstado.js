import { TramiteHistorialEstado } from "../modules/document-management/models/TramiteHistorialEstado.model.js";

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
        tramite_id: tramiteId,
        estado_anterior: estadoAnterior,
        estado_actual: estadoActual,
        fecha_cambio: new Date(),
        usuario_creacion: usuarioId,
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
