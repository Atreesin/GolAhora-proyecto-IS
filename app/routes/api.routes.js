import { Router } from "express";
import { __dirname } from "../index.js";

import { methods as authentication } from "../controllers/authentication.controller.js";
import { methods as authorization } from "../middlewares/authorization.js";

import { methods as lugarController } from "../controllers/lugares.controller.js";
import { methods as generoController } from "../controllers/generos.controller.js";
import { methods as userController } from "../controllers/user.controller.js";
import { methods as clubController } from "../controllers/club.controller.js";

const router = Router()

//api get
//club
router.get("/api/clubes", clubController.getClubes);
router.get("/api/clubes/full_info", clubController.getClubesFullInfo);
router.get("/api/clubes/club_id=:id", clubController.getDatosClubById);
router.get("/api/clubes/club_id=:id/full_info", clubController.getFullDatosClubById);


//lugares
router.get("/api/paises", lugarController.nombrePaises);
router.get("/api/provincias", lugarController.nombreProvincias);
router.get("/api/ciudades", lugarController.nombreCiudades);
router.get("/api/localidades", lugarController.nombreLocalidades);
router.get("/api/localidades/full_info", lugarController.fullInfoLocalidades);
//generos
router.get("/api/generos", generoController.generos);
//usuarios
router.get("/api/users", authorization.apiSoloUsers, authorization.apiSoloAdmin, userController.getUsuarios);
router.get("/api/users/user_id=:id", authorization.apiSoloUsers, authorization.apiSoloAdmin, userController.getDatosUsuarioById);
router.get("/api/users/user_id=:id/full_info", authorization.apiSoloUsers, authorization.apiSoloAdmin, userController.getFullDatosUsuarioById);
router.get("/api/user_Info/Full_Info", authorization.apiSoloUsers, userController.getFullDatosUsuario);
router.get("/api/user_Info", authorization.apiSoloUsers, userController.getDatosUsuario);

//api post
router.post("/api/login", authentication.login);
router.post("/api/register", authentication.register);


export default router