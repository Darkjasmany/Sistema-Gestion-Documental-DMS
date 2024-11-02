import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js"; // Importamos la conexión
import { Departamento } from "./Departamento.model.js";
import { Empleado } from "./Empleado.model.js";
import { TramiteHistorialEstado } from "./TramiteHistorialEstado.model.js";
import { TramiteAsignacion } from "./TramiteAsignacion.model.js";
import { TramiteArchivo } from "./TramiteArchivo.model.js";
import { TramiteObservacion } from "./TramiteObservacion.model.js";
import { TramiteEliminacion } from "./TramiteEliminacion.model.js";

export const Tramite = sequelize.define(
  "tramite",
  {
    numeroTramite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    asunto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    departamentoRemitenteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "departamento",
        key: "id",
      },
    },
    remitenteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "empleado",
        key: "id",
      },
    },
    usuarioCreacionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    usuarioActualizacionId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    departamentoTramiteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "departamento",
        key: "id",
      },
    },
    prioridad: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NORMAL",
      validate: {
        isIn: [["NORMAL", "MEDIA", "ALTA"]],
      },
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "INGRESADO",
      validate: {
        isIn: [
          [
            "INGRESADO",
            "PENDIENTE",
            "POR_REVISAR",
            "COMPLETADO",
            "FINALIZADO",
            "RECHAZADO",
          ],
        ],
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fechaDocumento: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true, // Valida que sea una fecha válida
      },
    },
    fechaMaximaContestacion: {
      type: DataTypes.DATEONLY,
      allowNull: true, // El campo puede estar vacío inicialmente
      validate: {
        isDate: true, // Valida que sea una fecha válida
      },
    },
    fechaDespacho: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    fechaEntregaFisica: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    referenciaTramite: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    secuencialMemo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    numeroOficioDespacho: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    numeroOficioModificado: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    usuarioRevisorId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "usuario",
        key: "id",
      },
    },
  },
  {
    tableName: "tramite",
    hooks: {
      beforeSave: (tramite) => {
        tramite.asunto = tramite.asunto.trim();
        tramite.descripcion = tramite.descripcion.trim();
        if (tramite.numeroOficioDespacho) {
          tramite.numeroOficioDespacho = tramite.numeroOficioDespacho.trim();
        }
        if (tramite.numeroTramiteEspecial) {
          tramite.numeroTramiteEspecial = tramite.numeroTramiteEspecial.trim();
        }
        if (tramite.observacionEliminacion) {
          tramite.observacionEliminacion =
            tramite.observacionEliminacion.trim();
        }
      },
    },
  }
);

// ** AGREGAR EL HOOK
//beforeValidate para el campo numeroTramite, garantizas que numeroTramite se establezca antes de que se valide el objeto, evitando que se produzca la violación de la restricción de no nulo.
Tramite.addHook("beforeValidate", async (tramite) => {
  const lastTramite = await Tramite.findOne({
    order: [["numeroTramite", "DESC"]],
  });

  tramite.numeroTramite = lastTramite
    ? lastTramite.numeroTramite + 1
    : process.env.TRAMITE;
  // :1; // Iniciar en 1 si no hay registros
});

// beforeUpdate para verificar si el estado cambia a RECHAZADO y automáticamente ajuste el campo activo:
Tramite.addHook("beforeUpdate", async (tramite) => {
  if (tramite.estado === "RECHAZADO") {
    tramite.activo = false;
  }
});

// ** Relaciones
// 1 tramite pertenece a 1 departamento remitente
Tramite.belongsTo(Departamento, {
  foreignKey: "departamentoRemitenteId", // campo en la tabla Tramite que contiene el ID del departamento
  targetKey: "id", // campo en la tabla Departamento que se enlaza
  as: "departamentoRemitente", // Alias para esta relación
});

Tramite.hasMany(TramiteArchivo, {
  foreignKey: "tramiteId",
  sourceKey: "id",
  as: "tramiteArchivos",
});

TramiteArchivo.belongsTo(Tramite, {
  foreignKey: "tramiteId",
  targetKey: "id",
  as: "tramite",
});

Tramite.hasMany(TramiteObservacion, {
  foreignKey: "tramiteId",
  sourceKey: "id",
  as: "tramiteObservaciones",
});

TramiteObservacion.belongsTo(Tramite, {
  foreignKey: "tramiteId",
  targetKey: "id",
  as: "observaciones",
});

TramiteEliminacion.belongsTo(Tramite, {
  foreignKey: "tramiteId",
  targetKey: "id",
});

TramiteHistorialEstado.belongsTo(Tramite, {
  foreignKey: "tramiteId",
  targetKey: "id",
});

TramiteAsignacion.belongsTo(Tramite, {
  foreignKey: "tramiteId",
  targetKey: "id",
});

// 1 departamento remitente puede tener muchos tramites
Departamento.hasMany(Tramite, {
  foreignKey: "departamentoRemitenteId",
  sourceKey: "id",
  as: "tramitesRemitidos", // Alias para la relación inversa (remitente)
});

// Relación entre Tramite y Empleado como remitente
Tramite.belongsTo(Empleado, {
  foreignKey: "remitenteId", // Este es el campo que almacena el id del remitente
  targetKey: "id",
  as: "remitente", // Alias que usarás en las consultas
});
/*
// Relación entre Tramite y Empleado como destinatario
Tramite.belongsTo(Empleado, {
  foreignKey: "destinatarioId", // Este es el campo que almacena el id del destinatario
  targetKey: "id",
  as: "destinatario", // Alias para el destinatario en las consultas
});
*/

// 1 Tramite puede tener 1 departamento asigado del usuario de creacion
Tramite.belongsTo(Departamento, {
  foreignKey: "departamentoTramiteId",
  targetKey: "id",
  as: "departamentoUsuarioCreacion",
});
