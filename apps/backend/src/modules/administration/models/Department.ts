import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import { BeforeSave, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "./User";

export interface IDepartment {
  id: number;
  nombre: string;
  coordinador_id: number;
}

@Table({
  tableName: "departamento",
  timestamps: true,
})
export class Department extends Model<
  InferAttributes<Department>,
  InferCreationAttributes<Department>
> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.STRING(100), // Definimos longitud explícita
    allowNull: false,
    validate: {
      notEmpty: { msg: "El nombre del departamento es obligatorio" },
    },
  })
  declare nombre: string;

  @Column({
    type: DataType.BIGINT, // Coherencia con los IDs de tu sistema
    allowNull: false,
    defaultValue: 1,
  })
  declare coordinador_id: CreationOptional<number>;

  // --- RELACIONES ---
  @HasMany(() => User)
  declare usuarios?: User[];

  @BeforeSave
  static trimNombre(departamento: Department) {
    if (departamento.nombre) {
      departamento.nombre = departamento.nombre.trim();
    }
  }
}
