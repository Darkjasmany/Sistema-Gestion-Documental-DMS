import { Sequelize } from "sequelize";
import { Departamento } from "../models/Departamento.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Usuario } from "../models/Usuario.model.js";

// Definir los objetos de estado
const INGRESADO = {
  attributes: [
    "numeroTramite",
    "asunto",
    "descripcion",
    "prioridad",
    "fechaDocumento",
    "referenciaTramite",
    "estado",
    "createdAt",
    [
      // Conteo de archivos de cada trámite
      Sequelize.literal(
        `(SELECT COUNT(*) FROM "tramiteArchivo" WHERE "tramiteArchivo"."tramiteId" = "tramite"."id")`
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
    "fechaMaximaContestacion", // Añadimos un atributo extra para PENDIENTE
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
const POR_REVISAR = {};
const COMPLETADO = {};
const CORRECCION_PENDIENTE = {};
const FINALIZADO = {};

// Crear el objeto
const configuracionEstados = {
  INGRESADO,
  PENDIENTE,
};

export const getConfiguracionPorEstado = (estado) => {
  return configuracionEstados[estado] || null;
};

/*
export const getConfiguracionPorEstado = (estado) => {



  const configuracionEstados = {
    INGRESADO: {
      attributes: [
        "numeroTramite",
        "asunto",
        "descripcion",
        "prioridad",
        "fechaDocumento",
        "referenciaTramite",
        "estado",
        "createdAt",
        [
          // Conteo de archivos de cada trámite
          Sequelize.literal(
            `(SELECT COUNT(*) FROM "tramiteArchivo" WHERE "tramiteArchivo"."tramiteId" = "tramite"."id")`
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
    },

    PENDIENTE: {
      ...configuracionEstados.INGRESADO, // Heredamos todo de INGRESADO
      attributes: [
        ...configuracionEstados.INGRESADO.attributes, // Reutilizamos los mismos atributos
        "fechaMaximaContestacion", // Añadimos un atributo extra para PENDIENTE
      ],
      include: [
        ...configuracionEstados.INGRESADO.include, // Reutilizamos los includes
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
    },

    POR_REVISAR: {},
    COMPLETADO: {},
    CORRECCION_PENDIENTE: {},
    FINALIZADO: {},
  };

  return configuracionEstados[estado] || null;
};
*/
