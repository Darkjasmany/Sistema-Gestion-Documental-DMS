import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { Usuario } from "./Usuario.model.js";

export const IntentoFallido = sequelize.define("intento_fallido", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  usuarioId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: Usuario,
      key: "id",
    },
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  exito: {
    type: DataTypes.BOOLEAN,
    defaultValue: null,
  },
});

//TODO: Terminar el proceso de registrar intento de ataque por fuerza bruta y bloquear el usuario si se equivoca por mas de 5 ocaciones al digitar la contraseña
