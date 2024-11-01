import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { Tramite } from "./Tramite.model.js";

export const TramiteEliminacion = sequelize.define(
  "tramiteEliminacion",
  {
    tramiteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tramite",
        key: "id",
      },
    },
    usuarioEliminacionId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    motivoEliminacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fechaEliminacion: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
  },
  {
    tableName: "tramiteEliminacion",
    timestamps: false,
    hooks: {
      beforeSave: (TramiteEliminacion) => {
        TramiteEliminacion.motivoEliminacion =
          TramiteEliminacion.motivoEliminacion.trim();
      },
    },
  }
);
