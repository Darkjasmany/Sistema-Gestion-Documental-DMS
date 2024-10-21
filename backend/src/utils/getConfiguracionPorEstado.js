import { Sequelize } from "sequelize";
import { Departamento } from "../models/Departamento.model.js";
import { Empleado } from "../models/Empleado.model.js";
import { Usuario } from "../models/Usuario.model.js";

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
      attributes: [
        "numeroTramite",
        "asunto",
        "descripcion",
        "prioridad",
        "fechaDocumento",
        "referenciaTramite",
        "estado",
        "createdAt",
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
    },
    POR_REVISAR: {
      attributes: [
        "numeroTramite",
        "asunto",
        "descripcion",
        "prioridad",
        "fechaDocumento",
        "referenciaTramite",
        "estado",
        "createdAt",
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
    },
    COMPLETADO: {},
    CORRECCION_PENDIENTE: {},
    FINALIZADO: {},
  };

  return configuracionEstados[estado] || null;
};
