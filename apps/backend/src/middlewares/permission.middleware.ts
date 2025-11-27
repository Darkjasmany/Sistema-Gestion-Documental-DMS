import type { IUserLogged } from "@selnic/shared";
import type { NextFunction, Request, Response } from "express";
import { getUserPermissionsAndModules } from "../modules/administration/services/permissions.service.js";

export function requirePermission(codigo: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Verificar si el usuario está adjunto y extraer el ID de forma segura.
    // Usamos el tipo Request normal, confiando en la extensión global.
    const userId = (req.user as IUserLogged)?.id;

    // El middleware 'authenticate' SIEMPRE debe ejecutarse ANTES de este.
    if (!userId) {
      // 401: Unauthorized - Faltó el paso de Autenticación
      return res.status(401).json({ message: "Error de autenticación: Usuario no adjunto" });
    }

    if (!userId) return res.status(401).json({ message: "No user" });

    // Obtener permisos
    const { permissions } = await getUserPermissionsAndModules(userId);

    // Verificar permiso: incluye el código específico O el permiso total de administrador
    if (permissions.includes(codigo) || permissions.includes("admin.*")) {
      return next();
    }

    // Forbidden - El usuario es válido, pero no tiene permiso para esta acción.
    return res.status(403).json({ message: "Prohibido: Permiso insuficiente" });
  };
}
