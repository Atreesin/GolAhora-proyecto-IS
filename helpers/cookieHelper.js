import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION, JWT_COOKIE_EXPIRES, ADMIN_USER_LEVEL } from '../config.js';
import {methods as dbUserQuery} from '../db/dbUserQueries.js'


async function revisarCookie(req){
    try{
        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        const email = decodificarCookie(cookieJWT).email
        const usuarioARevisar = await dbUserQuery.getUserLoginOptionByEmail(email);
        if(!usuarioARevisar){
          return false
        }
        return true;
    }
    catch{
        return false;
    }    
}


async function comprobarAdmin(req){
    try{
        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        const decodificada = jsonwebtoken.verify(cookieJWT,JWT_SECRET);
        const usuarioARevisar = await dbUserQuery.getUserLoginOptionByEmail(decodificada.email);
        if(usuarioARevisar.user_level != ADMIN_USER_LEVEL){
          return false
        }
        return true;
    }
    catch{
        return false;
    }    
}

function decodificarCookie(cookieJWT){
    return jsonwebtoken.verify(cookieJWT,JWT_SECRET);
}

export const methods = {
    revisarCookie,
    comprobarAdmin,
    decodificarCookie
} 