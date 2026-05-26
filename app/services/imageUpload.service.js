import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/img')); // carpeta donde se guardan
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const nuevoNombre = Date.now() + '-' + uuidv4() + extension;

    console.log(nuevoNombre);
    cb(null, nuevoNombre);
    //cb(null, Date.now() + '-' + file.originalname);
  }
});

/************************************************************************************************* */
const tiposPermitidos = ['image/jpeg', 'image/png'];

export const uploadImagen = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});