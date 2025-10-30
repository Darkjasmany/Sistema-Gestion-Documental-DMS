import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Simular __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const borrarArchivosTemporales = (files) => {
  if (files && files.length > 0) {
    files.forEach((file) => {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        file.filename
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error al borrar archivo temporal:", err);
      });
    });
  }
};
