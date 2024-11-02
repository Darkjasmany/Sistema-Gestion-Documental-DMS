import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { Departamento } from "./Departamento.model.js";
import { Empleado } from "./Empleado.model.js";

export const TramiteDestinatario = sequelize.define(
  "tramiteDestinatario",
  {
    tramiteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tramite",
        key: "id",
      },
    },
    departamentoDestinatarioId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "departamento",
        key: "id",
      },
    },
    destinatarioId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "empleado",
        key: "id",
      },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    usuarioCreacionId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id",
      },
    },
  },
  {
    tableName: "tramiteDestinatario",
  }
);

// 1 tramite es despachado a 1 departamento destino
TramiteDestinatario.belongsTo(Departamento, {
  foreignKey: "departamentoDestinatarioId",
  targetKey: "id",
  as: "departamentoDestinatario", // Alias para la relación destino
});

TramiteDestinatario.hasMany(Departamento, {
  foreignKey: "departamentoDestinatarioId",
  sourceKey: "id",
});

// 1 departamento destino puede tener muchos tramitesDestinarios
Departamento.hasMany(TramiteDestinatario, {
  foreignKey: "departamentoDestinatarioId",
  sourceKey: "id",
  as: "tramitesRecibidos", // Alias para la relación inversa (destinatario)
});

// Relación entre Tramite y Empleado como destinatario
TramiteDestinatario.belongsTo(Empleado, {
  foreignKey: "destinatarioId", // Este es el campo que almacena el id del destinatario
  targetKey: "id",
  as: "destinatario", // Alias para el destinatario en las consultas
});

Empleado.hasMany(TramiteDestinatario, {
  foreignKey: "destinatarioId", // Este es el campo que almacena el id del destinatario
  sourceKey: "id",
  as: "tramiteDestinatario",
});
