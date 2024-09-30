import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // Importamos la conexión
import { generarHora } from "../utils/generarHora.js";

export const Tramite = sequelize.define(
  "tramite",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    asunto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    numeroTramite: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    remitente: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    departamenteRemitente: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    numeroOficioDespacho: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pendiente",
      validate: {
        isIn: [
          [
            "pendiente",
            "en_revision",
            "completado",
            "correccion",
            "finalizado",
          ],
        ],
      },
    },
    referenciaTramite: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    fechaDespacho: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Usamos Sequelize.NOW para la fecha actual
    },
    horaDespacho: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: generarHora(),
      // defaultValue: sequelize.literal("CURRENT_TIME"), // Hora actual sin fecha ni zona horaria
    },
    // Relación con el usuario que creó el trámite.
    usuarioId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 1,
    },
    revisorId: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    coordinadorId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "tramite",
    // timestamps: true,
    hooks: {
      beforeSave: (tramite) => {
        tramite.asunto = tramite.asunto.trim();
        tramite.numeroTramite = tramite.numeroTramite.trim();
        tramite.remitente = tramite.remitente.trim();
        tramite.descripcion = tramite.descripcion.trim();
      },
    },
  }
);
