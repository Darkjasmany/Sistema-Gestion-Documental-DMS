import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // Importamos la conexión
import { Tarea } from "./Tarea.js";
import { generarId } from "../helpers/generarId.helpers.js";

export const Usuario = sequelize.define(
  "usuario",
  {
    // Se puede omitir y el ORM crea la columna ID por defecto
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true, //Generado automáticamente
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
      // trim: true, // trim no es necesario en Sequelize
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
      // trim: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // trim: true,
    },
    password: {
      type: DataTypes.STRING,
      // allowNull: false, //Asegúrate de hashear la contraseña antes de guardar
      defaultValue: null,
    },
    telefono: {
      type: DataTypes.STRING,
      defaultValue: null,
      // trim: true,
    },
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "usuario", // Valor por defecto 'usuario'
      validate: {
        isIn: [["admin", "usuario"]], // Solo permite 'admin' o 'usuario'
      },
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: generarId(), // generar el token dinámicamente
    },
    confirmado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "usuario", // Nombre de la tabla en la BD
    timestamps: true, // Incluye `createdAt` y `updatedAt`
  }
);

// TODO: Definir Relaciones
// 1 usuario puede tener muchas tareas
Usuario.hasMany(Tarea, {
  foreignKey: "usuarioId", // NombreCampo
  sourceKey: "id", // Con que lo va a enlazar
});

// Muchas tareas pueden pertenecer a 1 mismo usuario
Tarea.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  targetId: "id",
});
