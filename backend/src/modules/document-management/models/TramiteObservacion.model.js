import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const TramiteObservacion = sequelize.define(
  "tramite_observacion",
  {
    tramite_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tramite",
        key: "id",
      },
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    usuario_creacion: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "tramite_observacion",
    timestamps: false,
    hooks: {
      beforeSave: (TramiteObservacion) => {
        TramiteObservacion.observacion = TramiteObservacion.observacion.trim();
      },
    },
  }
);
/*
TramiteObservacion.belongsTo(Usuario, {
  foreignKey: "usuario_creacion",
  targetKey: "id",
  as: "usuarioCreacionObservacion",
});

Usuario.hasMany(TramiteObservacion, {
  foreignKey: "usuario_creacion",
  as: "usuarioCreacion",
});
*/

/*
// Importación dinámica de Usuario (aquí está la clave):
import("./Usuario.model.js").then(({ Usuario }) => {
  // <-- Importante
  TramiteObservacion.belongsTo(Usuario, {
    as: "usuarioCreacionObservacion", // Alias (recuerda usar este alias en tus consultas)
    foreignKey: "usuario_creacion",
    targetKey: "id",
  });

  Usuario.hasMany(TramiteObservacion, {
    foreignKey: "usuario_creacion",
    as: "tramiteObservaciones", // Alias para la relación inversa
    sourceKey: "id",
  });
});
*/

/*
Usuario.belongsTo(TramiteObservacion, {
  foreignKey: "usuario_creacion",
  targetKey: "id",
});
TramiteObservacion.hasMany(Usuario, {
  foreignKey: "usuario_creacion",
  sourceKey: "id",
});
*/
