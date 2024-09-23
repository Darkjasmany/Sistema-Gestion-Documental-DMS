import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/db.js"; // Importamos la conexión
import { generarHora } from "../helpers/generarHora.helpers.js";

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
      allowNull: false,
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
    referenciaTramite: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    responsable: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    fechaDespacho: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Usamos Sequelize.NOW para la fecha actual
    },
    horaDespacho: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: generarHora(),
      // defaultValue: sequelize.literal("CURRENT_TIME"), // Hora actual sin fecha ni zona horaria
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
