import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const ParametroSistema = sequelize.define(
  "sis_parametros",
  {
    clave: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    valor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    usuario_creacion: {
      type: DataTypes.BIGINT,
      references: {
        model: "usuario",
        key: "id",
      },
      allowNull: false,
    },
    usuario_actualizacion: {
      type: DataTypes.BIGINT,
      references: {
        model: "usuario",
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    tableName: "sis_parametros",
    hooks: {
      beforeSave: (Parametro) => {
        Parametro.clave = Parametro.clave.trim();
        Parametro.valor = Parametro.valor.trim();
        Parametro.descripcion = Parametro.descripcion.trim();
      },
    },
  }
);
