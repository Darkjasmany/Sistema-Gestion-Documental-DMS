import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.config.js";

export const TramiteHistorialEstado = sequelize.define(
  "tramite_historial_estado",
  {
    tramite_id: {
      type: DataTypes.BIGINT,
      references: {
        model: "tramite",
        key: "id",
      },
      allowNull: false,
    },
    estado_anterior: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    estado_actual: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    fecha_cambio: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    usuario_creacion: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "usuario",
        key: "id",
      },
    },
  },
  {
    tableName: "tramite_historial_estado",
    timestamps: false,
  }
);
