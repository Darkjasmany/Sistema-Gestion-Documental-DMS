import { Sequelize } from "sequelize";
import { Departamento } from "../models/Departamento.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Usuario } from "../models/Usuario.model.js";

// Definir los objetos de estado
const INGRESADO = {
  attributes: [
    "numero_tramite",
    "asunto",
    "descripcion",
    "prioridad",
    "fecha_documento",
    "referencia_tramite",
    "estado",
    "createdAt",
    [
      // Conteo de archivos de cada trámite
      Sequelize.literal(
        `(SELECT COUNT(*) FROM "tramite_archivo" WHERE "tramite_archivo"."tramite_id" = "tramite"."id")`
      ),
      "totalArchivosCargados",
    ],
  ],
  include: [
    {
      model: Departamento,
      as: "departamentoRemitente", // Alias
      attributes: ["nombre"], // Atributos del departamento remitente
    },
    {
      model: Empleado,
      as: "remitente", // Alias
      attributes: [
        [
          Sequelize.literal(
            'CONCAT("remitente"."apellidos", \' \', "remitente"."nombres")'
          ),
          "nombreRemitente",
        ],
      ],
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
  order: [["numeroTramite", "ASC"]], // Cambia 'numeroTramite' por el campo que desees
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
      model: Departamento,
      as: "departamentoDestinatario",
      attributes: ["nombre"],
    },
    {
      model: Empleado,
      as: "destinatario",
      attributes: [
        [
          Sequelize.literal(
            'CONCAT("remitente"."apellidos", \' \', "remitente"."nombres")'
          ),
          "nombreRemitente",
        ],
      ],
    },
  ],
};
const COMPLETADO = {};
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
