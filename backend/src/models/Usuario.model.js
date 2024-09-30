import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // Importamos la conexión
import { Tramite } from "./Tramite.model.js";
import { Departamento } from "./Departamento.model.js";
import { generarId } from "../utils/generarId.js";
import bcrypt from "bcrypt";

export const Usuario = sequelize.define(
  "usuario",
  {
    // Se puede omitir y el ORM crea la columna ID por defecto
    // id: {
    //   type: DataTypes.BIGINT,
    //   primaryKey: true,
    //   autoIncrement: true, //Generado automáticamente
    // },
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
      defaultValue: "USUARIO", // Valor por defecto 'usuario'
      validate: {
        isIn: [["ADMIN", "COORDINADOR", "REVISOR", "USUARIO"]],
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
    departamentoId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 1, // Valor por defecto para el departamento "Sistemas"
      references: {
        model: "departamento",
        key: "id",
      },
    },
  },
  {
    tableName: "usuario", // Nombre de la tabla en la BD
    // timestamps: true, // Incluye `createdAt` y `updatedAt`
    // * Hook para hashear el password antes de crear o actualizar
    hooks: {
      // * beforeSave es más eficiente y simplifica el código al abarcar tanto la creación como la actualización que beforeCreate
      // Hook para eliminar los espacios en Blanco y hashear password
      beforeSave: async (usuario) => {
        usuario.nombres = usuario.nombres.trim();
        usuario.apellidos = usuario.apellidos.trim();
        usuario.email = usuario.email.trim().toLowerCase();

        // *changed("password") se asegura de que la contraseña solo sea hasheada si fue modificada o creada por primera vez.
        if (usuario.changed("password")) {
          usuario.password = usuario.password.trim();
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
    },
  }
);

// * Definir Relaciones
// TRAMITE
// 1 usuario puede tener muchas tareas
Usuario.hasMany(Tramite, {
  foreignKey: "usuarioId", // NombreCampo
  sourceKey: "id", // Con que lo va a enlazar
});

// Muchas tareas pueden pertenecer a 1 mismo usuario
Tramite.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  targetId: "id",
});

// Departamento
Usuario.belongsTo(Departamento, {
  foreignKey: "departamentoId",
  targetId: "id",
});
