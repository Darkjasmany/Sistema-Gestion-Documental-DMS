import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({ tableName: "rol", timestamps: true })
export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.STRING(200),
    unique: true,
    allowNull: false,
  })
  declare nombre: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare descripcion: CreationOptional<string>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare estado: CreationOptional<boolean>;

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
