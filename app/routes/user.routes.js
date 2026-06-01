import { Router } from "express";
import { __dirname } from "../index.js";

import { methods as authentication } from "../controllers/authentication.controller.js";
import { methods as authorization } from "../middlewares/authorization.js";

const router = Router()

router.get("/Acceso", authorization.soloPublico, (req, res)=>res.sendFile(__dirname + "/pages/Acceder.html"))
router.get("/Registro", authorization.soloPublico, (req,res)=>res.sendFile(__dirname + "/pages/Registro.html"));
router.get("/Perfil", authorization.soloUsers, (req,res)=>res.sendFile(__dirname + "/pages/user/InterfazCliente.html"))
//router.get("/user/:useriId", (req, res) => res.sendFile(__dirname + "/pages/user/profile.html"));
router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Sesión cerrada' });
});
//router.get("/verificar/:token", authentication.verificarCuenta)


export default router