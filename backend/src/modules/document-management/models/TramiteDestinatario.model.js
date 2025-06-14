import { DataTypes } from "sequelize";
import { sequelize } from "../../../config/db.config.js";
import { Empleado } from "../../administration/models/Empleado.model.js";
import { Departamento } from "../../administration/models/Departamento.model.js";

export const TramiteDestinatario = sequelize.define(
  "tramite_destinatario",
  {
    tramite_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "tramite",
        key: "id",
      },
    },
    departamento_destinatario: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "departamento",
        key: "id",
      },
    },
    destinatario_id: {
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
    usuario_creacion: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id",
      },
    },
  },
  {
    tableName: "tramite_destinatario",
  }
);

// 1 tramite es despachado a 1 departamento destino
// TramiteDestinatario.belongsTo(Departamento, {
//   foreignKey: "departamento_destinatario",
//   targetKey: "id",
//   as: "departamentoDestinatario", // Alias para la relación destino
// });

// TramiteDestinatario.hasMany(Departamento, {
//   foreignKey: "departamento_destinatario",
//   sourceKey: "id",
// });

// 1 departamento destino puede tener muchos tramitesDestinarios
TramiteDestinatario.belongsTo(Departamento, {
  foreignKey: "departamento_destinatario", // campo en la tabla Tramite que contiene el ID del departamento
  targetKey: "id", // campo en la tabla Departamento que se enlaza
  as: "departamentoDestinatario", // Alias para esta relación
});

Departamento.hasMany(TramiteDestinatario, {
  foreignKey: "departamento_destinatario",
  sourceKey: "id",
  as: "tramitesDestinatarios", // Alias para la relación inversa (destinatario)
});

// Relación entre Tramite y Empleado como destinatario
TramiteDestinatario.belongsTo(Empleado, {
  foreignKey: "destinatario_id", // Este es el campo que almacena el id del destinatario
  targetKey: "id",
  as: "destinatario", // Alias para el destinatario en las consultas
});

// Empleado.hasMany(TramiteDestinatario, {
//   foreignKey: "destinatario_id", // Este es el campo que almacena el id del destinatario
//   sourceKey: "id",
//   as: "tramiteDestinatario",
// });
