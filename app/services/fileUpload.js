import multer from 'multer';


// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // carpeta donde se guardan
  },
  filename: function (req, file, cb) {
    // nombre único: fecha + nombre original
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Inicializar multer con la config
const upload = multer({ storage: storage });