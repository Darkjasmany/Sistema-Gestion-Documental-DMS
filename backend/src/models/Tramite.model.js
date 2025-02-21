import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js"; // Importamos la conexión
import { Departamento } from "./Departamento.model.js";
import { Empleado } from "./Empleado.model.js";
import { TramiteHistorialEstado } from "./TramiteHistorialEstado.model.js";
import { TramiteAsignacion } from "./TramiteAsignacion.model.js";
import { TramiteArchivo } from "./TramiteArchivo.model.js";
import { TramiteObservacion } from "./TramiteObservacion.model.js";
import { TramiteEliminacion } from "./TramiteEliminacion.model.js";
import { config } from "../config/parametros.config.js";
import { TramiteDestinatario } from "./TramiteDestinatario.model.js";
import { Usuario } from "./Usuario.model.js";
export const Tramite = sequelize.define(
  "tramite",
  {
    numero_tramite: {
      // type: DataTypes.STRING(50),
      type: DataTypes.INTEGER,
      allowNull: false, // unique: true,
    },
    asunto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    departamento_remitente: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "departamento",
        key: "id",
      },
    },
    remitente_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "empleado",
        key: "id",
      },
    },
    numero_oficio_remitente: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    usuario_creacion: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    usuario_actualizacion: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    departamento_tramite: {
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
    externo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fecha_documento: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true, // Valida que sea una fecha válida
      },
    },
    fecha_contestacion: {
      type: DataTypes.DATEONLY,
      allowNull: true, // El campo puede estar vacío inicialmente
      validate: {
        isDate: true, // Valida que sea una fecha válida
      },
    },
    fecha_despacho: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    fecha_entrega: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
    referencia_tramite: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    numero_oficio: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    numero_oficio_modificado: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    numero_tramite_modificado: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    usuario_revisor: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "tramite",
    hooks: {
      beforeSave: (tramite) => {
        tramite.asunto = tramite.asunto.trim();
        tramite.descripcion = tramite.descripcion.trim();
        tramite.numero_oficio_remitente =
          tramite.numero_oficio_remitente.trim();
        if (tramite.numero_oficio) {
          tramite.numero_oficio = tramite.numero_oficio.trim();
        }
        if (tramite.numero_oficio_modificado) {
          tramite.numero_oficio_modificado =
            tramite.numero_oficio_modificado.trim();
        }
      },
    },
  }
);

// ** AGREGAR EL HOOK
//beforeValidate para el campo numeroTramite, garantizas que numeroTramite se establezca antes de que se valide el objeto, evitando que se produzca la violación de la restricción de no nulo.
Tramite.addHook("beforeValidate", async (tramite) => {
  // console.log(tramite);
  if (tramite.referencia_tramite) {
    // Validar si existe un trámite con la referencia proporcionada
    const referencia = tramite.referencia_tramite.toString();
    const tramiteExistente = await Tramite.findOne({
      where: { numero_tramite: referencia }, // La comparación será string = string
    });
    // console.log(tramiteExistente);
    if (tramiteExistente) {
      // Si existe, asignar el mismo número de trámite
      tramite.numero_tramite = tramiteExistente.numero_tramite;
    } else {
      throw new Error(
        "La referencia proporcionada no corresponde a un trámite existente."
      );
    }
  } else {
    // Si no hay referencia, asignar un número de trámite
    const lastTramite = await Tramite.findOne({
      order: [["numero_tramite", "DESC"]],
    });
    tramite.numero_tramite = lastTramite
      ? lastTramite.numero_tramite + 1
      : config.TRAMITE; // : process.env.TRAMITE; // :1; // Iniciar en 1 si no hay registros
  }
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
  as: "departamentoRemitente", // Alias para esta relación
  foreignKey: "departamento_remitente", // campo en la tabla Tramite que contiene el ID del departamento
  targetKey: "id", // campo en la tabla Departamento que se enlaza
});

Tramite.hasMany(TramiteArchivo, {
  foreignKey: "tramite_id",
  sourceKey: "id",
  as: "tramiteArchivos",
});

TramiteArchivo.belongsTo(Tramite, {
  foreignKey: "tramite_id",
  targetKey: "id",
  as: "tramite",
});

Tramite.hasMany(TramiteObservacion, {
  foreignKey: "tramite_id",
  as: "tramiteObservaciones",
});

TramiteObservacion.belongsTo(Tramite, {
  foreignKey: "tramite_id",
  targetKey: "id",
  as: "observaciones",
});

TramiteEliminacion.belongsTo(Tramite, {
  foreignKey: "tramite_id",
  targetKey: "id",
});

TramiteHistorialEstado.belongsTo(Tramite, {
  foreignKey: "tramite_id",
  targetKey: "id",
});

TramiteAsignacion.belongsTo(Tramite, {
  foreignKey: "tramite_id",
  targetKey: "id",
});

// 1 departamento remitente puede tener muchos tramites
Departamento.hasMany(Tramite, {
  foreignKey: "departamento_remitente", // sourceKey: "id", // as: "tramitesRemitidos", // Alias para la relación inversa (remitente)
});

Empleado.hasMany(Tramite, { foreignKey: "remitente_id" });

// Relación entre Tramite y Empleado como remitente

Tramite.belongsTo(Empleado, {
  as: "remitente", // Alias que usarás en las consultas
  foreignKey: "remitente_id", // Este es el campo que almacena el id del remitente
  targetKey: "id",
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
  foreignKey: "departamento_tramite",
  targetKey: "id",
  as: "departamentoUsuarioCreacion",
});

Tramite.hasMany(TramiteDestinatario, {
  foreignKey: "tramite_id",
  as: "destinatarios",
});
