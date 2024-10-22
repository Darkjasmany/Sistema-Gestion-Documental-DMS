import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Simular __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const borrarArchivos = async (array) => {
  // Eliminar los archivos físicamente usando promesas con map
  await Promise.all(
    array.map(async (archivo) => {
      const filePath = path.join(__dirname, "..", "..", archivo.ruta);
      try {
        await fs.promises.unlink(filePath);
        console.log(`Archivo eliminado: ${filePath}`);
      } catch (error) {
        console.error(`Error al eliminar archivo: ${filePath}`, error.message);
      }
    })
  );
};
