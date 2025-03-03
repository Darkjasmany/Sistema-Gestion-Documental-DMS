import { sequelize } from "../config/db.config.js";
import { DataTypes } from "sequelize";

export const TramiteArchivo = sequelize.define(
  "tramite_archivo",
  {
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    original_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ruta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tramite_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tramite",
        key: "id",
      },
    },
    usuario_creacion: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id",
      },
    },
    estado_carga: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "INGRESADO",
      validate: {
        isIn: [
          [
            "INGRESADO",
            "PENDIENTE",
            "POR_REVISAR",
            "COMPLETADO",
            "DESPACHADO",
            "FINALIZADO",
            "POR_CORREGIR",
            "RECHAZADO",
          ],
        ],
      },
    },
  },
  {
    tableName: "tramite_archivo",
  }
);
