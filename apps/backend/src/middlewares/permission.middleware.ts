import type { NextFunction, Request, Response } from "express";
import { getUserPermissionsAndModules } from "../modules/administration/services/permissions.service.js";

export function requirePermission(codigo: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "No user" });

    const { permissions } = await getUserPermissionsAndModules(userId);
    if (permissions.includes(codigo) || permissions.includes("admin.*")) return next();
    return res.status(403).json({ message: "Forbidden" });
  };
}
