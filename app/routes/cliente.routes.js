import { Router } from "express";
import { __dirname } from "../index.js";

import { methods as authentication } from "../controllers/authentication.controller.js";
import { methods as authorization } from "../middlewares/authorization.js";

const router = Router()

router.get("/Perfil", authorization.soloUsers, (req, res) => res.sendFile(__dirname + "/pages/admin/admin.html"))

export default router