import { Router } from "express";
import { __dirname } from "../index.js";

import { methods as authentication } from "../controllers/authentication.controller.js";
import { methods as authorization } from "../middlewares/authorization.js";

const router = Router()

router.get("/Acceder", authorization.soloPublico, (req, res)=>res.sendFile(__dirname + "/pages/Acceder.html"))
router.get("/Registro", authorization.soloPublico, (req,res)=>res.sendFile(__dirname + "/pages/Registro.html"));
//router.get("/user/:useriId", (req, res) => res.sendFile(__dirname + "/pages/user/profile.html"));
router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Sesión cerrada' });
});
//router.get("/verificar/:token", authentication.verificarCuenta)
router.get("/ListarCancha", (req,res)=>res.sendFile(__dirname + "/public/ListarCanchas.html"))
router.get("/Torneos", (req,res)=>res.sendFile(__dirname + "/public/Torneos.html"))
router.get("/Ligas", (req,res)=>res.sendFile(__dirname + "/public/Ligas.html"))
router.get("/Descuentos", (req,res)=>res.sendFile(__dirname + "/public/Descuentos.html"))

export default router