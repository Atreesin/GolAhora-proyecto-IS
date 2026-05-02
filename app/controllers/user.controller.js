import {methods as cookieHelper} from '../helpers/cookieHelper.js'; 
import {methods as dbUserQuery} from "../db/dbUserQueries.js";


async function getDatosUsuario(req, res){
    const cookieJWT = cookieHelper.obtenerCookie(req);
    const decodificada = cookieHelper.decodificarCookie(cookieJWT);
    console.log(decodificada); 
    console.log(decodificada.email); 
    console.log(await dbUserQuery.getUserByEmail(decodificada.email))
    res.send(await dbUserQuery.getUserByEmail(decodificada.email))
}

export const methods = {
    getDatosUsuario
}