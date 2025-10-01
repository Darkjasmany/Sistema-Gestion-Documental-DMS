import { Model } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  BeforeSave,
  BelongsTo,
  Column,
  DataType,
  Default,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { generarId } from "../../../utils/generarId.js";
import { hashPassword } from "../../../utils/auth.js";
import { Department } from "./Department.js";

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

  @Default(generarId())
  @Column(DataType.STRING)
  token!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  confirmado!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  estado!: boolean;

  @Column(DataType.BIGINT)
  departamento_id!: number;

  @BelongsTo(() => Department, "departamento_id")
  departamento!: Department;

  @BeforeSave
  static async sanitizeAndHash(usuario: User) {
    usuario.nombres = usuario.nombres.trim();
    usuario.apellidos = usuario.apellidos.trim();
    usuario.email = usuario.email.trim().toLowerCase();

    if (usuario.changed("password")) {
      usuario.password = usuario.password.trim();
      usuario.password = await hashPassword(usuario.password);
    }
  }
}
