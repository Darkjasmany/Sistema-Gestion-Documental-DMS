import { Sequelize, Model, DataTypes } from "sequelize";

const Usuario = class extends Model {
  // Método estático para definir el esquema del modelo
  static initModel(Sequelize) {
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
          trim: true,
        },
        apellidos: {
          type: DataTypes.STRING,
          allowNull: false,
          trim: true,
        },
        email: {
          type: DataTypes,
          allowNull: false,
          unique: true, // Email único
          trim: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false, // Contraseña encriptada
        },
        telefono: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
          trim: true,
        },
        token: {
          type: DataTypes.STRING,
          allowNull: true,
          // defaultValue: generarId(), // Usamos el helper para generar el token
        },
        confirmado: {
          type: DataTypes.BOOLEAN,
          defaultValue: false, // No confirmado por defecto
        },
        fecha_creacion: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW, // Valor por defecto fecha actual
          field: "fecha_creación", // Para que coincida con el nombre en la base de datos
        },
      },
      {
        Sequelize,
        modelName: "Usuario", // Nombre del modelo
        timestamps: true, // Incluye las columnas `createdAt` y `updatedAt`
        tableName: "usuarios", // Nombre de la tabla en la base de datos
      }
    );
  }
};

export default Usuario;
// const Usuarios = Sequelize.Model({
//   nombre: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     trim: true,
//   },
// });

/*
const usuarioSchema = async () => {
  const query = `
     CREATE TABLE IF NOT EXISTS usuarios (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, -- Identificador único autogenerado
      nombres VARCHAR(100) NOT NULL,
      apellidos VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL, -- Email único y requerido
      password VARCHAR(150) NOT NULL, -- Contraseña encriptada
      rol VARCHAR(50) CHECK ( rol IN ( 'admin', 'usuario' ) ) DEFAULT 'usuario', -- Rol del usuario (admin o usuario)
      token VARCHAR(100) DEFAULT 'null',
      confirmado BOOLEAN DEFAULT FALSE,
      fecha_creación TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      fecha_actualización TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
 `;

  try {
    await conectarDB.query(query);
    console.log("Tabla 'usuarios' creada correctamente");
  } catch (error) {
    console.error("Error creando la tabla 'usuarios':", error);
  }
};

usuarioSchema();
*/
