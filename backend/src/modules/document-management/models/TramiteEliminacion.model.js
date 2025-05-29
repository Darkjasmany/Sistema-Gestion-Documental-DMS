import { sequelize } from "../../../config/db.config.js";

export const TramiteEliminacion = sequelize.define(
  "tramite_eliminacion",
  {
    tramite_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tramite",
        key: "id",
      },
    },
    usuario_eliminacion: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    motivo_eliminacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fecha_eliminacion: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true,
      },
    },
  },
  {
    tableName: "tramite_eliminacion",
    timestamps: false,
    hooks: {
      beforeSave: (TramiteEliminacion) => {
        TramiteEliminacion.motivo_eliminacion =
          TramiteEliminacion.motivo_eliminacion.trim();
      },
    },
  }
);
