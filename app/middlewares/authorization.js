import jsonwebtoken from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRATION, JWT_COOKIE_EXPIRES, ADMIN_USER_LEVEL } from '../config.js';
import { methods as dbUserQuery} from "../db/dbUserQueries.js"



async function soloAdmin(req,res,next){
    const isAdmin = await comprobarAdmin(req);
    if(isAdmin) return next();
    return res.redirect("/");
}

async function soloUsers(req,res,next){
    const logeado = await revisarCookie(req);
    console.log(logeado)
    if(logeado) return next();
    return res.redirect("/");
}

async function soloPublico(req,res,next){
    const logeado = await revisarCookie(req);
    if(!logeado) return next();
    return res.redirect("/");
}

async function revisarCookie(req){
    try{
        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        const decodificada = jsonwebtoken.verify(cookieJWT,JWT_SECRET);
        console.log(JWT_SECRET)
       
        const usuarioARevisar = await dbUserQuery.getDatosUsuarioPorEmail(decodificada.email);
        console.log(usuarioARevisar)
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
        const usuarioARevisar = await dbUserQuery.getDatosUsuarioPorEmail(decodificada.email);
        if(usuarioARevisar.user_level != ADMIN_USER_LEVEL){
          return false
        }
        return true;
    }
    catch{
        return false;
    }    
}


export const methods = {
    soloAdmin,
    soloUsers,
    soloPublico,
}