import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Usuario = sequelize.define("usuario", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true, //Generado automáticamente
  },
  nombres: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    trim: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, //Asegúrate de hashear la contraseña antes de guardar
  },
  telefono: {
    type: DataTypes.STRING,
    defaultValue: null,
    trim: true,
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null, // Puedes generar el token dinámicamente si es necesario
  },
  confirmado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
