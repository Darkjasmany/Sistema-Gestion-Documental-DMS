import { sequelize } from "../config/db.config.js";
import { DataTypes } from "sequelize";

export const Archivo = sequelize.define(
  "archivo",
  {
    ruta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tramiteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tramite",
        key: "id",
      },
    },
    usuarioCreacionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id",
      },
    },
  },
  {
    tableName: "archivo",
  }
);
