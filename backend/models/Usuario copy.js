import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Importa tu conexión de sequelize
// import generarId from "../helpers/generarId.js"; // Asumiendo que tienes esta función

// Expresión de clase
const Usuario = class extends Model {
  // Puedes agregar métodos o validaciones si es necesario
};

// Definir el esquema del modelo usando init
Usuario.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email único
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Contraseña encriptada
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      // defaultValue: generarId(), // Usamos el helper para generar el token
    },
    confirmado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // No confirmado por defecto
    },
  },
  {
    sequelize, // Usamos la instancia de conexión que definiste
    modelName: "Usuario", // Nombre del modelo
    timestamps: true, // Incluye las columnas `createdAt` y `updatedAt`
    tableName: "usuarios", // Nombre de la tabla en la base de datos
  }
);
/*
// Sincronizar la base de datos
sequelize
  .sync()
  .then(() => {
    console.log("Tablas sincronizadas con éxito");
  })
  .catch((error) => {
    console.error("Error al sincronizar las tablas:", error);
  });
*/
export default Usuario;
