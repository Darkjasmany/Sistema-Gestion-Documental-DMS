import { sequelize } from "../../../config/db.config.js";

export const TramiteAsignacion = sequelize.define(
  "tramite_asignacion",
  {
    tramite_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tramite",
        key: "id",
      },
    },
    usuario_revisor: {
      type: DataTypes.BIGINT,
      references: {
        model: "usuario",
        key: "id",
      },
      allowNull: false,
    },
    fecha_asignacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "tramite_asignacion",
    timestamps: false,
  }
);
