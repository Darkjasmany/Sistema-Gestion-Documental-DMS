import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.config.js";

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
