import { sequelize } from "../config/db.config.js";
import { DataTypes } from "sequelize";

export const TramiteSecuencia = sequelize.define(
  "tramite_secuencia",
  {
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    valor_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "tramite_secuencia",
  }
);
