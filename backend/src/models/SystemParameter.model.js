import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const SystemParameter = sequelize.define(
  "SystemParameter",
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
  },
  {
    tableName: "SystemParameter",
    timestamps: false,
  }
);
