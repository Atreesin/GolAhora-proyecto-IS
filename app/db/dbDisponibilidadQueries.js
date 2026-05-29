import pool from "./databaseConnection.js";

const insertDisponibilidad = 'INSERT INTO disponibilidad SET ?';
const insertDisponibilidadExcepcion = 'INSERT INTO disponibilidad_excepciones SET ?';

const selectDisponibilidad = `SELECT d.id_disponibilidad AS id, d.dia_semana, d.hora_inicio, d.hora_fin, JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) AS cancha FROM disponibilidad d LEFT JOIN canchas c ON d.id_cancha = c.id_cancha`;
const selectDisponibilidadById = `SELECT d.id_disponibilidad AS id, d.dia_semana, d.hora_inicio, d.hora_fin, JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) AS cancha FROM disponibilidad d LEFT JOIN canchas c ON d.id_cancha = c.id_cancha WHERE d.id_disponibilidad = ?`;
const selectDisponibilidadByDiaSemana = `SELECT d.id_disponibilidad AS id, d.dia_semana, d.hora_inicio, d.hora_fin, JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) AS cancha FROM disponibilidad d LEFT JOIN canchas c ON d.id_cancha = c.id_cancha WHERE d.dia_semana = ?`;
const selectDisponibilidadByIdCancha = `SELECT d.id_disponibilidad AS id, d.dia_semana, d.hora_inicio, d.hora_fin, JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) AS cancha FROM disponibilidad d LEFT JOIN canchas c ON d.id_cancha = c.id_cancha WHERE d.id_cancha = ? ORDER BY dia_semana`;
const selectDisponibilidadByDiaSemanaAndIdCancha = `SELECT d.id_disponibilidad AS id, d.dia_semana, d.hora_inicio, d.hora_fin, JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) AS cancha FROM disponibilidad d LEFT JOIN canchas c ON d.id_cancha = c.id_cancha WHERE d.dia_semana = ? AND d.id_cancha = ?`;



const selectDisponibilidadExcepciones = `SELECT de.id_disponibilidad AS id, de.motivo, de.dia, CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, IF(de.id_cancha = 0, 'TODAS', JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre)) AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha`;
const selectDisponibilidadExcepcionById = `SELECT de.id_disponibilidad AS id, de.motivo, de.dia, CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, IF(de.id_cancha = 0, 'TODAS', JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre)) AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha WHERE de.id_disponibilidad = ?`;
const selectDisponibilidadExcepcionByCanchaId = `SELECT de.id_disponibilidad AS id, de.motivo, de.dia, CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, IF(de.id_cancha = 0, 'TODAS', JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre)) AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha WHERE de.id_cancha = ? OR de.id_cancha= 0`;
const selectDisponibilidadExcepcionByMotivo = `SELECT de.id_disponibilidad AS id, de.motivo, de.dia, CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, IF(de.id_cancha = 0, 'TODAS', JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre)) AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha WHERE de.motivo = ?`;
const selectDisponibilidadExcepcionByFecha = `SELECT de.id_disponibilidad AS id, de.motivo, de.dia, CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, IF(de.id_cancha = 0, 'TODAS', JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre)) AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha WHERE de.id_dia = ?`;
const selectNoDisponibles = `SELECT de.id_disponibilidad AS id, de.motivo, de.dia, CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, IF(de.id_cancha = 0, 'TODAS', JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre)) AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha WHERE de.cerrado`;


const selectDisponibilidadRealByFechaAndIdCanchaAndDiaSemana =  `SELECT IF(de.id_disponibilidad IS NULL, d.id_disponibilidad, de.id_disponibilidad) AS id, IF(de.id_disponibilidad IS NULL, 'NORMAL', de.motivo) AS tipo_disponibilidad, d.dia_semana, IF(de.id_disponibilidad IS NULL, d.hora_inicio, de.hora_inicio) AS hora_inicio, IF(de.id_disponibilidad IS NULL, d.hora_fin, de.hora_fin) AS hora_fin, JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) AS cancha, de.cerrado FROM disponibilidad d LEFT JOIN disponibilidad_excepciones de ON (d.id_cancha = de.id_cancha OR de.id_cancha = 0) AND de.dia = ? LEFT JOIN canchas c ON d.id_cancha = c.id_cancha WHERE (d.id_cancha = ? AND d.dia_semana = ?) AND (SELECT EXIST (SELECT 1 FROM disponibilidad_excepciones dex WHERE (dex.id_cancha = d.id_cancha OR dex.id_cancha = 0) AND dex.cerrado AND dex.dia = ?))`;
const estaCerradoByIdCanchaFecha = `SELECT EXISTS (SELECT 1 FROM disponibilidad_excepciones WHERE (id_cancha = ? or id_cancha = 0) AND dia = ? AND cerrado)`;

// registrar
async function agregarDisponibilidad(disponibilidad) {
    return await pool.query(insertDisponibilidad, disponibilidad);
}

async function agregarDisponibilidadExcepcion(disponibilidad_excepciones) {
    return await pool.query(insertDisponibilidadExcepcion, disponibilidad_excepciones);
}

// listar
async function getDisponibilidades() {
    try {
        const rows = await pool.query(selectDisponibilidad);
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

async function getDisponibilidadesExcepciones() {
    try {
        const rows = await pool.query(selectDisponibilidadExcepciones);
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

async function getNoDisponibles() {
    try {
        const rows = await pool.query(selectNoDisponibles);
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
async function getDisponibilidadById(id_disponibilidad) {
    try {
        const rows = await pool.query(selectDisponibilidadById, id_disponibilidad);
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

async function getDisponibilidadByDiaSemana(dia_semana) {
    try {
        const rows = await pool.query(selectDisponibilidadByDiaSemana, dia_semana);
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

async function getDisponibilidadByIdCancha(id_cancha) {
    try {
        const rows = await pool.query(selectDisponibilidadByIdCancha, id_cancha);
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

async function getDisponibilidadByDiaSemanaAndIdCancha(dia_semana, id_cancha) {
    try {
        const rows = await pool.query(selectDisponibilidadByDiaSemanaAndIdCancha, [dia_semana, id_cancha]);
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



async function getDisponibilidadExcepcionById(id_disponibilidad) {
    try {
        const rows = await pool.query(selectDisponibilidadExcepcionById, id_disponibilidad);
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

async function getDisponibilidadExcepcionByCanchaId(id_cancha) {
    try {
        const rows = await pool.query(selectDisponibilidadExcepcionByCanchaId, id_cancha);
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

async function getDisponibilidadExcepcionByMotivo(motivo) {
    try {
        const rows = await pool.query(selectDisponibilidadExcepcionByMotivo, motivo);
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

async function getDisponibilidadExcepcionFecha(fecha) {
    try {
        const rows = await pool.query(selectDisponibilidadExcepcionByFecha, fecha);
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

async function getDisponibilidadReal(fecha, id_cancha, dia_semana) {
    try {
        const rows = await pool.query(selectDisponibilidadRealByFechaAndIdCanchaAndDiaSemana, tipo_ocupacion);
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
async function estaCerradoIdCanchaFecha(id_cancha, fecha) {
    try {
        const rows = await pool.query(estaCerradoByIdCanchaFecha, [id_cancha, fecha]);
        return rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const methods = {
    agregarDisponibilidad,
    agregarDisponibilidadExcepcion,
    getDisponibilidades,
    getDisponibilidadesExcepciones,
    getNoDisponibles,
    getDisponibilidadById,
    getDisponibilidadExcepcionById,
    getDisponibilidadByDiaSemana,
    getDisponibilidadByIdCancha,
    getDisponibilidadByDiaSemanaAndIdCancha,
    getDisponibilidadExcepcionByCanchaId,
    getDisponibilidadExcepcionByMotivo,
    getDisponibilidadExcepcionFecha,
    getDisponibilidadReal,
    estaCerradoIdCanchaFecha,
    
}