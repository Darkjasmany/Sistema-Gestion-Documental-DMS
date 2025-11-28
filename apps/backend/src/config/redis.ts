import colors from "colors";
import Redis from "ioredis";
import { exit } from "node:process";

const REDIS_URL = process.env.REDIS_URL || null;

const redis = REDIS_URL
  ? new Redis(REDIS_URL, {
      // evita reintentos por request y deja que ioredis maneje reconexión
      maxRetriesPerRequest: null,
      // con lazyConnect true, no intenta conectarse inmediatamente al crear la instancia
      lazyConnect: true,
    })
  : null;

if (redis) {
  // Maneja errores para que no tengamos 'Unhandled error event' en la consola
  redis.on("error", (err: any) => {
    console.warn(colors.yellow("[ioredis] error:"), err && err.message ? err.message : err);
  });

  // LISTENER 'connect'
  // redis.on("connect", () => {
  //   console.info(colors.green("[ioredis] connected to:"), REDIS_URL);
  // });
}

/**
 * Intenta conectar a Redis y realiza una verificación (PING).
 */
export const conectarRedis = async () => {
  if (!redis) {
    console.log(colors.yellow("[ioredis] REDIS_URL not configured; skipping Redis connection."));
    return;
  }

  try {
    // 1. Conecta: la instancia no conecta hasta que llamamos connect() (por lazyConnect: true)
    await redis.connect();

    // 2. Verifica (PING)
    const pong = await redis.ping();
    console.log(colors.cyan(`✅ Redis conectado en: ${REDIS_URL} - PING: ${pong}`));
  } catch (error: any) {
    console.error(
      colors.red(
        `[ioredis] ❌ Error de conexión a Redis: ${error && error.message ? error.message : error}`
      )
    );
    // No hacemos exit(1) — Redis es opcional en desarrollo; la app sigue funcionando.
    exit(1);
  }
};

export default redis;
