import { Router } from "express";
import { __dirname } from "../index.js";

import { methods as authentication } from "../controllers/authentication.controller.js";
import { methods as authorization } from "../middlewares/authorization.js";

const router = Router()

router.get("/admin", authorization.soloUsers, authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/admin.html"));
router.get("/admin/Clientes", authorization.soloUsers, authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/ConsultaClientes.html"));
router.get("/admin/Entrenadores", authorization.soloUsers, authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/ConsultaEntrenadores.html"));
router.get("/admin/Profesores", authorization.soloUsers, authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/ConsultaProfesores.html"));
router.get("/admin/Disponibilidad", authorization.soloUsers, authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/Disponibilidad_cancha.html"));



export default router

