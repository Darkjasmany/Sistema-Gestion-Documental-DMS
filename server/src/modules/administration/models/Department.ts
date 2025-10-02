import {
  AllowNull,
  AutoIncrement,
  BeforeSave,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

export interface IDepartment {
  id: number;
  nombre: string;
  coordinador_id: number;
}

@Table({
  tableName: "departamento",
  timestamps: false,
})
export class Department extends Model<IDepartment> implements IDepartment {
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
