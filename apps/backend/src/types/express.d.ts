import type { IUserLogged } from "@selnic/shared";

/**
 * Fusión de declaración para la interfaz Request de Express.
 * Esto agrega la propiedad 'user' al objeto 'req'.
 */

declare module "express-serve-static-core" {
  // La propiedad 'user' será opcional si el middleware de autenticación
  // no se ha ejecutado o si no se encontró un usuario (enrutas públicas)
  interface Request {
    user?: IUserLogged;
  }
}
