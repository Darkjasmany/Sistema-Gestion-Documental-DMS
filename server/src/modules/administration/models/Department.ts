import { Model } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BeforeSave,
  Column,
  DataType,
  Default,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

@Table({
  tableName: "departamento",
  timestamps: false,
})
export class Department extends Model<Department> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  nombre!: string;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.BIGINT)
  coordinador_id!: number;

  @BeforeSave
  static trimNombre(departamento: Department) {
    if (departamento.nombre) {
      departamento.nombre = departamento.nombre.trim();
    }
  }
}
