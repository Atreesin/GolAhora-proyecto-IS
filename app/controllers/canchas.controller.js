import { stat } from "fs";
import { methods as dbCanchaQuery } from "../db/dbCanchasQueries.js";
import { methods as dbUserQuery } from "../db/dbUserQueries copy.js";
import { methods as helper } from "../helpers/utilsHelper.js";
import { borrarArchivoSiExiste } from "../helpers/archivoHelper.js";

//registrar
async function registrarTipoCancha(req, res) {
    
    const tipo_cancha = req.body.tipo_cancha;
    let duracion_min = req.body.duracion_min;
    let duracion_max = req.body.duracion_max;
    let ancho = req.body.ancho;
    let largo = req.body.largo;
    let capacidad = req.body.capacidad;
    let id_superficie = req.body.id_superficie;
    const imagen_url = req.file
        ? '/img/canchas/' + req.file.filename
        : '/img/canchas/cancha.png';

    if ([tipo_cancha, duracion_min, duracion_max, ancho, largo, capacidad, id_superficie].some(v => v === undefined || v === null || v === "")) {
        borrarArchivoSiExiste(req.file);
        return res.status(400).send({ status: "Error", message: "Algunos campos estan vacios" })
    }

    duracion_min = helper.convertirADecimalValidado(duracion_min);
    duracion_max = helper.convertirADecimalValidado(duracion_max);
    ancho = helper.convertirADecimalValidado(ancho, 2);
    largo = helper.convertirADecimalValidado(largo, 2);
    capacidad = helper.convertirADecimalValidado(capacidad);
    id_superficie = helper.convertirADecimalValidado(id_superficie);

    const existeTipoCancha = await dbCanchaQuery.getTipoCanchaByNombre(tipo_cancha);
    if (existeTipoCancha) {
        borrarArchivoSiExiste(req.file);
        return res.status(409).json({
            status: "Error",
            message: `El tipo de cancha '${tipo_cancha}' ya existe`
        });
    }

    if (!id_superficie) {

        borrarArchivoSiExiste(req.file);
        return res.status(400).send({ status: "Error", message: "Formato inválido: el id debe ser un entero positivo" })
    }

    const superficie = await dbCanchaQuery.getSuperficieById(id_superficie);

    if (!superficie) {

        borrarArchivoSiExiste(req.file);
        return res.status(404).send({ status: "Error", message: "Tipo de superficie con ese id no encontrada" })
    }

    if (duracion_min > duracion_max) {
        borrarArchivoSiExiste(req.file);
        return res.status(400).send({ status: "Error", message: "La duración mínima no puede ser mayor que la duración máxima" })
    }
    if (duracion_min < 30) {
        borrarArchivoSiExiste(req.file);
        return res.status(400).send({ status: "Error", message: "La duración mínima no puede ser inferior a 30 minutos" })
    }
    if (ancho >= largo) {
        borrarArchivoSiExiste(req.file);
        return res.status(400).send({ status: "Error", message: "El ancho no puede ser mayor o igual que el largo" })
    }

    if (!helper.estaEnRango(ancho, 10, 85)) {
        borrarArchivoSiExiste(req.file);
        return res.status(400).send({ status: "Error", message: "El ancho debe estar entre 10 y 85" })
    }
    if (!helper.estaEnRango(largo, 22, 120)) {
        borrarArchivoSiExiste(req.file);
        return res.status(400).send({ status: "Error", message: "El largo debe estar entre 22 y 120" })
    }
    if (capacidad > 22) {
        borrarArchivoSiExiste(req.file);
        return res.status(400).send({ status: "Errror", message: "La capacidad no puede exceder las 22 personas" })
    }
    if (!helper.esPar(capacidad)) {
        borrarArchivoSiExiste(req.file);
        return res.status(400).send({ status: "Errror", message: "La capacidad no puede ser impar" })
    }

    const nuevo_tipo_cancha = {
        tipo_cancha,
        duracion_min,
        duracion_max,
        ancho,
        largo,
        capacidad,
        imagen_url,
        id_superficie
    }
    await dbCanchaQuery.agregarTipoCancha(nuevo_tipo_cancha);
    console.log(req.file)
    return res.status(201).send({ status: "ok", message: `Tipo de cancha ${nuevo_tipo_cancha.tipo_cancha} agregado`, redirect: "/" })
}

async function registrarCancha(req, res) {
    const nombre = req.body.nombre? req.body.nombre : "";
    const tiempo_cancelacion = req.body.tiempo_cancelacion;
    const precio_hora_reserva = req.body.precio_hora_reserva;
    const id_tipo_de_cancha = req.body.id_tipo_de_cancha;
    // id del club que gestiona el Administrador
    const email = helper.decodificarCookie(helper.obtenerCookie(req));
    const id_club = dbUserQuery.getUserIdByEmail(email) || 1;

    if (!nombre, !tiempo_cancelacion){

    }
}

// consultar
async function getSuperficies(req, res) {

    res.send(await dbCanchaQuery.getSuperficies())
}

async function getTipoCanchas(req, res) {
    res.send(await dbCanchaQuery.getTipoCanchas())
}

async function getCanchas(req, res) {
    res.send(await dbCanchaQuery.getCanchas())
}

async function getTipoCanchaById(req, res) {
    const id_tipo_de_cancha = req.params.id;
    if (!id_tipo_de_cancha) {
        return res.status(400).send({ status: "Error", message: "Ingrese el id del tipo de cancha" })
    }
    res.send(await dbCanchaQuery.getTipoCanchaById(id_tipo_de_cancha))
}

async function getCanchaById(req, res) {
    const id_cancha = req.params.id;
    if (!id_cancha) {
        return res.status(400).send({ status: "Error", message: "Ingrese el id de la cancha" })
    }
    res.send(await dbCanchaQuery.getCanchaById(id_cancha))
}


export const methods = {
    registrarTipoCancha,
    getSuperficies,
    getTipoCanchas,
    getTipoCanchaById,
    getCanchas,
    getCanchaById,
}