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
import {methods as disp} from "../db/dbDisponibilidadQueries.js"


import { uploadImagen } from "../services/imageUpload.service.js";

const router = Router()
  //*************************************//
 //              docs                   //
//*************************************//
router.get("/api", (req, res) => res.redirect("/api-docs"))

/*****************************************************************************************************************/
/*                                          API GET                                                              /
/****************************************************************************************************************/

  //*************************************//
 //              CLUB                   //
//*************************************//
router.get("/api/clubes", wrapper(clubController.getClubes));
router.get("/api/clubes/full_info", wrapper(clubController.getClubesFullInfo));
router.get("/api/clubes/club_id=:id", wrapper(clubController.getDatosClubById));
router.get("/api/clubes/club_id=:id/full_info", wrapper(clubController.getFullDatosClubById));

  //*************************************//
 //              LUGARES                //
//*************************************//
router.get("/api/paises", wrapper(lugarController.nombrePaises));
router.get("/api/provincias", wrapper(lugarController.nombreProvincias));
router.get("/api/ciudades", wrapper(lugarController.nombreCiudades));
router.get("/api/localidades", wrapper(lugarController.nombreLocalidades));
router.get("/api/localidades/full_info", wrapper(lugarController.fullInfoLocalidades));

  //*************************************//
 //              GENEROS                //
//*************************************//
router.get("/api/generos", wrapper(generoController.generos));

  //*************************************//
 //          USUARIOS                   //
//*************************************//
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
router.get("/api/administradores",authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(userController.getAdministradores))

  //*************************************//
 //             CANCHAS                 //
//*************************************//
router.get("/api/tipos_canchas", wrapper(canchaController.getTipoCanchas));
router.get("/api/tipos_canchas/tipo_cancha_id=:id", wrapper(canchaController.getTipoCanchaById));
router.get("/api/tipos_canchas/tipo_cancha_id=:id/canchas", wrapper(canchaController.getCanchaByTipoCancha));
router.get("/api/canchas", wrapper(canchaController.getCanchas));
router.get("/api/canchas/cancha_id=:id", wrapper(canchaController.getCanchaById));
router.get("/api/canchas/tipo_cancha_id=:id", wrapper(canchaController.getCanchaByTipoCancha));

  //*************************************//
 //          SUPERFICIES                //
//*************************************//
router.get("/api/superficies", wrapper(canchaController.getSuperficies));

  //*************************************//
 //          DISPONIBILIDAD             //
//*************************************//
router.get("/api/disponibilidad", wrapper(canchaController.getDisponibilidades))
router.get("/api/disponibilidad/cerradas", wrapper(canchaController.getListaCarrados))
router.get("/api/disponibilidad/disponibilidad_id=:id", wrapper(canchaController.getDisponibilidadById))
router.get("/api/disponibilidad/dia=:dia", wrapper(canchaController.getDisponibilidadesDiaSemanaNormal))
router.get("/api/disponibilidad/cancha_id=:id", wrapper(canchaController.getDisponibilidadesCancha))
router.get("/api/disponibilidad/cancha_id=:id/fecha=:fecha", wrapper(canchaController.getDisponibilidadCanchaByFecha))
router.get("/api/canchas/cancha_id=:id/disponibilidad", wrapper(canchaController.getDisponibilidadesCancha))
router.get("/api/disponibilidad/dia=:dia/cancha_id=:id", wrapper(canchaController.getDisponibilidadesCanchaDiaSemanaNormal))
router.get("/api/canchas/cancha_id=:id/disponibilidad/dia=:dia", wrapper(canchaController.getDisponibilidadesCanchaDiaSemanaNormal))
router.get("/api/canchas/cancha_id=:id/disponibilidad/fecha=:fecha", wrapper(canchaController.getDisponibilidadCanchaByFecha))

  //*************************************//
 //     DISPONIBILIDAD EXCEPCIONES      // 
//*************************************//
router.get("/api/disponibilidad/especiales", wrapper(canchaController.getDisponibilidadesExcepciones))

  //*************************************//
 //             OCUPACIONES             //
//*************************************//
router.get("/api/ocupaciones", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(canchaController.getOcupacionesCanchas))
router.get("/api/tipo_ocupaciones", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(canchaController.getTipoOcupacionesCanchas))

/*****************************************************************************************************************/
/*                                          API POST                                                              /
/****************************************************************************************************************/

  //*************************************//
 //         AUTHENTICATION              //
//*************************************//
router.post("/api/login", wrapper(authentication.login));
router.post("/api/register", wrapper(authentication.register));

  //*************************************//
 //              USUARIOS               //
//*************************************//
router.post("/api/profesores/registrar", (req, res) => res.send(""))
router.post("/api/entrenadores/regstrar", (req, res) => res.send(""))

  //*************************************//
 //      GESTION DE CANCHAS             //
//*************************************//
router.post("/api/tipos_cancha/agregar", authorization.apiSoloUsers, authorization.apiSoloAdmin, (req, res, next) => {
    uploadImagen.single('imagen')(req, res, function (err) {
        if (err) {
            // Error del fileFilter
            return res.status(400).json({ status: "Error", message: err.message });
        }
        next();
    })
}, wrapper(canchaController.registrarTipoCancha));
router.post("/api/canchas/agregar", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(canchaController.registrarCancha));
router.post("/api/canchas/cancha_id=:id/disponibilidad/agregar", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(canchaController.registrarDisponibilidad))
router.post("/api/disponibilidad/agregar", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(canchaController.registrarDisponibilidad))
// REGISTRAR
router.post("/api/ocupaciones/agregar", authorization.apiSoloUsers, authorization.apiSoloAdmin, wrapper(canchaController.registrarOcupacionCancha))


export default router