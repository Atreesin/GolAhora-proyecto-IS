import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION, JWT_COOKIE_EXPIRES, ADMIN_USER_LEVEL } from '../config.js';
import { methods as dbUserQuery } from '../db/dbUserQueries.js'


async function revisarCookie(req,res) {
    try {
        const cookieJWT = obtenerCookie(req);
        const decodificada = decodificarCookie(cookieJWT);
        
        const email = decodificada.email;
        const usuarioARevisar = await dbUserQuery.getUserLoginOptionByEmail(email);
        if (!usuarioARevisar) {
            return false
        }
        return true;
    }
    catch {
        return false;
    }
}


async function comprobarAdmin(req) {
    try {
        const cookieJWT = obtenerCookie(req);
        const decodificada = decodificarCookie(cookieJWT);
        const usuarioARevisar = await dbUserQuery.getUserLoginOptionByEmail(decodificada.email);

        if (!usuarioARevisar || usuarioARevisar.user_level != ADMIN_USER_LEVEL) {
            return false
        }
        return true;
    }
    catch {
        return false;
    }
}

function obtenerCookie(req){
    
    if (req.headers.plataform === "web") {
        return req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
    }
    if (req.headers.plataform === "windows") {
        return req.headers.authorization
    }
    if(req.headers.plataform != "web" && req.headers.plataform != "windows"){
        return ""
    }
}

function decodificarCookie(cookieJWT) {
    return jsonwebtoken.verify(cookieJWT, JWT_SECRET);
}



export const methods = {
    revisarCookie,
    comprobarAdmin,
    obtenerCookie,
    decodificarCookie
} 