import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Tramite } from "./Tramite.model.js";

export const Departamento = sequelize.define(
  "departamento",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coordinadorId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 1, // Valor por defecto para el departamento "Jefe de Sistemas"
    },
  },
  {
    tableName: "departamento",
  }
);

// * Relaciones entre Departamento y Tramite
Departamento.hasMany(Tramite, {
  foreignKey: "coordinadorId",
});
Tramite.belongsTo(Departamento, {
  foreignKey: "coordinadorId",
});

Departamento.hasMany(Tramite, {
  foreignKey: "departamentoId",
});
Tramite.belongsTo(Departamento, {
  foreignKey: "departamentoId",
});
