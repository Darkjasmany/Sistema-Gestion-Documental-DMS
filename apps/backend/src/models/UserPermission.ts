import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "usuario_permiso", timestamps: true })
export class UserPermission extends Model<
  InferAttributes<UserPermission>,
  InferCreationAttributes<UserPermission>
> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.BIGINT,
  })
  declare usuario_id: number;

  @Column({
    type: DataType.BIGINT,
  })
  declare permiso_id: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare permitido: CreationOptional<boolean>;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW, // Añade DEFAULT now() al esquema de la BD
  })
  declare createdAt: CreationOptional<Date>;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW, // Añade DEFAULT now() al esquema de la BD
  })
  declare updatedAt: CreationOptional<Date>;
}
