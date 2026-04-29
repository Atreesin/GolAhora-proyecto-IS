import { Router } from "express";
import { __dirname } from "../index.js";

import { methods as authentication } from "../controllers/authentication.controller.js";
import { methods as authorization } from "../middlewares/authorization.js";

const router = Router()
/*
router.get("/login", authorization.soloPublico, (req, res)=>res.sendFile(__dirname + "/pages/login.html"))
router.get("/register",authorization.soloPublico,(req,res)=>res.sendFile(__dirname + "/pages/register.html"));
router.get("/user/:useriId", (req, res) => res.sendFile(__dirname + "/pages/user/profile.html"));
//router.get("/verificar/:token", authentication.verificarCuenta)
*/
router.get("/admin", authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/admin.html"));


export default router