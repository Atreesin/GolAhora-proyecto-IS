import { Router } from "express";
import { __dirname } from "../index.js";

import { methods as authentication } from "../controllers/authentication.controller.js";
import { methods as authorization } from "../middlewares/authorization.js";

const router = Router()

router.get("/Perfil", authorization.soloUsers, (req,res)=>res.sendFile(__dirname + "/pages/user/InterfazCliente.html"))
router.get("/Canchas", authorization.soloUsers, (req,res)=>res.sendFile(__dirname + "/pages/user/canchas.html"))
router.get("/Cancha", authorization.soloUsers, (req,res)=>res.sendFile(__dirname + "/pages/user/canchas.html"))
router.get("/Cobro", authorization.soloUsers, (req,res)=>res.sendFile(__dirname + "/pages/user/Cobro.html"))
router.get("/MisClases", authorization.soloUsers, (req,res)=>res.sendFile(__dirname + "/pages/user/MisClases.html"))
router.get("/MisEntrenamientos", authorization.soloUsers, (req,res)=>res.sendFile(__dirname + "/pages/user/MisEntrenamientos.html"))
router.get("/MisReservas", authorization.soloUsers, (req,res)=>res.sendFile(__dirname + "/pages/user/MisReservas.html"))
router.get("/ReservaDeCancha", authorization.soloUsers, (req,res)=>res.sendFile(__dirname + "/pages/user/ReservadeCancha.html"))
router.get("/Reservar", authorization.soloUsers, (req,res)=>res.sendFile(__dirname + "/pages/user/ReservadeCancha.html"))



export default router