import {methods as cookieHelper} from '../helpers/cookieHelper.js'; 
import {methods as dbUserQuery} from "../db/dbUserQueries.js";
import { CLIENT_USER_LEVEL, PROFESOR_USER_LEVEL, ENTRENADOR_USER_LEVEL } from '../config.js';

async function getUsuarios(req, res){
    
    res.send(await dbUserQuery.getUsuarios())
}
async function getCantidadUsuarios(req, res){
    
    res.send(await dbUserQuery.getCantidadUsuarios())
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

// clientes
async function getClientes(req, res){
    res.send(await dbUserQuery.getUsuariosByLevel(CLIENT_USER_LEVEL))
}
async function getProfesores(req, res){
    res.send(await dbUserQuery.getUsuariosByLevel(PROFESOR_USER_LEVEL))
}
async function getEntrenadores(req, res){
    res.send(await dbUserQuery.getUsuariosByLevel(ENTRENADOR_USER_LEVEL))
}
async function getNombresProfesores(req, res){
    res.send(await dbUserQuery.getNombresUsuariosByLevel(PROFESOR_USER_LEVEL))
}
async function getNombresEntrenadores(req, res){
    res.send(await dbUserQuery.getNombresUsuariosByLevel(ENTRENADOR_USER_LEVEL))
}

export const methods = {
    getUsuarios,
    getCantidadUsuarios,
    getFullDatosUsuario,
    getDatosUsuario,
    getDatosUsuarioById,
    getFullDatosUsuarioById,
    getClientes,
    getProfesores,
    getEntrenadores,
    getNombresProfesores,
    getNombresEntrenadores
}