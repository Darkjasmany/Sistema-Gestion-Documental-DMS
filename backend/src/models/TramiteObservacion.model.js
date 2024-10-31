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
    usuarioId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id",
      },
      observacion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
  },
  {
    tableName: "tramiteObservacion",
    hooks: {
      beforeSave: (TramiteObservacion) => {
        TramiteObservacion.observacion = TramiteObservacion.observacion.trim();
      },
    },
  }
);
