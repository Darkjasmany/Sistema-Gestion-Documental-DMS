import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const TramiteAsignacion = sequelize.define(
  "tramiteAsignacion",
  {
    tramiteId: {
      type: DataTypes.BIGINT,
      references: {
        model: "tramite",
        key: "id",
      },
      allowNull: false,
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
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tramiteAsignacion",
    hooks: {
      beforeSave: (tramiteAsignacion) => {
        if (tramiteAsignacion.descripcion)
          tramiteAsignacion.descripcion = tramiteAsignacion.descripcion.trim();
      },
    },
  }
);
