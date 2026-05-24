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

async function getFullDatosUsuarioById(req, res){
    const id_usuario = req.params.id;
    if(!id_usuario){
        return res.status(400).send({ status: "Error", message: "Ingrese el id del Usuario" })
    }
    res.send(await dbUserQuery.getFullUserById(id_usuario))
}

async function getDatosUsuarioById(req, res){
    const id_usuario = req.params.id;
    if(!id_usuario){
        return res.status(400).send({ status: "Error", message: "Ingrese el id del Usuario" })
    }
    res.send(await dbUserQuery.getUserById(id_usuario))
}

export const methods = {
    getUsuarios,
    getFullDatosUsuario,
    getDatosUsuario,
    getDatosUsuarioById,
    getFullDatosUsuarioById
}