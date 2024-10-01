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

// ** Relaciones
