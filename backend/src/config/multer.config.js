import multer from "multer"; // Es el middleware que usas para manejar la carga de archivos.
import path from "path"; // Lo utilizas para manejar y manipular rutas de archivos (como extensiones y nombres).
import fs from "fs"; // Se usa el módulo fs para verificar si la carpeta uploads/ existe con fs.existsSync().

// Verificar y crear la carpeta "uploads" si no existe
// Cambia "uploads/" por tu carpeta de almacenamiento
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Crea la carpeta si no existe
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    ); // Nombre único para evitar duplicados
  },
});

// Filtros de archivos permitidos
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|pdf|zip|rar/; // Tipos de archivo permitidos
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Solo se permiten archivos de imagen, PDF o archivos comprimidos."
      )
    );
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter: fileFilter,
});
