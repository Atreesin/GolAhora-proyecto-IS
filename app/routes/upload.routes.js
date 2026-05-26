// src/routes/upload.routes.js
import { Router } from "express";
import { __dirname } from "../index.js";
import { methods as authorization } from "../middlewares/authorization.js";
import { upload } from "../services/fileUpload.service.js";

const router = Router()

/************************************************************************************************* */
/**const upload = multer({ storage });
*/
// Ruta POST para subir archivo
router.post('/api/upload', authorization.soloAdmin, upload.single('archivo'), (req, res) => {
  try {
    const nombreArchivo = req.file.filename;

    // aca deberia guardar el nombre del archivo en la base de datos 

    res.json({
      mensaje: 'Archivo subido correctamente',
      nombre: nombreArchivo
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir archivo' });
  }
});

export default router;