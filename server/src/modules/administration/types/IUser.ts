import type { IUser } from "../models/User.js";
import type { DepartmentCoodinator } from "./IDepartment.js";

export type CreateUserInput = Pick<
  IUser,
  "nombres" | "apellidos" | "email" | "password"
>;

export type UserAuthenticate = Pick<
  IUser,
  "id" | "nombres" | "apellidos" | "email" | "rol" | "departamento_id"
>;

export type UserWithDepartment = UserAuthenticate & {
  departamento: DepartmentCoodinator;
};
