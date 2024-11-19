import { sequelize } from "../config/db.config.js";
import { Departamento } from "../models/Departamento.model.js";
import { Empleado } from "../models/Empleado.model.js";
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
        .status(403)
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

export const completarTramiteRevisor = async (req, res) => {
  const { id } = req.params;

  const {
    // numeroOficioDespacho,
    destinatarios,
    referenciaTramite,
    fechaDespacho,
    observacion,
  } = req.body;

  if (
    // !numeroOficioDespacho ||
    // numeroOficioDespacho.trim() === "" ||
    !destinatarios ||
    destinatarios.length === 0 ||
    !observacion ||
    observacion.trim() === ""
  ) {
    return res.status(400).json({
      message: "Todos los campos obligatorios",
    });
  }

  try {
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
        .status(403)
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
    // Generar número de Memo
    const tipo = tramite.externo ? "Oficio" : "Memorando";
    const multiplesDestinatarios = destinatarios.length > 1;
    const numeroMemo = await generarMemo(multiplesDestinatarios, tipo);

    // Actualizar el trámite en una transacción
    await sequelize.transaction(async (transaction) => {
      for (const destinatario of destinatarios) {
        const departamentoDestinatario = await Empleado.findOne({
          where: { id: destinatario.id },
          transaction,
        });

        if (departamentoDestinatario) {
          await TramiteDestinatario.create(
            {
              tramite_id: id,
              departamento_destinatario: parseInt(
                departamentoDestinatario.departamento_id
              ),
              destinatario_id: destinatario.id,
              activo: true,
              usuario_creacion: req.usuario.id,
            },
            transaction
          );
        }
      }

      // Actualizar datos del Trámite
      tramite.numero_oficio = numeroMemo;
      tramite.fecha_despacho = fechaDespacho;
      tramite.referencia_tramite =
        referenciaTramite || tramite.referencia_tramite;
      tramite.estado = "POR_REVISAR";
      await tramite.save({ transaction });

      await TramiteObservacion.create(
        {
          tramite_id: id,
          observacion,
          usuario_creacion: req.usuario.id,
        },
        { transaction }
      );
    });

    return res.json({ message: "Tramite Completado" });
  } catch (error) {
    console.error(
      `Error al completar el trámite seleccionado: ${error.message}`
    );
    return res.status(500).json({
      message:
        "Error al completar el trámite seleccionado, intente nuevamente más tarde.",
    });
  }
};

export const actualizarTramiteRevisor = async (req, res) => {
  const { id } = req.params;

  const { destinatarios, referenciaTramite, fechaDespacho, observacion } =
    req.body;

  if (
    !destinatarios ||
    destinatarios.length === 0 ||
    !observacion ||
    observacion.trim() === ""
  ) {
    return res.status(400).json({
      message: "Todos los campos obligatorios",
    });
  }

  try {
    const tramite = await Tramite.findOne({
      where: { id, estado: "POR_REVISAR", activo: true },
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
        .status(403)
        .json({ message: "El trámite seleccionado no te pertenece" });
    }

    const { valido, mensaje } = validarFecha(fechaDespacho);
    if (!valido) {
      return res.status(400).json({ error: mensaje });
    }

    // TODO seguir con la logica de Actualizar un tramite

    const destinatariosTramite = await TramiteDestinatario.findAll({
      where: {
        tramite_id: id,
        activo: true,
      },
    });
    // console.log(destinatariosTramite);

    const destinatarioExistente = destinatariosTramite.map(
      (destinatarioActual) => parseInt(destinatarioActual.destinatario_id)
    );

    // console.log(destinatarios);
    const destinatarioIngresado = destinatarios.map((destinatario) =>
      parseInt(destinatario.id)
    );

    destinatarioExistente.sort();
    destinatarioIngresado.sort();

    // console.log(destinatarioExistente);
    // console.log(destinatarioIngresado);

    let destinarioBorrar = [];
    let destinatarioIngresar = [];

    // Comparar arreglos

    for (let i = 0; i < destinatarioExistente.length; i++) {
      // Extraemos los destinatarios que ya no estan
      if (destinatarioExistente[i] !== destinatarioIngresado[i]) {
        destinarioBorrar.push(destinatarioExistente[i]);
      }
    }

    for (let i = 0; i < destinatarioIngresado.length; i++) {
      // Extraemos los destinatarios que ya no estan
      if (destinatarioIngresado[i] !== destinatarioExistente[i]) {
        destinatarioIngresar.push(destinatarioIngresado[i]);
      }
    }

    // console.log(destinarioBorrar);
    // console.log(destinatarioIngresar);

    // TODO: Actualizar destinarios

    for (const eliminar of destinarioBorrar) {
      const esteSi = await TramiteDestinatario.findOne({
        where: { destinatario_id: eliminar },
      });

      esteSi.activo = false;

      await esteSi.save();
    }

    for (const destinatario of destinatarioIngresar) {
      const departamentoDestinatario = await Empleado.findOne({
        where: { id: destinatario },
      });

      if (departamentoDestinatario) {
        await TramiteDestinatario.create({
          tramite_id: id,
          departamento_destinatario: parseInt(
            departamentoDestinatario.departamento_id
          ),
          destinatario_id: destinatario,
          activo: true,
          usuario_creacion: req.usuario.id,
        });
      }
    }

    res.json({ message: "Trámite Actualizado Correctamente" });

    return;
  } catch (error) {
    console.error(
      `Error al actualizar el trámite seleccionado: ${error.message}`
    );
    return res.status(500).json({
      message:
        "Error al actualizar el trámite seleccionado, intente nuevamente más tarde.",
    });
  }
};
