import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: "/dms/", // Reemplaza 'mi-app' con el nombre de tu subdirectorio
});
