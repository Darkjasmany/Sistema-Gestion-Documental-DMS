import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // Importamos la conexión

export const Tarea = sequelize.define(
  "tarea",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    asunto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    numeroTramite: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    remitente: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    departamenteRemitente: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    numeroOficioDespacho: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "ingresada",
      validate: {
        isIn: [["ingresada", "pendiente", "completada", "entregada"]],
      },
    },
    responsable: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    fechaDespacho: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
    horaDespacho: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
