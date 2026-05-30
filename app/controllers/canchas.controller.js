import { stat } from "fs";
import { methods as dbCanchaQuery } from "../db/dbCanchasQueries.js";
import { methods as dbUserQuery } from "../db/dbUserQueries.js";
import { methods as dbDisponibilidadQuery } from "../db/dbDisponibilidadQueries.js";
import { methods as dbOcupacionesQuery } from "../db/dbOcupacionesQueries.js"
import { methods as helper } from "../helpers/utilsHelper.js";
import { methods as cookieHelper} from "../helpers/cookieHelper.js";
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
        return res.status(404).send({ status: "Error", message: `Tipo de superficie con id: ${req.body.id_superficie} no encontrada` })
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
    
    return res.status(201).send({ status: "ok", message: `Tipo de cancha ${nuevo_tipo_cancha.tipo_cancha} agregado`, redirect: "/" })
}

async function registrarCancha(req, res) {
    const nombre = req.body.nombre;
    let tiempo_cancelacion = req.body.tiempo_cancelacion;
    let precio_hora_reserva = req.body.precio_hora_reserva;
    let id_tipo_de_cancha = req.body.id_tipo_de_cancha;
    // id del club que gestiona el Administrador
    const email = cookieHelper.decodificarCookie(cookieHelper.obtenerCookie(req)).email;
    const id_club = (await dbUserQuery.getUserByEmail(email)).id_club;
    
    if ([nombre, tiempo_cancelacion, precio_hora_reserva, id_tipo_de_cancha, id_club].some(v => v === undefined || v === null || v === "")) {
        return res.status(400).send({ status: "Error", message: "Algunos campos estan vacios" })
    }

    tiempo_cancelacion = helper.convertirADecimalValidado(tiempo_cancelacion);
    precio_hora_reserva = helper.convertirADecimalValidado(precio_hora_reserva, 2);

    const existeCancha = await dbCanchaQuery.getCanchaByNombreAndClubId(nombre, id_club);
    if (existeCancha) {
        return res.status(409).send({
            status: "Error",
            message: `La cancha '${nombre}' ya existe.`
        });
    }

    if (tiempo_cancelacion < 0) {
        return res.status(400).send({ status: "Error", message: "El tiempo de cancelación no puede ser menor a 0" })
    }
    if (precio_hora_reserva <= 0) {
        return res.status(400).send({ status: "Error", message: "El precio por hora de reserva debe ser mayor a 0" })
    }
    const tipo_de_cancha = await dbCanchaQuery.getTipoCanchaById(id_tipo_de_cancha);
    if (!tipo_de_cancha) {
        return res.status(404).send({ status: "Error", message: `Tipo de cancha con el id: ${req.body.id_tipo_de_cancha}  no encontrada` })
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
        return res.status(404).send({ status: "Error", message: `No existe un tipo de cancha con el id ${req.params.id}` })
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
        return res.status(404).send({ status: "Error", message: `No existe la cancha con el id ${req.params.id}` })
    }
    res.send(cancha)
}

async function getCanchaByTipoCancha (req, res) {
    const id_tipo_de_cancha = req.params.id;
    if (!id_tipo_de_cancha) {
        return res.status(400).send({ status: "Error", message: "Ingrese el id del tipo cancha" })
    }
    const cancha = await dbCanchaQuery.getCanchaByTipoCancha(id_tipo_de_cancha) || []
    
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
    let id_cancha = (req.params.id || req.body.id_cancha);
    
    if ([hora_inicio, hora_fin, id_cancha].some(v => v === undefined || v === null || v === "")) {

        return res.status(400).send({ status: "Error", message: "Algunos campos estan vacios" })
    }

    dia_semana = helper.normalizarDia(dia_semana);
    hora_inicio = helper.convertirAHora24(hora_inicio);
    hora_fin = helper.convertirAHora24(hora_fin);
    id_cancha = helper.convertirADecimalValidado(id_cancha);

    
    const existeCancha = await dbCanchaQuery.getCanchaById(id_cancha);
    if (!existeCancha) {
        return res.status(404).send({ status: "Error", message: `No existe la Cancha con el id: ${req.params.id || req.body.id_cancha}` })
    }

    if (!todos_los_dias && dia_semana === null) {
        return res.status(400).send({ status: "Error", message: "Día de la semana inválido" })
    }
    if (!hora_inicio) {
        return res.status(400).send({ status: "Error", message: "Horario o formato de hora de inicio inválido" })
    }
    if (!hora_fin) {
        return res.status(400).send({ status: "Error", message: "Horario o formato de hora de fin inválido" })
    }
    if (helper.compararHoras(hora_inicio, hora_fin)) {
        return res.status(400).send({ status: "Error", message: "La hora de inicio no puede ser mayor o igual que la hora de fin" })
    }
    if (helper.horaToMinutos(hora_fin) - helper.horaToMinutos(hora_inicio) < 240) {
        return res.status(400).send({
            status: "Error",
            message: "El rango horario no puede ser inferior a 4 horas",
            detale: {
                minimo: `${240 * 60}hs`,
                recibido: `${helper.horaToMinutos(hora_fin) - helper.horaToMinutos(hora_inicio)}`
            }
        })
    }

    let nuevaDisponibilidad = {
        dia_semana,
        hora_inicio,
        hora_fin,
        id_cancha
    }
    //si todos los dias
    if (todos_los_dias) {

        let diasExistentes = [];
        let diasAgregados = [];
        let diasError = [];
        for (let i = 0; i < 7; i++) {
            if (!await dbDisponibilidadQuery.getDisponibilidadByDiaSemanaAndIdCancha(helper.normalizarDia(i + 1), id_cancha)) {
                nuevaDisponibilidad.dia_semana = helper.normalizarDia(i + 1)
                const respuesta = await dbDisponibilidadQuery.agregarDisponibilidad(nuevaDisponibilidad);
                if (respuesta.affectedRows > 0) {
                    diasAgregados.push(helper.normalizarDia(i + 1))
                } else {
                    diasError.push(helper.normalizarDia(i + 1));
                }
            } else {
                diasExistentes.push(helper.normalizarDia(i + 1))
            }
        }
        const resultado = {
            diasAgregados,
            diasExistentes,
            diasError
        }
        if (diasAgregados.length === 7) {
            return res.status(201).send({
                status: "Success",
                message: "Todos las disponibilidades fueron asignadas correctamente",
                disponibilidadesAgregadas: diasAgregados.length,
                resultado
            })
        }
        if (diasAgregados.length < 7 && diasAgregados.length > 0 && diasError.length === 0) {
            return res.status(200).send({
                status: "Partial Success",
                message: "Algunas disponibilidades ya existían",
                DisponibilidadesAgregadas: diasAgregados.length,
                DisponibilidadesExistentes: diasExistentes.length,
                resultado
            })
        }
        if (diasAgregados.length < 7 && diasAgregados.length > 0 && diasError.length > 0) {
            return res.status(207).send({
                status: "Partial Error",
                message: "Error al intentar asignar algunas disponibilidades",
                DisponibilidadesAgregadas: diasAgregados.length,
                DisponibilidadesExistentes: diasExistentes.length,
                DisponibilidadesNoAgregadas: diasError.length,
                resultado
            })
        }
        if (diasAgregados.length === 0 && diasError.length === 0) {
            return res.status(409).send({
                status: "Error",
                message: "Todas las disponibilidades ya existían",
                DisponibilidadesAgregadas: diasAgregados.length,
                DisponibilidadesExistentes: diasExistentes.length,
                DisponibilidadesNoAgregadas: diasError.length,
                resultado
            })
        }
        if (diasError.length === 7) {
            return res.status(400).send({
                status: "Error",
                message: "Error al intentar asignar todas las disponibilidades",
                DisponibilidadesAgregadas: diasAgregados.length,
                DisponibilidadesExistentes: diasExistentes.length,
                DisponibilidadesNoAgregadas: diasError.length,
                resultado
            })
        }
    }

    if (!await dbDisponibilidadQuery.getDisponibilidadByDiaSemanaAndIdCancha(dia_semana, id_cancha)) {
        const respuesta = await dbDisponibilidadQuery.agregarDisponibilidad(nuevaDisponibilidad);
        
        if (respuesta.affectedRows > 0) {
            return res.status(201).send({
                status: "Success",
                message: `La disponibilidad del dia ${dia_semana} fue asignada correctamente`,
                disponibilidadesAgregadas: 1,
                datos: {
                    id_disponibilidad: respuesta.inserId,
                    dia_semana,
                    hora_inicio,
                    hora_fin,
                    id_cancha,
                }
            })
        } else {
            return res.status(400).send({
                status: "Error",
                message: `No se pudo asignar la disponibilidad del dia ${dia_semana}`,
                disponibilidadesAgregadas: 0
            })
        }
    } else {
        return res.status(409).send({
            status: "Error",
            message: `La disponibilidad del dia ${dia_semana} ya existe`,
            disponibilidadesAgregadas: 0,
            disponibilidadesExistentes: 1
        })
    }
}

// listar
async function getDisponibilidades(req, res) {
    res.send(await dbDisponibilidadQuery.getDisponibilidades() || [])
}
async function getListaCarrados(req, res) {
    res.send(await dbDisponibilidadQuery.getNoDisponibles() || [])
}
//consultar
async function getDisponibilidadById(req, res) {
    //id disp
    let id_disponibilidad = req.params.id;
    if (!id_disponibilidad) {
        return res.status(400).send({ status: "Error", message: "Ingrese el id de la disponibilidad" })
    }
    id_disponibilidad = helper.convertirADecimalValidado(id_disponibilidad);
    if (id_disponibilidad === null) {
        return res.status(400).send({ status: "Error", message: "El id debe ser un número entero" })
    }
    const disponibilidad = await dbDisponibilidadQuery.getDisponibilidadById(id_disponibilidad)
    if (!disponibilidad) {
        return res.status(404).send({ status: "Error", message: `No existe una disponibilidad con el id ${req.params.id}` })
    }

    res.send(disponibilidad)
}
async function getDisponibilidadesDiaSemanaNormal(req, res) {
    //dia_semana
    let dia_semana = req.params.dia;
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    if (!dia_semana) {
        return res.status(400).send({ status: "Error", message: "Ingrese el día de la disponibilidad" })
    }
    dia_semana = helper.normalizarDia(dia_semana);
    if (dia_semana === null) {
        return res.status(400).send({
            status: "Error",
            message: "El día ingresado es inválido",
            expected: {
                numeros: "1-7",
                dias: dias
            }
        })
    }
    const disponibilidad = await dbDisponibilidadQuery.getDisponibilidadByDiaSemana(dia_semana) || []

    res.send(disponibilidad)
}
async function getDisponibilidadesCancha(req, res) {
    //id_cancha
    let id_cancha = req.params.id;
    if (!id_cancha) {
        return res.status(400).send({ status: "Error", message: "Ingrese el id de la cancha" })
    }
    id_cancha = helper.convertirADecimalValidado(id_cancha);
    if (id_cancha === null) {
        return res.status(400).send({ status: "Error", message: "El id de la cancha debe ser un número entero" })
    }
    const cancha = await dbCanchaQuery.getCanchaById(id_cancha);
    if (!cancha) {
        return res.status(404).send({ status: "Error", message: `La cancha con el id ${req.params.id} no existe` })
    }
    const disponibilidad = await dbDisponibilidadQuery.getDisponibilidadByIdCancha(id_cancha)
    if (!disponibilidad) {
        return res.status(404).send({ status: "Error", message: `La cancha con el id ${req.params.id} no tiene ninguna disponibilidad asignada` })
    }

    res.send(disponibilidad)
}
async function getDisponibilidadesCanchaDiaSemanaNormal(req, res) {
    //dia_semana
    //id_cancha
    let dia_semana = req.params.dia;
    let id_cancha = req.params.id;
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    if (!id_cancha) {
        return res.status(400).send({ status: "Error", message: "Ingrese el id de la cancha" })
    }
    id_cancha = helper.convertirADecimalValidado(id_cancha);
    if (id_cancha === null) {
        return res.status(400).send({ status: "Error", message: "El id de la cancha debe ser un número entero" })
    }
    if (!dia_semana) {
        return res.status(400).send({ status: "Error", message: "Ingrese el día de la disponibilidad" })
    }
    dia_semana = helper.normalizarDia(dia_semana);
    if (dia_semana === null) {
        return res.status(400).send({
            status: "Error",
            message: "El día ingresado es inválido",
            expected: {
                numeros: "1-7",
                dias: dias
            }
        })
    }

    const cancha = await dbCanchaQuery.getCanchaById(id_cancha);
    if (!cancha) {
        return res.status(404).send({ status: "Error", message: `La cancha con el id ${req.params.id} no existe` })
    }

    const disponibilidad = await dbDisponibilidadQuery.getDisponibilidadByDiaSemanaAndIdCancha(dia_semana, id_cancha)
    if (!disponibilidad) {
        return res.status(404).send({ status: "Error", message: `La cancha con el id ${req.params.id} no tiene disponibilidad asignada el dia ${req.params.dia}` })
    }
    res.send(disponibilidad)
}


// EXCEPCIONES
async function registrarDisponibilidadExcepcion(req, res) {

}

// listar
async function getDisponibilidadesExcepciones(req, res) {
    res.send(await dbDisponibilidadQuery.getDisponibilidadesExcepciones() || [])
}

// consultar
async function getDisponibilidadExcepcionById(req, res) {

}
async function getDisponibilidadesExcepcionesByIdCancha(req, res) {

}
async function getDisponibilidadesExcepcionesByMotivo(req, res) {

}
async function getDisponibilidadesExcepcionesByFecha(req, res) {

}

async function getDisponibilidadCanchaByFecha(req, res) {

}

async function estadoCanchaFecha(req, res) {

}

// OCUPACIONES
async function registrarOcupacionCancha(req, res) {
    /*
    fecha
    hora_inicio
    hora_fin
    id_tipo_ocupacion
    id_cancha
    */
    let fecha = req.body.fecha
    let hora_inicio = req.body.hora_inicio
    let hora_fin = req.body.hora_fin
    let id_tipo_ocupacion = req.body.id_tipo_ocupacion
    let id_cancha = req.params.id_cancha || req.body.id_cancha

    if ([fecha, hora_inicio, hora_fin, id_tipo_ocupacion, id_cancha].some(v => v === undefined || v === null || v === "")) {

        return res.status(400).send({ status: "Error", message: "Algunos campos estan vacios" })
    }

    fecha = helper.normalizarFecha(fecha);
    hora_inicio = helper.convertirAHora24(hora_inicio);
    hora_fin = helper.convertirAHora24(hora_fin);
    id_tipo_ocupacion = helper.convertirADecimalValidado(id_cancha);
    id_cancha = helper.convertirADecimalValidado(id_cancha);
    if(!fecha){
        return res.status(400).send({ status: "Error", message: `El formato de la fecha ${req.body.fecha} no es válido` })
    }
    if (false){

    }
    if (!hora_inicio) {
        return res.status(400).send({ status: "Error", message: "Horario o formato de hora de inicio inválido" })
    }
    if (!hora_fin) {
        return res.status(400).send({ status: "Error", message: "Horario o formato de hora de fin inválido" })
    }
    if (helper.compararHoras(hora_inicio, hora_fin)) {
        return res.status(400).send({ status: "Error", message: "La hora de inicio no puede ser mayor o igual que la hora de fin" })
    }
    const existe_tipoOcupacion = await dbOcupacionesQuery.getTipoOcupacionById(id_tipo_ocupacion);
    if (!existe_tipoOcupacion){
        return res.status(404).send({ status: "Error", message: `Tipo de ocupacion con el id: ${req.body.id_tipo_ocupacion}  no encontrada` })
    }
    const existeCancha = await dbCanchaQuery.getCanchaById(id_cancha);
    if (!existeCancha) {
        return res.status(404).send({ status: "Error", message: `No existe la Cancha con el id: ${req.params.id || req.body.id_cancha}` })
    }
    if (existe_tipoOcupacion.tipo === 'Reserva'){
        const dia_semana = helper.obtenerDia(fecha)
        const disponibilidad = await dbDisponibilidadQuery.getDisponibilidadReal(fecha, id_cancha);

        if (!disponibilidad){
            return res.status(404).send({ status: "Error", message: `No hay disponibilidad para la Cancha con el id: ${req.params.id || req.body.id_cancha} el dia ${dia_semana} ${fecha}` })
        }
        if (disponibilidad.estado === 'Cerrado'){
            return res.status(404).send({ status: "Error", message: `La Cancha con el id: ${req.params.id || req.body.id_cancha} se encuentra cerrada el dia ${dia_semana} ${fecha}` })
        }
        if (1){

        }


        
    }
    //   aaa
    const canchaOcupada = await dbOcupacionesQuery.getSuperposicionOcupacionesCanchas(id_cancha, fecha, hora_inicio, hora_fin)
    if (canchaOcupada){
        return res.status(409).send({ status: "Error", message: `No existe la Cancha con el id: ${req.params.id || req.body.id_cancha}` })
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
    getCanchaByTipoCancha,
    //disponibilidad
    registrarDisponibilidad,
    getDisponibilidades,
    getListaCarrados,
    getDisponibilidadById,
    getDisponibilidadesDiaSemanaNormal,
    getDisponibilidadesCancha,
    getDisponibilidadesCanchaDiaSemanaNormal,
    //excepciones
    getDisponibilidadesExcepciones
}