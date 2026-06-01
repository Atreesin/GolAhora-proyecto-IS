import pool from './databaseConnection.js';

const insertTipoOcupacion = `INSERT INTO tipos_de_ocupaciones SET ?`;
const insertOcupacionCancha = `INSERT INTO ocupaciones_cancha SET ?`;


const selectTiposOcupaciones = `SELECT id_tipo_ocupacion AS id, tipo_ocupacion AS tipo FROM tipos_de_ocupaciones ORDER BY ID ASC`;
const selectTipoOcupacionById = `SELECT id_tipo_ocupacion AS id, tipo_ocupacion AS tipo FROM tipos_de_ocupaciones WHERE id_tipo_ocupacion = ?`;
const selectTipoOcupacionByTipo = `SELECT id_tipo_ocupacion AS id, tipo_ocupacion AS tipo FROM tipos_de_ocupaciones WHERE tipo_ocupacion = ?`;

const selectOcupacionesCanchas = `SELECT oc.id_ocupacion_cancha AS id, DATE_FORMAT(oc.fecha, '%Y-%m-%d') AS fecha, CASE DAYOFWEEK(oc.fecha) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, oc.hora_inicio, oc.hora_fin, JSON_OBJECT('id', toc.id_tipo_ocupacion, 'tipo', toc.tipo_ocupacion) AS ocupacion, JSON_OBJECT('id', can.id_cancha, 'nombre', can.nombre) AS cancha FROM ocupaciones_cancha oc LEFT JOIN tipos_de_ocupaciones toc ON oc.id_tipo_ocupacion = toc.id_tipo_ocupacion LEFT JOIN canchas can ON oc.id_cancha = can.id_cancha`;
const selectSuperposicionOcupacionesCanchas = `SELECT id_ocupacion_cancha AS id, DATE_FORMAT(oc.fecha, '%Y-%m-%d') AS fecha, CASE DAYOFWEEK(oc.fecha) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, hora_inicio, JSON_OBJECT('id', toc.id_tipo_ocupacion, 'tipo', toc.tipo_ocupacion) AS ocupacion, JSON_OBJECT('id', can.id_cancha, 'nombre', can.nombre) AS cancha FROM ocupaciones_cancha oc LEFT JOIN tipos_de_ocupaciones toc ON oc.id_tipo_ocupacion = toc.id_tipo_ocupacion LEFT JOIN canchas can ON oc.id_cancha = can.id_cancha WHERE oc.id_cancha = ? AND fecha = ? AND ((hora_fin >= ? AND hora_inicio <= ?) OR (hora_fin <= ? AND hora_inicio >= ?))`;
const selectOcupacionCanchaById = `SELECT oc.id_ocupacion_cancha AS id, DATE_FORMAT(oc.fecha, '%Y-%m-%d') AS fecha, CASE DAYOFWEEK(oc.fecha) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, oc.hora_inicio, oc.hora_fin, JSON_OBJECT('id', toc.id_tipo_ocupacion, 'tipo', toc.tipo_ocupacion) AS ocupacion, JSON_OBJECT('id', can.id_cancha, 'nombre', can.nombre) AS cancha FROM ocupaciones_cancha oc LEFT JOIN tipos_de_ocupaciones toc ON oc.id_tipo_ocupacion = toc.id_tipo_ocupacion LEFT JOIN canchas can ON oc.id_cancha = can.id_cancha WHERE oc.id_ocupacion_cancha = ?`;
const selectOcupacionesCanchasByFecha = `SELECT oc.id_ocupacion_cancha AS id, DATE_FORMAT(oc.fecha, '%Y-%m-%d') AS fecha, CASE DAYOFWEEK(oc.fecha) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, oc.hora_inicio, oc.hora_fin, JSON_OBJECT('id', toc.id_tipo_ocupacion, 'tipo', toc.tipo_ocupacion) AS ocupacion, JSON_OBJECT('id', can.id_cancha, 'nombre', can.nombre) AS cancha FROM ocupaciones_cancha oc LEFT JOIN tipos_de_ocupaciones toc ON oc.id_tipo_ocupacion = toc.id_tipo_ocupacion LEFT JOIN canchas can ON oc.id_cancha = can.id_cancha WHERE oc.fecha = ?`;
const selectOcupacionesCanchasByTipoOcupacionId = `SELECT oc.id_ocupacion_cancha AS id, DATE_FORMAT(oc.fecha, '%Y-%m-%d') AS fecha, CASE DAYOFWEEK(oc.fecha) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, oc.hora_inicio, oc.hora_fin, JSON_OBJECT('id', toc.id_tipo_ocupacion, 'tipo', toc.tipo_ocupacion) AS ocupacion, JSON_OBJECT('id', can.id_cancha, 'nombre', can.nombre) AS cancha FROM ocupaciones_cancha oc LEFT JOIN tipos_de_ocupaciones toc ON oc.id_tipo_ocupacion = toc.id_tipo_ocupacion LEFT JOIN canchas can ON oc.id_cancha = can.id_cancha WHERE oc.id_tipo_ocupacion = ?`;
const selectOcupacionesCanchasByCanchaId = `SELECT oc.id_ocupacion_cancha AS id, DATE_FORMAT(oc.fecha, '%Y-%m-%d') AS fecha, CASE DAYOFWEEK(oc.fecha) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, oc.hora_inicio, oc.hora_fin, JSON_OBJECT('id', toc.id_tipo_ocupacion, 'tipo', toc.tipo_ocupacion) AS ocupacion, JSON_OBJECT('id', can.id_cancha, 'nombre', can.nombre) AS cancha FROM ocupaciones_cancha oc LEFT JOIN tipos_de_ocupaciones toc ON oc.id_tipo_ocupacion = toc.id_tipo_ocupacion LEFT JOIN canchas can ON oc.id_cancha = can.id_cancha WHERE oc.id_cancha = ?`;

const selectOcupacionCanchaFechaHoraInicioFin = `SELECT id_ocupacion_cancha AS id, fecha, CASE DAYOFWEEK(oc.fecha) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, hora_inicio, JSON_OBJECT('id', toc.id_tipo_ocupacion, 'tipo', toc.tipo_ocupacion) AS ocupacion, JSON_OBJECT('id', can.id_cancha, 'nombre', can.nombre) AS cancha FROM ocupaciones_cancha oc LEFT JOIN tipos_de_ocupaciones toc ON oc.id_tipo_ocupacion = toc.id_tipo_ocupacion LEFT JOIN canchas can ON oc.id_cancha = can.id_cancha WHERE (id_cancha = ? AND fecha = ? AND hora_fin > ? AND hora_inicio < ? ))`;


const estaOcupada = `SELECT EXISTS (SELECT 1 FROM ocupaciones_cancha WHERE (id_cancha = ? AND fecha = ? AND ((hora_fin >= ? AND hora_inicio <= ?) OR (hora_fin <= ? AND hora_inicio >= ?)))`


// registrar
async function agregarTipoOcupacion(tipo_ocupacion) {
    return await pool.query(insertTipoOcupacion, tipo_ocupacion);
}

async function agregarOcupacionCancha(ocupacion_cancha) {
    return await pool.query(insertOcupacionCancha, ocupacion_cancha);
}

// listar
async function getTiposOcupaciones() {
    try {
        const rows = await pool.query(selectTiposOcupaciones);
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getOcupacionesCanchas() {
    try {
        const rows = await pool.query(selectOcupacionesCanchas);
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// consultar
async function getTipoOcupacionById(id_tipo_ocupacion) {
    try {
        const rows = await pool.query(selectTipoOcupacionById, id_tipo_ocupacion);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getTipoOcupacionByTipo(tipo_ocupacion) {
    try {
        const rows = await pool.query(selectTipoOcupacionByTipo, tipo_ocupacion);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function getOcupacionCanchaById(id_tipo_ocupacion) {
    try {
        const rows = await pool.query(selectOcupacionById, id_tipo_ocupacion);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getOcupacionesCanchasByFecha(fecha) {
    try {
        const rows = await pool.query(selectOcupacionesCanchasByFecha, fecha);
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getOcupacionCanchasByIipoOcupacionId(id_tipo_ocupacion) {
    try {
        const rows = await pool.query(selectOcupacionesCanchasByTipoOcupacionId, id_tipo_ocupacion);
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getOcupacionesCanchaByCanchaId(id_cancha) {
    try {
        const rows = await pool.query(selectOcupacionesCanchasByCanchaId, id_cancha);
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// extra
async function getSuperposicionOcupacionesCanchas(id_cancha, fecha, hora_inicio, hora_fin) {
    try {
        const rows = await pool.query(selectSuperposicionOcupacionesCanchas, [id_cancha, fecha, hora_inicio, hora_inicio, hora_fin, hora_fin]);
        if (rows.length > 0) {
            console.log("encontre")
            return rows;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function existeOcupacionCancha(id_cancha, fecha, hora_inicio, hora_fin) {
    try {
        const resultado = await pool.query(estaOcupada, [id_cancha, fecha, hora_inicio, hora_inicio, hora_fin, hora_fin]);
        return resultado[0];
    } catch (err) {
        console.error(err);
        throw err;
    }
}


export const methods = {
    agregarTipoOcupacion,
    getTiposOcupaciones,
    getTipoOcupacionById,
    getTipoOcupacionByTipo,
    agregarOcupacionCancha,
    getOcupacionesCanchas,
    getOcupacionCanchaById,
    getOcupacionesCanchasByFecha,
    getOcupacionCanchasByIipoOcupacionId,
    getOcupacionesCanchaByCanchaId,
    getSuperposicionOcupacionesCanchas,
    existeOcupacionCancha
}