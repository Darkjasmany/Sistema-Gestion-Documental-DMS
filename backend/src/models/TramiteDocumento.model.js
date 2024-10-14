import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const TramiteDocumento = sequelize.define(
  "tramiteDocumento",
  {
    tramiteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tramite", // Nombre de la tabla de referencia
        key: "id", // Clave primaria de la tabla de referencia
      },
    },
    nombreArchivo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    tipoArchivo: {
      type: DataTypes.STRING(50), // Ejemplo: "pdf", "docx", etc.
      allowNull: false,
    },
    rutaArchivo: {
      type: DataTypes.STRING(255),
      allowNull: false, // Ruta donde se almacena el archivo
    },
    fechaCarga: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Fecha y hora de carga
    },
    usuarioCargaId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuario", // Nombre de la tabla de referencia
        key: "id", // Clave primaria de la tabla de referencia
      },
    },
  },
  {
    tableName: "tramiteDocumento",
    hooks: {
      beforeSave: (tramiteDocumento) => {
        tramiteDocumento.nombreArchivo = tramiteDocumento.nombreArchivo.trim();
        tramiteDocumento.tipoArchivo = tramiteDocumento.tipoArchivo.trim();
      },
    },
  }
);
