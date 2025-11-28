import redis from "src/config/redis";
import { Module } from "src/models/Module";
import { Permission } from "src/models/Permission";
import { RolePermission } from "src/models/RolePermission";
import { UserPermission } from "src/models/UserPermission";
import { UserRole } from "src/models/UserRole";

/**     `
 El objetivo principal de este servicio es: Saber qué puede hacer un usuario y guardar esa información en memoria rápida (Redis) para no preguntar a la base de datos todo el tiempo. 

 getUserPermissionsAndModules: Consulta los permisos y módulos de un usuario, primero revisa en Redis si ya tiene la información en caché. Si no, la obtiene de la base de datos, combinando permisos por roles y permisos directos del usuario, y luego guarda el resultado en Redis para futuras consultas.
 
 invalidateUserPermissionsCache: Elimina la caché de permisos de un usuario específico en Redis, útil cuando los permisos del usuario cambian y se necesita actualizar la información almacenada en caché.
 */

// Usamos el cliente Redis centralizado desde `src/config/redis`

export async function getUserPermissionsAndModules(userId: number) {
  const cacheKey = `user_perms:${userId}`;

  if (redis) {
    try {
      const cacheData = await redis.get(cacheKey);
      if (cacheData) return JSON.parse(cacheData);
    } catch (err: any) {
      console.warn(
        "[permissions] Redis get failed, continuing without cache:",
        err && err.message ? err.message : err
      );
    }
  }

  // 1. Permisos por roles
  const userRoles = await UserRole.findAll({
    where: { usuario_id: userId },
  });
  const roleIds = userRoles.map(rol => rol.rol_id);
  let rolePerms: Permission[] = [];
  if (roleIds.length) {
    const rp = await RolePermission.findAll({
      where: { rol_id: roleIds },
      include: [{ model: Permission }],
    });
    rolePerms = rp.map(x => (x as any).permiso);
  }

  // 2. Permisos especificos directos (si aplica)
  const userPerms = await UserPermission.findAll({
    where: { usuario_id: userId },
    include: [{ model: Permission }],
  });

  // combine: start from rolePerms set
  const permMap = new Map<string, { id: number; codigo: string }>();
  for (const p of rolePerms) permMap.set(p.codigo, { id: p.id, codigo: p.codigo });

  // apply user overrides
  for (const up of userPerms) {
    const permiso = (up as any).permiso as Permission;
    if (!permiso) continue;
    if (up.permitido)
      permMap.set(permiso.codigo, { id: permiso.id, codigo: permiso.codigo }); // add
    else permMap.delete(permiso.codigo); //remove
  }

  const permissions = Array.from(permMap.keys()); // Lista final de códigos de permisos

  // 3. Modulos relacionados a los permisos
  const permisoRecords = await Permission.findAll({
    where: { codigo: Array.from(permMap.keys()) }, // Busca en BD los detalles de estos permisos finales
    include: [{ model: Module }], // ¡Trae también el Módulo asociado!
  });

  const modulesMap = new Map<number, any>();
  for (const p of permisoRecords) {
    if (p.modulo)
      modulesMap.set(p.modulo.id, {
        id: p.modulo.id,
        nombre: p.modulo.nombre,
        icono: p.modulo.icono,
        ruta: p.modulo.ruta,
      });
  }
  const modules = Array.from(modulesMap.values());

  const result = { permissions, modules }; // Resultado final empaqueta los permisos y módulos e un solo objeto

  if (redis) {
    try {
      await redis.setex(cacheKey, 3600, JSON.stringify(result)); // 1h TTL
    } catch (err: any) {
      console.warn(
        "[permissions] Redis set failed, continuing:",
        err && err.message ? err.message : err
      );
    }
  }
  return result;
}

export async function invalidateUserPermissionsCache(userId: number) {
  if (!redis) return;
  try {
    await redis.del(`user_perms:${userId}`);
  } catch (err: any) {
    console.warn("[permissions] Redis del failed:", err && err.message ? err.message : err);
  }
}
