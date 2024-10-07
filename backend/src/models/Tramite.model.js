import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // Importamos la conexión
import { Departamento } from "./Departamento.model.js";
import { Empleado } from "./Empleado.model.js";
import { TramiteHistorialEstado } from "./TramiteHistorialEstado.model.js";
import { TramiteAsignacion } from "./TramiteAsignacion.model.js";

export const Tramite = sequelize.define(
  "tramite",
  {
    numeroTramite: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
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
        model: "departamento", // nombre de la tabla de referencia
        key: "id", // clave primaria de la tabla de referencia
      },
    },
    remitenteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "empleado", // nombre de la tabla de referencia
        key: "id", // clave primaria de la tabla de referencia
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
    fechaDocumento: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true, // Valida que sea una fecha válida
      },
    },
    referenciaTramite: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    numeroOficioDespacho: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    departamentoDestinatarioId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "departamento", // nombre de la tabla de referencia
        key: "id", // clave primaria de la tabla de referencia
      },
    },
    destinatarioId: {
      type: DataTypes.BIGINT,
      defaultValue: null,
      references: {
        model: "empleado", // nombre de la tabla de referencia
        key: "id", // clave primaria de la tabla de referencia
      },
    },
    fechaMaximaContestacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Usamos Sequelize.NOW para la fecha actual
    },
    fechaDespacho: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Usamos Sequelize.NOW para la fecha actual
    },
    fechaEntregaFisica: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Usamos Sequelize.NOW para la fecha actual
    },
    usuarioCreacionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuario", // nombre de la tabla de referencia
        key: "id", // clave primaria de la tabla de referencia
      },
    },
    departamentoUsuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "departamento",
        key: "id",
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
            "CORRECCION_PENDIENTE",
            "FINALIZADO",
          ],
        ],
      },
    },
  },
  {
    tableName: "tramite",
    hooks: {
      beforeSave: (tramite) => {
        tramite.asunto = tramite.asunto.trim();
        tramite.numeroTramite = tramite.numeroTramite.trim();
        tramite.descripcion = tramite.descripcion.trim();
        if (tramite.numeroOficioDespacho) {
          tramite.numeroOficioDespacho = tramite.numeroOficioDespacho.trim();
        }
      },
    },
  }
);

// ** Relaciones
// 1 tramite pertenece a 1 departamento remitente
Tramite.belongsTo(Departamento, {
  foreignKey: "departamentoRemitenteId", // campo en la tabla Tramite que contiene el ID del departamento
  targetKey: "id", // campo en la tabla Departamento que se enlaza
  as: "departamentoRemitente", // Alias para esta relación
});

// 1 tramite es despachado a 1 departamento destino
Tramite.belongsTo(Departamento, {
  foreignKey: "departamentoDestinatarioId",
  targetKey: "id",
  as: "departamentoDestinatario", // Alias para la relación destino
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

// 1 departamento destino puede tener muchos tramites
Departamento.hasMany(Tramite, {
  foreignKey: "departamentoDestinatarioId",
  sourceKey: "id",
  as: "tramitesRecibidos", // Alias para la relación inversa (destinatario)
});

// Relación entre Tramite y Empleado como remitente
Tramite.belongsTo(Empleado, {
  foreignKey: "remitenteId", // Este es el campo que almacena el id del remitente
  targetKey: "id",
  as: "remitente", // Alias que usarás en las consultas
});

// Relación entre Tramite y Empleado como destinatario
Tramite.belongsTo(Empleado, {
  foreignKey: "destinatarioId", // Este es el campo que almacena el id del destinatario
  targetKey: "id",
  as: "destinatario", // Alias para el destinatario en las consultas
});

// 1 Tramite puede tener 1 departamento asigado del usuario de creacion
Tramite.belongsTo(Departamento, {
  foreignKey: "departamentoUsuarioId",
  targetKey: "id",
  as: "departamentoUsuarioCreacion",
});
