import type { CreationOptional, InferAttributes, InferCreationAttributes } from "sequelize";
import {
  BeforeSave,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { hashPassword } from "../utils/auth.js";
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
  timestamps: true,
})
// export class User extends Model<IUser> {
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.STRING(100), // Definimos longitud para optimizar
    allowNull: false,
    // validate: {
    //   notEmpty: { msg: "El nombre es obligatorio" },
    // },
  })
  declare nombres: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare apellidos: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
    // unique: {
    //   name: "users_email_unique", // Nombre custom para el índice
    //   msg: "El correo electrónico ya está registrado",
    // },
    // validate: {
    //   isEmail: { msg: "Debe ser un correo válido" },
    // },
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM(...Object.values(tipoRol)),
    defaultValue: tipoRol.USUARIO,
    allowNull: false,
  })
  declare rol: CreationOptional<TipoRol>;

  // @Default(generarId())
  @Column({
    type: DataType.STRING(255),
    allowNull: true, // Explicitamos que puede ser null
    defaultValue: null,
  })
  declare token: CreationOptional<string | null>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare confirmado: CreationOptional<boolean>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare estado: CreationOptional<boolean>;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.BIGINT, // Importante: BIGINT para coincidir con IDs modernos
    allowNull: false, // Asumo que un usuario SIEMPRE debe tener departamento
    defaultValue: 1, // Mantenemos tu default(1), aunque cuidado con hardcodear IDs
  })
  declare departamento_id: CreationOptional<number>;

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

  // Relaciones
  @BelongsTo(() => Department)
  declare departamento?: Department; // Propiedad de navegación

  // @BelongsToMany(() => Permission)

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
