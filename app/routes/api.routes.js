import { Router } from "express";
import { __dirname } from "../index.js";

import { methods as authentication } from "../controllers/authentication.controller.js";
import { methods as authorization } from "../middlewares/authorization.js";
import { ejecutarConManejoDeErrores as wrapper } from "../middlewares/error-wrapper.js"

import { methods as lugarController } from "../controllers/lugares.controller.js";
import { methods as generoController } from "../controllers/generos.controller.js";
import { methods as userController } from "../controllers/user.controller.js";
import { methods as clubController } from "../controllers/club.controller.js";
import { methods as canchaController } from "../controllers/canchas.controller.js";

import { uploadImagen } from "../services/imageUpload.service.js";

const router = Router()

//docs
router.get("/api", (req, res) => res.redirect("/api-docs"))

//api get
//club
router.get("/api/clubes", wrapper(clubController.getClubes));
router.get("/api/clubes/full_info", wrapper(clubController.getClubesFullInfo));
router.get("/api/clubes/club_id=:id", wrapper(clubController.getDatosClubById));
router.get("/api/clubes/club_id=:id/full_info", wrapper(clubController.getFullDatosClubById));
// lugares
router.get("/api/paises", wrapper(lugarController.nombrePaises));
router.get("/api/provincias", wrapper(lugarController.nombreProvincias));
router.get("/api/ciudades", wrapper(lugarController.nombreCiudades));
router.get("/api/localidades", wrapper(lugarController.nombreLocalidades));
router.get("/api/localidades/full_info", wrapper(lugarController.fullInfoLocalidades));
// generos
router.get("/api/generos", wrapper(generoController.generos));

// usuarios
router.get("/api/users", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(userController.getUsuarios));
router.get("/api/users/cantidad", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(userController.getCantidadUsuarios));
router.get("/api/users/user_id=:id", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(userController.getDatosUsuarioById));
router.get("/api/users/user_id=:id/full_info", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(userController.getFullDatosUsuarioById));
router.get("/api/user_Info/Full_Info", authorization.apiSoloUsers, wrapper(userController.getFullDatosUsuario));
router.get("/api/user_Info", authorization.apiSoloUsers, wrapper(userController.getDatosUsuario));
router.get("/api/clientes", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(userController.getClientes))
router.get("/api/profesores", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(userController.getProfesores))
router.get("/api/entrenadores", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(userController.getEntrenadores))
router.get("/api/nombres_profesores", wrapper(userController.getNombresProfesores))
router.get("/api/nombres_entrenadores", wrapper(userController.getNombresEntrenadores))

// canchas
router.get("/api/tipos_canchas", wrapper(canchaController.getTipoCanchas));
router.get("/api/tipos_canchas/cancha_id=:id", wrapper(canchaController.getTipoCanchaById));
router.get("/api/canchas", wrapper(canchaController.getCanchas));
router.get("/api/canchas/cancha_id=:id", wrapper(canchaController.getCanchaById));
//superficies
router.get("/api/superficies", wrapper(canchaController.getSuperficies));

// api post
// authentication
router.post("/api/login", wrapper(authentication.login));
router.post("/api/register", wrapper(authentication.register));
// usuarios
router.post("/api/profesores/registrar", (req, res) => res.send(""))
router.post("/api/entrenadores/regstrar", (req, res) => res.send(""))
// Gestion Canchas
router.post("/api/tipos_cancha/agregar", authorization.apiSoloUsers, authorization.apiSoloAdmin, (req, res, next) => {
    uploadImagen.single('imagen')(req, res, function (err) {
        if (err) {
            // Error del fileFilter
            return res.status(400).json({ status: "Error", message: err.message });
        }
        next();
    })
}, wrapper(canchaController.registrarTipoCancha))
router.post("/api/canchas/agregar", (req, res) => res.send(""))

export default router