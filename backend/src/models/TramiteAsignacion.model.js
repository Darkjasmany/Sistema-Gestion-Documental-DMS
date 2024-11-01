import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const TramiteAsignacion = sequelize.define(
  "tramiteAsignacion",
  {
    tramiteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tramite",
        key: "id",
      },
    },
    usuarioRevisorId: {
      type: DataTypes.BIGINT,
      references: {
        model: "usuario",
        key: "id",
      },
      allowNull: false,
    },
    fechaAsignacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "tramiteAsignacion",
    timestamps: false,
  }
);
