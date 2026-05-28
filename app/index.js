import express from "express";
import morgan from 'morgan';
import cookieParser from "cookie-parser";

// API docs
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";

import cors from "cors";

import {PORT} from './config.js';

// RUTAS
import uploadRoutes from './routes/upload.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import pagoRoutes from './routes/pago.routes.js';
import apiRoutes from './routes/api.routes.js';
import archivosRoutes from './routes/achivos.routes.js';

import path from 'path';
import { fileURLToPath } from "url";
export const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Server
const app = express();
app.use(morgan('dev'));

app.listen(PORT, () => {
    console.log("servidor corriendo en puerto: ", PORT);
});

// Cargar archivo YAML
const swaggerDocument = yaml.load("./app/docs/openapi.yaml");

// Montar Swagger UI en la ruta /api-docs
app.use("/api-docs", swaggerUi.serve, (req, res, next) => {
  const spec = JSON.parse(JSON.stringify(swaggerDocument));
  spec.servers = [
    {
      url: `${req.protocol}s://${req.get("host")}/api`,
      description: "Servidor detectado automáticamente"
    },
    ...swaggerDocument.servers
  ];
  swaggerUi.setup(spec)(req, res, next);
});

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(uploadRoutes);
app.use(archivosRoutes);
app.use(apiRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use(clienteRoutes);
app.use(pagoRoutes);
app.use(cors({
  origin: "http://localhost:3000",   // el dominio de tu frontend local
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "plataform"],
  credentials: true                  // habilita cookies y headers de sesión
}));
