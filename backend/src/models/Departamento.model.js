import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const Departamento = sequelize.define(
  "departamento",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coordinador_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 1, //TODO: Tengo que tener migrado todos los departamentos
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
