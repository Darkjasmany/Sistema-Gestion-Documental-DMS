import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { Departamento } from "./Departamento.model.js";

export const Despachador = sequelize.define(
  "despachador",
  {
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departamento_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "departamento", // nombre de la tabla de referencia
        key: "id", // clave primaria de la tabla de referencia
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "despachador",
    hooks: {
      beforeSave: (despachador) => {
        despachador.nombres = despachador.nombres.trim();
        despachador.apellidos = despachador.apellidos.trim();
      },
    },
  }
);

Despachador.belongsTo(Departamento, {
  as: "departamentoDespachador",
  foreignKey: "departamento_id",
  targetKey: "id",
});

Departamento.hasMany(Despachador, {
  foreignKey: "departamento_id",
});
