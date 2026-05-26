import { Router } from "express";
import path from 'path';
import { __dirname } from "../index.js";
import { fileURLToPath } from 'url';
import { ejecutarConManejoDeErrores as wrapper } from "../middlewares/error-wrapper.js";
import { methods as auth } from '../middlewares/authorization.js';

const router = Router();
//const __filename = fileURLToPath(import.meta.url);

router.get("/api/img/canchas/:nombre", wrapper((req, res) => {
  const nombreArchivo = req.params.nombre;
  
  const rutaImagen = path.join(__dirname, './uploads/img/', nombreArchivo);
  const rutaPorDefecto = path.join(__dirname, './pages/images/no-disponible.png');

  res.sendFile(rutaImagen, (err) => {
    if (err) {
      res.sendFile(rutaPorDefecto);
    }
  });
}));

router.get("/api/file/certificaciones/file_name=:nombre", auth.apiSoloUsers, auth.soloAdmin, wrapper((req, res) => {
  const nombreArchivo = req.params.nombre;
  
  const rutaImagen = path.join(__dirname, './uploads/archivos', nombreArchivo);

  res.sendFile(rutaImagen, (err) => {
    if (err) {
      res.status(404).json({ error: 'Archivo no encontrado' });
    }
  });
}));

export default router;