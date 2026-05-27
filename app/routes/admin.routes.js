import { Router } from "express";
import { __dirname } from "../index.js";

import { methods as authentication } from "../controllers/authentication.controller.js";
import { methods as authorization } from "../middlewares/authorization.js";

const router = Router()

router.get("/admin", authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/admin.html"));
router.get("/admin/clientes", authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/gestion_clientes.html"));



export default router

