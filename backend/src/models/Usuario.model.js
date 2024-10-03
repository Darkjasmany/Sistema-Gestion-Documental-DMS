import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // Importamos la conexión
import { Tramite } from "./Tramite.model.js";
import { TramiteAsignacion } from "./TramiteAsignacion.model.js";
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
      validate: {
        isEmail: true, // validación para formato de email
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true, // campo opcional
      validate: {
        isNumeric: true, // validación para que solo acepte números
        len: [10, 10], // Valida que la longitud sea exactamente de 10 caracteres
      },
    },
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "usuario", // Valor por defecto 'usuario'
      validate: {
        isIn: [["admin", "coordinador", "revisor", "usuario"]],
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
      references: {
        model: "departamento", // nombre de la tabla de referencia
        key: "id", // clave primaria de la tabla de referencia
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

// ** Relaciones

// * Trámite
// 1 tramite pertenece a 1 usuarioCreacion
// Se creara el campo usuarioCreacionId de la relacion del modelo Usuario si no se define
Tramite.belongsTo(Usuario, {
  foreignKey: "usuarioCreacionId", // Campo que se crea en la tabla Tramite
  targetKey: "id", // Con qué lo va a enlazar
});
// 1 usuario puede crear  muchos tramites
Usuario.hasMany(Tramite, {
  foreignKey: "usuarioCreacionId", // NombreCampo
  sourceKey: "id", // Con qué lo va a enlazar
});

// * TramiteAsignacion
// 1 tramite pertenece a 1 usuario revisor
TramiteAsignacion.belongsTo(Usuario, {
  foreignKey: "usuarioRevisorId", // Campo que se crea en la tabla Tramite
  targetKey: "id", // Con qué lo va a enlazar
});
// 1 revisor puede tener muchos tramites asignados
Usuario.hasMany(TramiteAsignacion, {
  foreignKey: "usuarioRevisorId", // NombreCampo
  sourceKey: "id", // Con qué lo va a enlazar
});

// * Departamento
// Relación: Un usuario pertenece a un departamento
Usuario.belongsTo(Departamento, {
  foreignKey: "departamentoId", // campo en Usuario que contiene el ID del departamento
  targetKey: "id", // clave primaria en Departamento
});
// Relación: Un departamento puede tener muchos usuarios
Departamento.hasMany(Usuario, {
  foreignKey: "departamentoId", // campo en Usuario que contiene el ID del departamento
  sourceKey: "id", // clave primaria en Departamento
});
