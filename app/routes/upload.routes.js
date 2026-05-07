// src/routes/upload.routes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { methods as authorization } from "../middlewares/authorization.js";
// Necesario para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // carpeta donde se guardan
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const nuevoNombre = uuidv4() + extension;
    cb(null, Date.now() + '-' + nuevoNombre);
    //cb(null, Date.now() + '-' + file.originalname);
  }
});

/************************************************************************************************* */
const tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf'];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});

/************************************************************************************************* */
/**const upload = multer({ storage });
*/
// Ruta POST para subir archivo
router.post('/api/upload', authorization.soloAdmin, upload.single('archivo'), (req, res) => {
  try {
    res.json({
      mensaje: 'Archivo subido correctamente',
      nombre: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir archivo' });
  }
});

export default router;