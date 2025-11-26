import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Permission } from "./Permission";
import { Role } from "./Role";

@Table({ tableName: "rol_permiso", timestamps: true })
export class RolePermission extends Model<
  InferAttributes<RolePermission>,
  InferCreationAttributes<RolePermission>
> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: "rol_id",
  })
  declare rol_id: CreationOptional<number | null>;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: "permiso_id",
  })
  declare permiso_id: CreationOptional<number | null>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  @BelongsTo(() => Role)
  declare rol?: Role;

  @BelongsTo(() => Permission)
  declare permission?: Permission;
}
