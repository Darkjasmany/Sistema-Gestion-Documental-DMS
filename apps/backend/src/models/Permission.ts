import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Module } from "./Module.js";

@Table({
  tableName: "permiso",
  timestamps: true,
})
export class Permission extends Model<
  InferAttributes<Permission>,
  InferCreationAttributes<Permission>
> {
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
  declare codigo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare descripcion: CreationOptional<string>;

  @ForeignKey(() => Module)
  @Column({
    type: DataType.BIGINT, // IMPORTANTE: Debe coincidir con el ID de Module
    allowNull: true, // IMPORTANTE: Para soportar 'ON DELETE SET NULL'
    field: "modulo_id", // Asegura que en la BD se llame 'module_id'
  })
  declare modulo_id: CreationOptional<number | null>;

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

  @BelongsTo(() => Module)
  declare modulo?: Module; // Propiedad de navegación
}
