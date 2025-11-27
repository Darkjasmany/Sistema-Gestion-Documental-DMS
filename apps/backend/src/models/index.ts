import { Department } from "./Department.js";
import { Module } from "./Module.js";
import { Permission } from "./Permission.js";
import { Role } from "./Role.js";
import { RolePermission } from "./RolePermission.js";
import { User } from "./User.js";
import { UserPermission } from "./UserPermission.js";
import { UserRole } from "./UserRole.js";

export const models = [
  User,
  Department,
  Module,
  Role,
  Permission,
  RolePermission,
  UserRole,
  UserPermission,
];
