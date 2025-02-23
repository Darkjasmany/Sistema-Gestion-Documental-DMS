import { sequelize } from "../config/db.config.js";
import { Departamento } from "../models/Departamento.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Tramite } from "../models/Tramite.model.js";
import { TramiteArchivo } from "../models/TramiteArchivo.model.js";
import { TramiteDestinatario } from "../models/TramiteDestinatario.model.js";
import { TramiteObservacion } from "../models/TramiteObservacion.model.js";
import { generarMemo } from "../utils/generarMemo.js";
import { getConfiguracionPorEstado } from "../utils/getConfiguracionPorEstado.js";
import { validarFecha } from "../utils/validarFecha.js";

export const listarTramitesRevisor = async (req, res) => {
  const { estado } = req.params;
  if (!estado)
    return res.status(400).json({ message: "El estado es requerido" });

  try {
    const config = await getConfiguracionPorEstado(estado);
    if (!config)
      return res.status(400).json({
        message: `No se encontró una configuración válida para el estado: ${estado}`,
      });

    const tramites = await Tramite.findAll({
      where: {
        departamento_tramite: req.usuario.departamento_id,
        usuario_revisor: req.usuario.id,
        estado,
        activo: true,
      },
      attributes: config.attributes,
      include: config.include,
      // order: [
      //   ["prioridad", "ASC"],
      //   ["createdAt", "ASC"],
      // ],
      order: [["id", "DESC"]],
    });

    // res.json(tramites);
    // Modificar la ruta antes de enviarla al frontend
    const tramitesConRutas = tramites.map((tramite) => {
      const archivosConRutas = tramite.tramiteArchivos.map((archivo) => ({
        ...archivo.toJSON(),
        ruta: `${archivo.ruta.replace(/\\/g, "/")}`,
      }));

      return {
        ...tramite.toJSON(),
        tramiteArchivos: archivosConRutas,
      };
    });

    // console.log(tramitesConRutas);
    res.json(tramitesConRutas);
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
    const { estado } = req.query;

    if (!estado)
      return res.status(400).json({ message: "El estado es requerido" });

    const tramite = await Tramite.findOne({
      where: { id, estado, activo: true },
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
      attributes: ["id", "tipo", "original_name"],
    });

    const destinarios = await TramiteDestinatario.findAll({
      where: { tramite_id: id },
      attributes: ["id"],
      include: [
        {
          model: Empleado,
          as: "destinatario",
          attributes: ["nombres", "apellidos"],
        },
        {
          model: Departamento,
          as: "departamentoDestinatario",
          attributes: ["nombre"],
        },
      ],
    });

    const respuesta = { tramite, archivos };

    if (estado === "POR_REVISAR") {
      respuesta.destinarios = destinarios; // Se agrega una nueva propiedad `destinarios` al objeto con el valor de la variable `destinarios`.
    }

    res.json(respuesta);
  } catch (error) {
    console.error(`Error al obtener el trámite seleccionado: ${error.message}`);
    return res.status(500).json({
      message:
        "Error al obtener el trámite seleccionado, intente nuevamente más tarde.",
    });
  }
};

export const completarTramiteRevisor = async (req, res) => {
  console.log("Params:", req.params);
  console.log("Body:", req.body);

  const { id } = req.params;

  const {
    // numeroOficioDespacho,
    destinatarios,
    // referenciaTramite,
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

  // Asegurarme que voy a recibir un array de objetos
  const destinatariosProcesados = destinatarios.map((dest) =>
    typeof dest === "number" ? { id: dest } : dest
  );

  // Generar número de Memo
  const tipo = tramite.externo ? "Oficio" : "Memorando";
  const multiplesDestinatarios = destinatarios.length > 1;
  const numeroMemo = await generarMemo(multiplesDestinatarios, tipo);

  try {
    // Actualizar el trámite en una transacción
    await sequelize.transaction(async (transaction) => {
      for (const destinatario of destinatariosProcesados) {
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
      // tramite.referencia_tramite =
      // referenciaTramite || tramite.referencia_tramite;
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
  // console.log("Params:", req.params);
  // console.log("Body:", req.body);

  const { id } = req.params;
  const { destinatarios, fechaDespacho, observacion } = req.body;

  if (
    // Array.isArray(destinatarios) ||
    !destinatarios ||
    destinatarios.length === 0 ||
    !observacion ||
    observacion.trim() === ""
  ) {
    return res.status(400).json({
      message: "Todos los campos obligatorios",
    });
  }

  const transaction = await sequelize.transaction();

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

  //* Lógica para obtener destinatios ingresados en la BD y los que se envian por el formulario, para despues comparar e indentificar cual se inhabilita y cual se ingresa

  // Obtener destinatarios actuales
  const destinatariosTramite = await TramiteDestinatario.findAll({
    where: {
      tramite_id: id,
      activo: true,
    },
  });

  const destinatariosActuales = destinatariosTramite.map((destinatarioActual) =>
    parseInt(destinatarioActual.destinatario_id)
  );

  // Destinatarios enviados en el formulario
  // const destinatariosIngresados = destinatarios.map((destinatario) =>
  //   parseInt(destinatario.id)
  // );
  // Asegurarme que voy a recibir un array de objetos, al extraer el id de los objetos o usar directamente el número, aseguramos que destinatariosIngresados sea un array de números, permitiendo comparaciones válidas y consultas correctas a la base de datos.

  const destinatariosIngresados = destinatarios.map((dest) =>
    dest.id ? dest.id : dest
  );

  // Identificar los destinatarios que se nuevos a ingresar y los que se deben inhabilitar
  const destinatariosEliminar = encontrarDestinariosABorrar(
    destinatariosActuales,
    destinatariosIngresados
  );

  const destinatariosIngresar = encontrarDestinatariosAIngresar(
    destinatariosActuales,
    destinatariosIngresados
  );

  try {
    // Inhabilitar los destinatarios eliminados
    for (const eliminar of destinatariosEliminar) {
      const destinatario = await TramiteDestinatario.findOne({
        where: {
          destinatario_id: eliminar,
          activo: true,
        },
      });

      destinatario.activo = "false";
      destinatario.save();
    }

    // Insertar nuevos destinarios
    for (const destinatario of destinatariosIngresar) {
      const departamentoDestinatario = await Empleado.findOne({
        where: { id: destinatario },
      });

      if (departamentoDestinatario) {
        await TramiteDestinatario.create(
          {
            tramite_id: id,
            departamento_destinatario: parseInt(
              departamentoDestinatario.departamento_id
            ),
            destinatario_id: destinatario,
            activo: true,
            usuario_creacion: req.usuario.id,
          },
          { transaction }
        );
      }
    }

    // Actualizar trámite y observación
    tramite.fecha_despacho = fechaDespacho || tramite.fecha_despacho;
    await tramite.save({ transaction });

    // Actualizar observacion del tramite
    const tramiteObservacion = await TramiteObservacion.findOne({
      where: { tramite_id: id, usuario_creacion: req.usuario.id },
      order: [["id", "DESC"]],
    });

    if (tramiteObservacion) {
      tramiteObservacion.observacion =
        observacion || tramiteObservacion.observacion;
      await tramiteObservacion.save({ transaction });
    }

    await transaction.commit();
    return res.json({ message: "Trámite Actualizado Correctamente" });
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

function encontrarDestinariosABorrar(
  destinatariosActuales,
  destinatariosIngresados
) {
  const destinatariosABorrar = [];

  // Convertimos destinatariosIngresados a un conjunto para una búsqueda más rápida
  const conjuntoIngresado = new Set(destinatariosIngresados);

  // Iteramos sobre los destinatarios actuales y verificamos si están en el conjunto
  for (const destinatario of destinatariosActuales) {
    if (!conjuntoIngresado.has(destinatario)) {
      destinatariosABorrar.push(destinatario);
    }
  }

  return destinatariosABorrar;
}

function encontrarDestinatariosAIngresar(
  destinatariosActuales,
  destinatariosIngresados
) {
  const destinariosAIngresar = [];

  const conjuntoActual = new Set(destinatariosActuales);

  for (const ingresado of destinatariosIngresados) {
    if (!conjuntoActual.has(ingresado)) {
      destinariosAIngresar.push(ingresado);
    }
  }

  return destinariosAIngresar;
}
