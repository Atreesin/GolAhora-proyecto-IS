import {methods as cookieHelper} from '../helpers/cookieHelper.js'; 
import {methods as dbUserQuery} from "../db/dbUserQueries.js";
import { CLIENT_USER_LEVEL, PROFESOR_USER_LEVEL, ENTRENADOR_USER_LEVEL, ADMIN_USER_LEVEL } from '../config.js';

async function getUsuarios(req, res){
    
    res.send(await dbUserQuery.getUsuarios() || [])
}
async function getCantidadUsuarios(req, res){
    
    res.send(await dbUserQuery.getCantidadUsuarios() || 0)
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
    const usuario = await dbUserQuery.getFullUserById(id_usuario)
    if(!usuario){
        return res.status(404).send({ status: "Error", message: `No existe el usuario con el id ${id_usuario}` })
    }
    res.send(usuario)
}

async function getDatosUsuarioById(req, res){
    const id_usuario = req.params.id;
    if(!id_usuario){
        return res.status(400).send({ status: "Error", message: "Ingrese el id del Usuario" })
    }
    const usuario = await dbUserQuery.getUserById(id_usuario)
    if(!usuario){
        return res.status(404).send({ status: "Error", message: `No existe el usuario con el id ${id_usuario}` })
    }
    res.send(usuario)
}

// tipos de usuarios
async function getClientes(req, res){
    res.send(await dbUserQuery.getUsuariosByLevel(CLIENT_USER_LEVEL) || [])
}
async function getProfesores(req, res){
    res.send(await dbUserQuery.getUsuariosByLevel(PROFESOR_USER_LEVEL) || [])
}
async function getEntrenadores(req, res){
    res.send(await dbUserQuery.getUsuariosByLevel(ENTRENADOR_USER_LEVEL) || [])
}

async function getAdministradores(req, res){
    res.send(await dbUserQuery.getUsuariosByLevel(ADMIN_USER_LEVEL) || [])
}
// nombres de profesionales
async function getNombresProfesores(req, res){
    res.send(await dbUserQuery.getNombresUsuariosByLevel(PROFESOR_USER_LEVEL) || [])
}
async function getNombresEntrenadores(req, res){
    res.send(await dbUserQuery.getNombresUsuariosByLevel(ENTRENADOR_USER_LEVEL) || [])
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
    getNombresEntrenadores,
    getAdministradores
}