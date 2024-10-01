import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Departamento = sequelize.define(
  "departamento",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coordinadorId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "departamento",
    hooks: {
      beforeSave: (departamento) => {
        departamento.nombre = departamento.nombre.trim();
      },
    },
  }
);
