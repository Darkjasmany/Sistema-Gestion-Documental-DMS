import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "modulo",
  timestamps: true,
})
export class Module extends Model<InferAttributes<Module>, InferCreationAttributes<Module>> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    // validate: {
    //   notEmpty: { msg: "El nombre es obligatorio" },
    // },
  })
  declare nombre: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare icono: string | null;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  declare ruta: string | null;

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

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
