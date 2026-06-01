import { methods as cookieHelper } from '../helpers/cookieHelper.js';


async function soloAdmin(req, res, next) {
    const referer = req.get('Referer');
    res.referer = referer
    const isAdmin = await cookieHelper.comprobarAdmin(req);
    if (isAdmin) return next();
    return res.redirect("/Acceder");
}

async function soloUsers(req, res, next) {

    const logeado = await cookieHelper.revisarCookie(req);

    if (logeado) return next();
    const referer = req.get('Referer');
    res.referer = referer
    const now = new Date(Date.now());
    const cookieOpption = {
        expires: now,
        path: "/"
    };
    res.cookie("jwt", "", cookieOpption);
    return res.redirect("/Acceder");
}

async function soloPublico(req, res, next) {
    const logeado = await cookieHelper.revisarCookie(req);
    if (!logeado) return next();
    return res.redirect("/");
}

async function apiSoloAdmin(req, res, next) {
    const isAdmin = await cookieHelper.comprobarAdmin(req);
    if (isAdmin) return next();
    return res.status(403).json({ error: "Acceso restringido a administradores" });
}

async function apiSoloUsers(req, res, next) {

    const logeado = await cookieHelper.revisarCookie(req);
    if (logeado) return next();
    if(!cookieHelper.obtenerCookie(req)){
        
        return res.status(401).json({ error: "Usuario no autenticado" });
    }
    const now = new Date(Date.now());
    const cookieOpption = {
        expires: now,
        path: "/"
    };
    res.cookie("jwt", "", cookieOpption);
    if (cookieHelper.obtenerCookie(req) === "error"){
        return res.status(400).json({ error: "Error de solicitud"});
    }
    return res.status(401).json({ error: "Token inválido, expirado o credenciales incorrectas." });
}

export const methods = {
    soloAdmin,
    soloUsers,
    soloPublico,
    apiSoloAdmin,
    apiSoloUsers
}