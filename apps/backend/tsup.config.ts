import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "es2022",
  platform: "node",
  clean: true,
  sourcemap: true,
  bundle: true,

  // CRÍTICO: Excluir dependencias de node_modules pero INCLUIR @selnic/shared
  noExternal: ["@selnic/shared"],

  // Configuración de paths para resolver @selnic/shared
  tsconfig: "./tsconfig.json",
});
