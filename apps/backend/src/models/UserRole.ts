import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "usuario_rol", timestamps: true })
export class UserRole extends Model<InferAttributes<UserRole>, InferCreationAttributes<UserRole>> {
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
  declare rol_id: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
