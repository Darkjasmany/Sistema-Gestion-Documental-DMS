import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const TramiteObservacion = sequelize.define(
  "tramiteObservacion",
  {
    tramiteId: {
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
    usuarioCreacionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "tramiteObservacion",
    timestamps: false,
    hooks: {
      beforeSave: (TramiteObservacion) => {
        TramiteObservacion.observacion = TramiteObservacion.observacion.trim();
      },
    },
  }
);
