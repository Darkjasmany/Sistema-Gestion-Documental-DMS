import Redis from "ioredis";
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

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

export async function getUserPermissionsAndModules(userId: number) {
  const cacheKey = `user_permissions_modules:${userId}`;

  if (redis) {
    const cacheData = await redis.get(cacheKey);
    if (cacheData) return JSON.parse(cacheData);
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

  // 2. Permisos override directos (si aplica)
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
    if (up.permitido) permMap.set(permiso.codigo, { id: permiso.id, codigo: permiso.codigo });
    else permMap.delete(permiso.codigo);
  }

  const permissions = Array.from(permMap.keys());

  // 3. Modulos relacionados a los permisos
  const permisoRecords = await Permission.findAll({
    where: { codigo: Array.from(permMap.keys()) },
    include: [{ model: Module }],
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

  const result = { permissions, modules };

  if (redis) await redis.setex(cacheKey, 3600, JSON.stringify(result)); // 1h TTL
  return result;
}

export async function invalidateUserPermissionsCache(userId: number) {
  if (!redis) return;
  await redis.del(`user_perms:${userId}`);
}
