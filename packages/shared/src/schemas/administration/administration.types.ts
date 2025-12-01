import type { ModuleBase } from "../../models/Module";
import type { PermissionBase } from "../../models/Permission";
import type { RoleBase } from "../../models/Role";

export type Module = ModuleBase;
export type ModuleCreate = Omit<ModuleBase, "id" | "createdAt" | "updatedAt">;

export type Permission = PermissionBase;
export type PermissionCreate = Omit<PermissionBase, "id" | "createdAt" | "updatedAt">;

export type Role = RoleBase;
export type RoleCreate = Omit<RoleBase, "id" | "createdAt" | "updatedAt">;
