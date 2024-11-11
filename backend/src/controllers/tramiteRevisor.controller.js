import { Tramite } from "../models/Tramite.model.js";
import { TramiteArchivo } from "../models/TramiteArchivo.model.js";
import { TramiteDestinatario } from "../models/TramiteDestinatario.model.js";
import { TramiteObservacion } from "../models/TramiteObservacion.model.js";
import { generarMemo } from "../utils/generarMemo.js";
import { generarSecuencia } from "../utils/generarSecuencia.js";
import { getConfiguracionPorEstado } from "../utils/getConfiguracionPorEstado.js";
import { validarFecha } from "../utils/validarFecha.js";

export const listarTramitesRevisor = async (req, res) => {
  const { estado } = req.query;
  if (!estado)
    return res.status(400).json({ message: "El estado es requerido" });

  try {
    const config = await getConfiguracionPorEstado(estado);
    if (!config)
      return res.status(400).json({
        message: `No se encontró una configuración válida para el estado: ${estado}`,
      });

    const tramite = await Tramite.findAll({
      where: {
        departamento_tramite: req.usuario.departamento_id,
        usuario_revisor: req.usuario.id,
        estado,
        activo: true,
      },
      attributes: config.attributes,
      include: config.include,
      order: [
        ["prioridad", "ASC"],
        ["createdAt", "ASC"],
      ],
    });

    res.json(tramite);
  } catch (error) {
    console.error(
      `Error al obtener los trámites con estado: ${estado}: ${error.message}`
    );
    return res.status(500).json({
      message: `Error al obtener los trámites con estado: ${estado}, intente nuevamente más tarde.`,
    });
  }
};

export const obtenerTramiteRevisor = async (req, res) => {
  try {
    const { id } = req.params;

    const tramite = await Tramite.findOne({
      where: { id, estado: "PENDIENTE", activo: true },
    });
    if (!tramite) return res.status(404).json({ message: "No encontrado" });

    if (
      tramite.usuario_revisor.toString() !== req.usuario.id.toString() ||
      tramite.departamento_tramite.toString() !==
        req.usuario.departamento_id.toString()
    )
      return res
        .status(404)
        .json({ message: "El trámite seleccionado no te pertenece" });

    const archivos = await TramiteArchivo.findAll({
      where: { tramite_id: id },
    });

    res.json({ tramite, archivos });
  } catch (error) {
    console.error(`Error al obtener el trámite seleccionado: ${error.message}`);
    return res.status(500).json({
      message:
        "Error al obtener el trámite seleccionado, intente nuevamente más tarde.",
    });
  }
};

export const actualizarTramiteRevisor = async (req, res) => {
  const { id } = req.params;

  const {
    // numeroOficioDespacho,
    departamentoDestinatarioId,
    destinatarios,
    referenciaTramite,
    fechaDespacho,
    observacion,
  } = req.body;

  if (
    // !numeroOficioDespacho ||
    // numeroOficioDespacho.trim() === "" ||
    !departamentoDestinatarioId ||
    !destinatarios ||
    destinatarios.length === 0 ||
    !observacion ||
    observacion.trim() === ""
  ) {
    return res.status(400).json({
      message: "Todos los campos obligatorios",
    });
  }

  const tramite = await Tramite.findOne({
    where: { id, estado: "PENDIENTE", activo: true },
  });

  if (!tramite) {
    return res.status(404).json({ message: "Trámite no encontrado" });
  }

  if (
    tramite.usuario_revisor.toString() !== req.usuario.id.toString() ||
    tramite.departamento_tramite.toString() !==
      req.usuario.departamento_id.toString()
  ) {
    return res
      .status(404)
      .json({ message: "El trámite seleccionado no te pertenece" });
  }

  const { valido, mensaje } = validarFecha(fechaDespacho);
  if (!valido) {
    return res.status(400).json({ error: mensaje });
  }
  /*
  const numeroOficio = await Tramite.findOne({
    where: {
      numero_oficio: numeroOficioDespacho,
    },
  });
  if (numeroOficio) {
    return res
      .status(409)
      .json({ message: "El numero de Memo ya esta siendo utilizado" });
  }
*/
  /*
  console.log(tramite.externo);
  console.log(destinatarios.length);
  let numeroMemo;
  let tipo;
  if (tramite.externo) {
    tipo = "Oficio";
    if (destinatarios.length > 1) {
      numeroMemo = await generarMemo(true, tipo);
    } else {
      numeroMemo = await generarMemo(tipo);
    }
  } else {
    tipo = "Memorando";
    if (destinatarios.length > 1) {
      numeroMemo = await generarMemo(true, tipo);
    } else {
      numeroMemo = await generarMemo(tipo);
    }
  }
    */

  console.log(tramite.externo);
  console.log(destinatarios.length);

  let numeroMemo;
  const tipo = tramite.externo ? "Oficio" : "Memorando";
  const multiplesDestinatarios = destinatarios.length > 1;

  console.log(multiplesDestinatarios);
  numeroMemo = await generarMemo(multiplesDestinatarios, tipo);

  console.log(numeroMemo);

  return;

  tramite.numero_oficio = numeroOficioDespacho;
  tramite.referencia_tramite = referenciaTramite || tramite.referencia_tramite;
  tramite.fecha_despacho = fechaDespacho;
  tramite.estado = "POR_REVISAR";
  await tramite.save();

  // Recorrer el arreglo de Destinatarios y empezarlos a ingresar

  await TramiteDestinatario.create({
    tramite_id: id,
    departamento_destinatario: departamentoDestinatarioId,
    destinatario_id: destinatarioId,
    usuario_creacion: req.usuario.id,
  });

  await TramiteObservacion.create({
    tramite_id: id,
    observacion,
    usuario_creacion: req.usuario.id,
    fecha_creacion: Date.now(),
  });

  console.log(req.body);
};
