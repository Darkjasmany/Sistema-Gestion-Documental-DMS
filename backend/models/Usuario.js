import { Sequelize, Model, DataTypes } from "sequelize";

const Usuarios = Sequelize.Model({
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    trim: true,
  },
});

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
