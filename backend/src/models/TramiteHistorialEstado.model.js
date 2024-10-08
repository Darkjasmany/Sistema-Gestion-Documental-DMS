import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const TramiteHistorialEstado = sequelize.define(
  "tramiteHistorialEstado",
  {
    tramiteId: {
      type: DataTypes.BIGINT,
      references: {
        model: "tramite",
        key: "id",
      },
      allowNull: false,
    },
    estadoAnterior: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    estadoActual: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    fechaCambio: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    usuarioId: {
      type: DataTypes.BIGINT,
      references: {
        model: "usuario",
        key: "id",
      },
      allowNull: true, // Opcional
    },
  },
  {
    tableName: "tramiteHistorialEstado",
  }
);