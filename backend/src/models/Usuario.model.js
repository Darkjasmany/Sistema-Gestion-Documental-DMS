import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "../config/db.js"; // Importamos la conexión
import { Tarea } from "./Tarea.model.js";
import { generarId } from "../utils/generarId.js";

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
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      defaultValue: null,
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
      defaultValue: () => generarId(), // Llamar a la función para que se ejecute
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
    // TODO: Hook para hashear el password antes de crear o actualizar
    hooks: {
      // TODO: beforeSave es más eficiente y simplifica el código al abarcar tanto la creación como la actualización que beforeCreate
      // Hook para eliminar los espacios en Blanco y hashear password
      beforeSave: async (usuario) => {
        usuario.nombres = usuario.nombres.trim();
        usuario.apellidos = usuario.apellidos.trim();
        usuario.email = usuario.email.trim();

        // TODO: changed("password") se asegura de que la contraseña solo sea hasheada si fue modificada o creada por primera vez.
        if (usuario.changed("password")) {
          usuario.password = usuario.password.trim();
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
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
