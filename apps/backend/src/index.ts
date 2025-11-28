import colors from "colors";
import app from "./app.js";
import { conectarDB } from "./config/database.js";
import { PORT } from "./config/env.js";
import { conectarRedis } from "./config/redis.js";

const PORTENV = Number(PORT);

(async () => {
  try {
    // Conectar la base de datos primero
    await conectarDB();
    // Intentar conectar Redis (no termina el proceso si falla)
    await conectarRedis();

    app.listen(PORTENV, () => {
      console.log(colors.cyan.bold(`Server is running on port ${PORT}`));
    });
  } catch (err: any) {
    console.error(colors.red("Error during startup:"), err && err.message ? err.message : err);
    process.exit(1);
  }
})();
