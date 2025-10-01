import { Model } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";

const rolStatus = {
  USUARIO: "USUARIO",
  REVISOR: "REVISOR",
  DESPACHADOR: "DESPACHADOR",
  COORDINADOR: "COORDINADOR",
  ADMINISTRADOR: "ADMINISTRADOR",
};

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
}

/**
 * 
 * 
 * import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  Default,
  BelongsTo,
  ForeignKey,
  HasMany,
  BeforeSave
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { Departamento } from './Departamento.model';
import { Tramite } from '../../document-management/models/Tramite.model';
// ...importa otros modelos relacionados...

@Table({
  tableName: 'usuario',
  timestamps: false // o true si usas createdAt/updatedAt
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
  @Column(DataType.STRING)
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string;

  @AllowNull(false)
  @Default('USUARIO')
  @Column(DataType.STRING(50))
  rol!: string;

  @Default(() => generarId())
  @Column(DataType.STRING)
  token!: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  confirmado!: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  estado!: boolean;

  @ForeignKey(() => Departamento)
  @Column(DataType.BIGINT)
  departamento_id!: number;

  @BelongsTo(() => Departamento)
  departamento?: Departamento;

  // Relaciones con otros modelos
  @HasMany(() => Tramite)
  tramites?: Tramite[];

  // ...otras relaciones...

  // Hook para hashear password
  @BeforeSave
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      instance.password = await bcrypt.hash(instance.password, 10);
    }
    instance.nombres = instance.nombres.trim();
    instance.apellidos = instance.apellidos.trim();
    instance.email = instance.email.trim().toLowerCase();
  }

  // Método personalizado
  async comprobarPassword(passwordFormulario: string): Promise<boolean> {
    return bcrypt.compare(passwordFormulario, this.password);
  }
}
 */
