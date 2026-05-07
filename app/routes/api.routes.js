import { Router } from "express";
import { __dirname } from "../index.js";

import { methods as authentication } from "../controllers/authentication.controller.js";
import { methods as authorization } from "../middlewares/authorization.js";

import { methods as lugarController } from "../controllers/lugares.controller.js";
import { methods as generoController } from "../controllers/generos.controller.js";
import { methods as userController } from "../controllers/user.controller.js";

const router = Router()

//api get
//lugares
router.get("/api/paises", lugarController.nombrePaises);
router.get("/api/provincias", lugarController.nombreProvincias);
router.get("/api/ciudades", lugarController.nombreCiudades);
router.get("/api/localidades", lugarController.nombreLocalidades);
router.get("/api/localidades/fullinfo", lugarController.fullInfoLocalidades);
//generos
router.get("/api/generos", generoController.generos);
//usuarios
router.get("/api/users", authorization.soloAdmin, userController.getUsuarios);
router.get("/api/user_Info/Full_Info", authorization.soloUsers, userController.getFullDatosUsuario);
router.get("/api/user_Info", authorization.soloUsers, userController.getDatosUsuario)

//api post
router.post("/api/login", authentication.login);
router.post("/api/register", authentication.register);


export default router