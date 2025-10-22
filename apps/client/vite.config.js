import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: "/dms/", // Reemplaza 'mi-app' con el nombre de tu subdirectorio
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)), // Alias para importar desde la carpeta src
    },
  },
});
