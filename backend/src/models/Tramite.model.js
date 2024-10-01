import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // Importamos la conexión
import { generarHora } from "../utils/generarHora.js";
import { Departamento } from "./Departamento.model.js";

export const Tramite = sequelize.define(
  "tramite",
  {
    numeroTramite: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    remitente: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    departamentoRemitenteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    asunto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    referenciaTramite: {
      type: DataTypes.STRING(50),
      defaultValue: null,
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pendiente",
      validate: {
        isIn: [
          ["pendiente", "revision", "completado", "correccion", "finalizado"],
        ],
      },
    },
    numeroOficioDespacho: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    destinatario: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    departamentoDestinatarioId: {
      type: DataTypes.BIGINT,
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
    },
    usuarioCreacionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    usuarioRevisorId: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    departamentoId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    coordinadorId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "tramite",
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
// * Relaciones
// 1 tramite pertenece a 1 departamento remitente
Tramite.belongsTo(Departamento, {
  foreignKey: "departamentoRemitenteId", // campo en la tabla Tramite que contiene el ID del departamento
  targetId: "id", // campo en la tabla Departamento que se enlaza
});

// 1 tramite es despachado a 1 departamento destino
Tramite.belongsTo(Departamento, {
  foreignKey: "departamentoDestinatarioId",
  targetId: "id",
});

// 1 tramite puede tener 1 coordinador
Tramite.belongsTo(Departamento, {
  foreignKey: "coordinadorId",
  targetId: "coordinadorId",
});

// 1 departamento remitente puede tener muchos tramites
Departamento.hasMany(Tramite, {
  foreignKey: "departamentoRemitenteId",
  sourceKey: "id",
});

// 1 departamento destino puede tener muchos tramites
Departamento.hasMany(Tramite, {
  foreignKey: "departamentoDestinatarioId",
  sourceKey: "id",
});

// 1 coordinador puede tener muchos tramites
Departamento.hasMany(Tramite, {
  foreignKey: "coordinadorId",
  sourceKey: "coordinadorId",
});
