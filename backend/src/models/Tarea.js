import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Tarea = sequelize.define(
  "tarea",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      defaultValue: null,
      trim: true,
    },
    numeroTramite: {
      type: DataTypes.STRING(50),
      allowNull: false,
      trim: true,
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "ingresada",
      validate: {
        isIn: [["ingresada", "pendiente", "completada", "entregada"]],
      },
    },
    fechaLimite: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
    done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "tarea",
    timestamps: true,
  }
);
