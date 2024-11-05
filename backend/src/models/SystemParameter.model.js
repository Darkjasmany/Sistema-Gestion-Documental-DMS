import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const ParametroSistema = sequelize.define(
  "sis_parametros",
  {
    clave: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    valor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "sis_parametros",
    timestamps: false,
  }
);
