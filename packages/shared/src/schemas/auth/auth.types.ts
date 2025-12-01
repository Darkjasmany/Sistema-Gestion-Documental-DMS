import type { UserBase } from "../../models";

/**
 * ============================================
 * TIPOS DE DOMINIO DE AUTENTICACIÓN
 * ============================================
 * Estos tipos derivan del modelo base de usuario
 * y representan las entidades de negocio en flujos de auth
 */

// Entidad completa de Usuario en el contexto de la autenticación
export type User = UserBase;

// Tipo para el formulario
export type AuthUserRegistration = Pick<
  UserBase,
  "nombres" | "apellidos" | "email" | "password"
> & {
  password_confirmation: string;
};

export type AuthUser = Pick<UserBase, "id" | "nombres" | "apellidos" | "email" | "rol">;

export type AuthCredentials = Pick<UserBase, "email" | "password">;

export type AuthToken = Pick<UserBase, "token">;
