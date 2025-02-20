import { Sequelize } from "sequelize";
import { Departamento } from "../models/Departamento.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Usuario } from "../models/Usuario.model.js";
import { TramiteArchivo } from "../models/TramiteArchivo.model.js";
import { sequelize } from "../config/db.config.js";
import { TramiteDestinatario } from "../models/TramiteDestinatario.model.js";

// Definir los objetos de estado
const INGRESADO = {
  attributes: [
    "id",
    "numero_tramite",
    "numero_oficio_remitente",
    "asunto",
    "referencia_tramite",
    "fecha_documento",
    "prioridad",
    "descripcion",
    "estado",
    "externo",
    "createdAt",
    // [
    //   // Conteo de archivos de cada trámite
    //   Sequelize.literal(
    //     `(SELECT COUNT(*) FROM "tramite_archivo" WHERE "tramite_archivo"."tramite_id" = "tramite"."id")`
    //   ),
    //   "totalArchivosCargados",
    // ],
  ],
  include: [
    {
      model: Departamento,
      as: "departamentoRemitente", // Alias
      attributes: ["id", "nombre"], // Atributos del departamento remitente
    },
    {
      model: Empleado,
      as: "remitente", // Alias
      attributes: [
        "id",
        [
          Sequelize.literal(
            "CONCAT(remitente.nombres, ' ',  remitente.apellidos)"
          ),
          "nombreCompleto",
        ],
        // "cedula",
      ],
    },
    {
      model: TramiteArchivo,
      as: "tramiteArchivos",
      attributes: ["id", "original_name", "ruta"],
    },
    {
      model: Usuario,
      as: "usuario",
      attributes: [
        [
          Sequelize.literal(
            'CONCAT("usuario"."nombres", \' \', "usuario"."apellidos")'
          ),
          "UsuarioCreacion",
        ],
      ],
    },
  ],
  // order: [["numeroTramite", "ASC"]], // Cambia 'numeroTramite' por el campo que desees
};

const PENDIENTE = {
  ...INGRESADO, // Heredamos todo de INGRESADO
  attributes: [
    ...INGRESADO.attributes, // Reutilizamos los mismos atributos
    "fecha_contestacion", // Añadimos un atributo extra para PENDIENTE
  ],
  include: [
    ...INGRESADO.include, // Reutilizamos los includes
    {
      model: Usuario,
      as: "usuarioRevisor",
      attributes: [
        [
          Sequelize.literal(
            'CONCAT("usuarioRevisor"."nombres", \' \', "usuarioRevisor"."apellidos")'
          ),
          "UsuarioRevisor",
        ],
      ],
    },
  ],
};
const POR_REVISAR = {
  ...PENDIENTE,
  attributes: [...PENDIENTE.attributes, "fecha_despacho", "numero_oficio"],
  include: [
    ...PENDIENTE.include,
    {
      model: TramiteDestinatario,
      as: "destinatarios",
      attributes: [
        "tramite_id",
        "departamento_destinatario",
        "destinatario_id",
      ],

      include: [
        {
          model: Empleado,
          as: "destinatario",
          attributes: ["id", "nombres", "apellidos"],
        },
        {
          model: Departamento,
          as: "departamentoDestinatario",
          attributes: ["id", "nombre"],
        },
      ],
      where: { activo: true },
    },
  ],
};

const COMPLETADO = {
  ...POR_REVISAR,
  attributes: [...POR_REVISAR.attributes],
  include: [...POR_REVISAR.include],
};
const CORRECCION_PENDIENTE = {};
const FINALIZADO = {};

// Crear el objeto
const configuracionEstados = {
  INGRESADO,
  PENDIENTE,
  POR_REVISAR,
};

export const getConfiguracionPorEstado = (estado) => {
  return configuracionEstados[estado] || null;
};
