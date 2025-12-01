import { z } from "zod";
import { moduleBaseSchema } from "../../models/Module";
import { permissionBaseSchema } from "../../models/Permission";
import { roleBaseSchema } from "../../models/Role";

// Module
export const moduleCreateSchema = z.object({
  nombre: moduleBaseSchema.shape.nombre.min(2),
  icono: moduleBaseSchema.shape.icono.optional(),
  ruta: moduleBaseSchema.shape.ruta.optional(),
  descripcion: moduleBaseSchema.shape.descripcion.optional(),
  estado: moduleBaseSchema.shape.estado.optional(),
});

export type ModuleCreateInput = z.infer<typeof moduleCreateSchema>;

// Permission
export const permissionCreateSchema = z.object({
  codigo: permissionBaseSchema.shape.codigo.min(3),
  descripcion: permissionBaseSchema.shape.descripcion.optional(),
  modulo_id: permissionBaseSchema.shape.modulo_id,
});

export type PermissionCreateInput = z.infer<typeof permissionCreateSchema>;

// Role
export const roleCreateSchema = z.object({
  nombre: roleBaseSchema.shape.nombre.min(2),
  descripcion: roleBaseSchema.shape.descripcion.optional(),
  permiso_id: z.array(z.number()).optional(),
});

export type RoleCreateInput = z.infer<typeof roleCreateSchema>;
