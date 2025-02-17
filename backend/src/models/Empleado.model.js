import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { Departamento } from "./Departamento.model.js";

export const Empleado = sequelize.define(
  "empleado",
  {
    cedula: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isInt: true, // Valida que solo contenga números enteros
        len: [10, 10], // Valida que la longitud sea exactamente de 10 caracteres
      },
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
      validate: {
        isEmail: true, // validación para formato de email
      },
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true, // campo opcional
      validate: {
        isNumeric: true, // validación para que solo acepte números
        len: [10, 10], // longitud para el teléfono
      },
    },
    departamento_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "departamento", // nombre de la tabla de referencia
        key: "id", // clave primaria de la tabla de referencia
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "empleado",
    hooks: {
      beforeSave: async (empleado) => {
        empleado.cedula = empleado.cedula.toString().trim();
        empleado.nombres = empleado.nombres.trim();
        empleado.apellidos = empleado.apellidos.trim();
        empleado.email = empleado.email.trim().toLowerCase();
        if (empleado.telefono) {
          empleado.telefono = empleado.telefono.trim();
        }
      },
    },
  }
);

// ** Relaciones
// 1 empleado solo puede estar en 1 departamento
Empleado.belongsTo(Departamento, {
  foreignKey: "departamento_id",
  targetKey: "id",
});
