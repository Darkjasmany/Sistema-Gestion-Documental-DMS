import { Model } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

const tipoRol = {
  USUARIO: "USUARIO",
  REVISOR: "REVISOR",
  DESPACHADOR: "DESPACHADOR",
  COORDINADOR: "COORDINADOR",
  ADMINISTRADOR: "ADMINISTRADOR",
};

export type TipoRol = (typeof tipoRol)[keyof typeof tipoRol];

@Table({
  tableName: "usuario",
  timestamps: false,
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  nombres!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  apellidos!: string;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(tipoRol),
  })
  @Default(tipoRol.USUARIO)
  rol!: string;
}
