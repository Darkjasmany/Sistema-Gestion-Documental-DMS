import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.config.js";
import { Departamento } from "./Departamento.model.js";
import { Tramite } from "../../document-management/models/Tramite.model.js";
import { TramiteAsignacion } from "../../document-management/models/TramiteAsignacion.model.js";
import { TramiteArchivo } from "../../document-management/models/TramiteArchivo.model.js";
import { TramiteHistorialEstado } from "../../document-management/models/TramiteHistorialEstado.model.js";
import { TramiteEliminacion } from "../../document-management/models/TramiteEliminacion.model.js";
import { TramiteObservacion } from "../../document-management/models/TramiteObservacion.model.js";
import { generarId } from "../../../utils/generarId.js";
import { passwordHash } from "../../../utils/passwordHash.js";
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
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "USUARIO", // Valor por defecto 'usuario'
      validate: {
        isIn: [["ADMIN", "COORDINADOR", "REVISOR", "USUARIO", "DESPACHADOR"]],
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
    departamento_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
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
      beforeSave: async (usuario) => {
        usuario.nombres = usuario.nombres.trim();
        usuario.apellidos = usuario.apellidos.trim();
        usuario.email = usuario.email.trim().toLowerCase();

        // *changed("password") se asegura de que la contraseña solo sea hasheada si fue modificada o creada por primera vez.
        if (usuario.changed("password")) {
          usuario.password = usuario.password.trim();
          usuario.password = await passwordHash(usuario.password);
        }
      },
    },
  }
);

// Método personalizado para comprobar el password
Usuario.prototype.comprobarPassword = async function (passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

// * Relaciones

// * Trámite
// 1 tramite pertenece a 1 usuarioCreacion
// Se creara el campo usuarioCreacionId de la relacion del modelo Usuario si no se define
Tramite.belongsTo(Usuario, {
  foreignKey: "usuario_creacion", // Campo que se crea en la tabla Tramite
  targetKey: "id", // Con qué lo va a enlazar
  as: "usuario",
});
// 1 usuario puede crear  muchos tramites
Usuario.hasMany(Tramite, {
  foreignKey: "usuario_creacion", // NombreCampo
  sourceKey: "id", // Con qué lo va a enlazar
});

Tramite.belongsTo(Usuario, {
  foreignKey: "usuario_despacho",
  targetKey: "id",
  as: "usuarioDespacho",
});

Usuario.hasHook(Tramite, {
  foreignKey: "usuario_despacho",
  sourceKey: "id",
  as: "usuario_despacho",
});

Tramite.belongsTo(Usuario, {
  foreignKey: "usuario_actualizacion",
  targetKey: "id",
  as: "usuarioActualizacion",
});

Usuario.hasMany(Tramite, {
  foreignKey: "usuario_actualizacion",
  sourceKey: "id",
});

Tramite.belongsTo(Usuario, {
  foreignKey: "usuario_revisor",
  targetKey: "id",
  as: "usuarioRevisor",
});

Usuario.hasMany(Tramite, {
  foreignKey: "usuario_revisor",
  sourceKey: "id",
});

Usuario.hasMany(TramiteArchivo, {
  foreignKey: "usuario_creacion",
  sourceKey: "id",
});

TramiteEliminacion.belongsTo(Usuario, {
  foreignKey: "usuario_eliminacion",
  targetKey: "id",
  as: "usuarioEliminacion",
});

Usuario.hasMany(TramiteEliminacion, {
  foreignKey: "usuario_eliminacion",
  sourceKey: "id",
});

// * TramiteAsignacion
// 1 tramite pertenece a 1 usuario revisor
TramiteAsignacion.belongsTo(Usuario, {
  foreignKey: "usuario_revisor", // Campo que se crea en la tabla Tramite
  targetKey: "id", // Con qué lo va a enlazar
});

Usuario.hasMany(TramiteAsignacion, {
  foreignKey: "usuario_revisor", // Campo que se crea en la tabla Tramite
  sourceKey: "id", // Con qué lo va a enlazar
});

TramiteHistorialEstado.belongsTo(Usuario, {
  foreignKey: "usuario_creacion", // Campo que se crea en la tabla Tramite
  targetKey: "id", // Con qué lo va a enlazar
});

// 1 revisor puede tener muchos tramites asignados
Usuario.hasMany(TramiteAsignacion, {
  foreignKey: "usuario_revisor", // NombreCampo
  sourceKey: "id", // Con qué lo va a enlazar
});

// * Departamento
// Relación: Un usuario pertenece a un departamento
Usuario.belongsTo(Departamento, {
  foreignKey: "departamento_id", // campo en Usuario que contiene el ID del departamento
  targetKey: "id", // clave primaria en Departamento
});
// Relación: Un departamento puede tener muchos usuarios
Departamento.hasMany(Usuario, {
  foreignKey: "departamento_id", // campo en Usuario que contiene el ID del departamento
  sourceKey: "id", // clave primaria en Departamento
});

// 1 usuario puede tener muchas observaciones
Usuario.hasMany(TramiteObservacion, {
  foreignKey: "usuario_creacion", // Clave foránea en tramite_observacion
  sourceKey: "id", // Clave primaria en Usuario
  as: "tramiteObservaciones", // Alias (opcional)
});

// 1 observacion pertenece a 1 usuario
TramiteObservacion.belongsTo(Usuario, {
  as: "usuarioCreacionObservacion", // Alias
  foreignKey: "usuario_creacion", // Clave foránea en tramite_observacion
  targetKey: "id", // Clave primaria en Usuario
});
