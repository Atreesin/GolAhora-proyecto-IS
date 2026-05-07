import {methods as cookieHelper} from '../helpers/cookieHelper.js'; 
import {methods as dbUserQuery} from "../db/dbUserQueries.js";


async function getUsuarios(req, res){
    
    res.send(await dbUserQuery.getUsuarios())
}

async function getFullDatosUsuario(req, res){
    const cookieJWT = cookieHelper.obtenerCookie(req);

    const decodificada = cookieHelper.decodificarCookie(cookieJWT);
    
    res.send(await dbUserQuery.getFullUserByEmail(decodificada.email))
}

async function getDatosUsuario(req, res){
    const cookieJWT = cookieHelper.obtenerCookie(req);

    const decodificada = cookieHelper.decodificarCookie(cookieJWT);
    
    res.send(await dbUserQuery.getUserByEmail(decodificada.email))
}

export const methods = {
    getUsuarios,
    getFullDatosUsuario,
    getDatosUsuario
}