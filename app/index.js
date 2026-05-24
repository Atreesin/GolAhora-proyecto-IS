import express from "express";
import morgan from 'morgan';
import cookieParser from "cookie-parser";

//docs
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";

import cors from "cors";

import {PORT} from './config.js';

import uploadRoutes from './routes/upload.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import pagoRoutes from './routes/pago.routes.js';
import apiRoutes from './routes/api.routes.js';

import { methods as dbUserQuery } from "./db/dbUserQueries.js";

/*
import { methods as dbLugarQuery } from "./db/dbLugaresQueries.js";

import { methods as authentication } from "./controllers/authentication.controller.js";
import { methods as lugarController } from "./controllers/lugares.controller.js";
import { methods as generoController } from "./controllers/generos.controller.js";
import { methods as userController } from "./controllers/user.controller.js";
*/
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
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api-docs", swaggerUi.serve, (req, res, next) => {
  // Clonar el spec y modificar servers según la URL de acceso
  const spec = JSON.parse(JSON.stringify(swaggerDocument));
  spec.servers = [
    {
      url: `${req.protocol}://${req.get("host")}/api`,
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
app.use(apiRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use(clienteRoutes);
app.use(pagoRoutes);
app.use(cors());
