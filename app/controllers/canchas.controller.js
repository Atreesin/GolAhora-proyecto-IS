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
        return res.status(404).send({ status: "Error", message: `Tipo de superficie con id: ${id_superficie} no encontrada` })
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
    //console.log(req.file)
    return res.status(201).send({ status: "ok", message: `Tipo de cancha ${nuevo_tipo_cancha.tipo_cancha} agregado`, redirect: "/" })
}

async function registrarCancha(req, res) {
    const nombre = req.body.nombre;
    let tiempo_cancelacion = req.body.tiempo_cancelacion;
    let precio_hora_reserva = req.body.precio_hora_reserva;
    let id_tipo_de_cancha = req.body.id_tipo_de_cancha;
    // id del club que gestiona el Administrador
    const email = helper.decodificarCookie(helper.obtenerCookie(req));
    const id_club = dbUserQuery.getUserIdByEmail(email);

    if ([nombre, tiempo_cancelacion, precio_hora_reserva, id_tipo_de_cancha, id_club].some(v => v === undefined || v === null || v === "")) {
        return res.status(400).send({ status: "Error", message: "Algunos campos estan vacios" })
    }

    tiempo_cancelacion = helper.convertirADecimalValidado(5);
    precio_hora_reserva = helper.convertirADecimalValidado(10, 2);

    const existeCancha = await dbCanchaQuery.getTipoCanchaByNombreAndIdClub(nombre, id_club);
    if (existeCancha) {
        return res.status(409).send({
            status: "Error",
            message: `La cancha '${nombre}' ya existe.`
        });
    }

    if (tiempo_cancelacion < 0) {
        return res.status(400).send({ status: "Error", message: "El tiempo de cancelación no puede ser menor a 0"})
    }
    if (precio_hora_reserva <= 0) {
        return res.status(400).send({ status: "Error", message: "El precio por hora de reserva debe ser mayor a 0"})
    }
    const tipo_de_cancha = await dbCanchaQuery.getTipoCanchaById(id_tipo_de_cancha);
    if (!tipo_de_cancha) {
        return res.status(404).send({ status: "Error", message: `Tipo de cancha con el id: ${id_tipo_de_cancha}  no encontrada` })
    }

    const nueva_cancha = {
        nombre,
        tiempo_cancelacion,
        precio_hora_reserva,
        id_tipo_de_cancha,
        id_club
    }

    await dbCanchaQuery.agregarCancha(nueva_cancha);
    return res.status(201).send({ status: "ok", message: `Cancha ${nombre} agregada`, redirect: "/" })
}

// consultar
async function getSuperficies(req, res) {

    res.send(await dbCanchaQuery.getSuperficies() || [])
}

async function getTipoCanchas(req, res) {
    res.send(await dbCanchaQuery.getTipoCanchas() || [])
}

async function getCanchas(req, res) {
    res.send(await dbCanchaQuery.getCanchas() || [])
}

async function getTipoCanchaById(req, res) {
    const id_tipo_de_cancha = req.params.id;
    if (!id_tipo_de_cancha) {
        return res.status(400).send({ status: "Error", message: "Ingrese el id del tipo de cancha" })
    }
    const tipo_cancha = await dbCanchaQuery.getTipoCanchaById(id_tipo_de_cancha)
    if (!tipo_cancha) {
        return res.status(404).send({ status: "Error", message: `No existe un tipo de cancha con el id ${id_tipo_de_cancha}` })
    }

    res.send(tipo_cancha)
}

async function getCanchaById(req, res) {
    const id_cancha = req.params.id;
    if (!id_cancha) {
        return res.status(400).send({ status: "Error", message: "Ingrese el id de la cancha" })
    }
    const cancha = await dbCanchaQuery.getCanchaById(id_cancha)
    if (!cancha) {
        return res.status(404).send({ status: "Error", message: `No existe la cancha con el id ${id_cancha}` })
    }
    res.send(cancha)
}


// DISPONIBILIDAD
async function registrarDisponibilidad(req, res) {
    const todos_los_dias = req.body.todos_los_dias;
    let dia_semana = 0;
    if (!todos_los_dias) {
        dia_semana = req.body.dia_semana
    };
    let hora_inicio = req.body.hora_inicio;
    let hora_fin = req.body.hora_fin;
    let id_cancha = req.body.id_cancha;

    if ([hora_inicio, hora_fin, id_cancha].some(v => v === undefined || v === null || v === "")) {
        
        return res.status(400).send({ status: "Error", message: "Algunos campos estan vacios" })
    }

    


    if (!todos_los_dias && (dia_semana <= 0 || dia_semana > 7)){
        return res.status(400).send({ status: "Error", message: "Día de la semana inválido"})
    }

}


export const methods = {
    registrarTipoCancha,
    registrarCancha,
    getSuperficies,
    getTipoCanchas,
    getTipoCanchaById,
    getCanchas,
    getCanchaById,
}