import {
  AllowNull,
  AutoIncrement,
  BeforeSave,
  BelongsTo,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { generarId } from "../../../utils/generarId.js";
import { hashPassword } from "../../../utils/auth.js";
import { Department } from "./Department.js";
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

const tipoRol = {
  USUARIO: "USUARIO",
  REVISOR: "REVISOR",
  DESPACHADOR: "DESPACHADOR",
  COORDINADOR: "COORDINADOR",
  ADMINISTRADOR: "ADMINISTRADOR",
};

export type TipoRol = (typeof tipoRol)[keyof typeof tipoRol];

// export interface IUser {
//   id: CreationOptional<number>;
//   nombres: string;
//   apellidos: string;
//   email: string;
//   password: string;
//   rol: CreationOptional<TipoRol>;
//   token: CreationOptional<string>;
//   confirmado: CreationOptional<boolean>;
//   estado: CreationOptional<boolean>;
//   departamento_id: CreationOptional<number>;
// }

@Table({
  tableName: "usuario",
  timestamps: false,
})
// export class User extends Model<IUser> {
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  declare id: CreationOptional<number>;

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
  declare rol: CreationOptional<TipoRol>;

  @Default(generarId())
  @Column(DataType.STRING)
  declare token: CreationOptional<string>;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare confirmado: CreationOptional<boolean>;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare estado: CreationOptional<boolean>;

  @Default(1)
  @Column(DataType.BIGINT)
  declare departamento_id: CreationOptional<number>;

  @BelongsTo(() => Department, { foreignKey: "departamento_id" })
  declare departamento: CreationOptional<Department>;

  // TODO Faltan las demás relaciones

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
