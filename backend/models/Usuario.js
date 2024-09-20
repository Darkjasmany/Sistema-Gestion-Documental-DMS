import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export default (sequelize) => {
  class Usuario extends Model {}

  Usuario.init(
    {
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
        allowNull: false, // Asegúrate de hashear la contraseña antes de guardar
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
    },
    {
      sequelize, // Asegúrate de pasar la instancia de Sequelize
      modelName: "Usuario", // Nombre del modelo
      tableName: "usuarios", // Nombre de la tabla en la BD
      timestamps: true, // Incluye `createdAt` y `updatedAt`
    }
  );

  return Usuario;
};
