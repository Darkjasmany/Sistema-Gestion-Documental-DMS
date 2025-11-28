declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PG_DATABASE: string;
      PG_USER: string;
      PG_PASSWORD: string;
      PG_HOST: string;
      PG_PORT: string;
      PORT: string;
      JWT_SECRET: string;
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;
      REDIS_URL: string;
      FRONTEND_URL: string;
    }
  }
}
