function getEnv(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];
  if (!value)
    throw new Error(`La variable de entorno ${name} no está definida`);
  return value;
}

export const PG_DATABASE = getEnv("PG_DATABASE");
export const PG_USER = getEnv("PG_USER");
export const PG_PASSWORD = getEnv("PG_PASSWORD");
export const PG_HOST = getEnv("PG_HOST");
export const PG_PORT = getEnv("PG_PORT");
export const PORT = getEnv("PORT");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const EMAIL_HOST = getEnv("EMAIL_HOST");
export const EMAIL_PORT = getEnv("EMAIL_PORT");
export const EMAIL_USER = getEnv("EMAIL_USER");
export const EMAIL_PASS = getEnv("EMAIL_PASS");
export const FRONTEND_URL = getEnv("FRONTEND_URL");
