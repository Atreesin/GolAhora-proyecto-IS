import pool from './databaseConnection.js';

const insertDisponibilidad = 'INSERT INTO disponibilidad SET ?';
const insertDisponibilidadExcepcion = 'INSERT INTO disponibilidad_excepciones SET ?';

const selectDisponibilidad = `SELECT d.id_disponibilidad AS id, d.dia_semana, d.hora_inicio, d.hora_fin, JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) AS cancha FROM disponibilidad d LEFT JOIN canchas c ON d.id_cancha = c.id_cancha`;
const selectDisponibilidadById = `SELECT d.id_disponibilidad AS id, d.dia_semana, d.hora_inicio, d.hora_fin, JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) AS cancha FROM disponibilidad d LEFT JOIN canchas c ON d.id_cancha = c.id_cancha WHERE d.id_disponibilidad = ?`;
const selectDisponibilidadByDiaSemana = `SELECT d.id_disponibilidad AS id, d.dia_semana, d.hora_inicio, d.hora_fin, JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) AS cancha FROM disponibilidad d LEFT JOIN canchas c ON d.id_cancha = c.id_cancha WHERE d.dia_semana = ?`;
const selectDisponibilidadByIdCancha = `SELECT d.id_disponibilidad AS id, d.dia_semana, d.hora_inicio, d.hora_fin, JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) AS cancha FROM disponibilidad d LEFT JOIN canchas c ON d.id_cancha = c.id_cancha WHERE d.id_cancha = ? ORDER BY dia_semana`;
const selectDisponibilidadByDiaSemanaAndIdCancha = `SELECT d.id_disponibilidad AS id, d.dia_semana, d.hora_inicio, d.hora_fin, JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) AS cancha FROM disponibilidad d LEFT JOIN canchas c ON d.id_cancha = c.id_cancha WHERE d.dia_semana = ? AND d.id_cancha = ?`;



const selectDisponibilidadExcepciones = `SELECT de.id_disponibilidad AS id, de.motivo, DATE_FORMAT(de.dia, '%Y-%m-%d') AS dia,  CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, CASE WHEN de.id_cancha IS NULL THEN JSON_OBJECT('id', 'TODAS') ELSE JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) END AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha`;
const selectDisponibilidadExcepcionById = `SELECT de.id_disponibilidad AS id, de.motivo, DATE_FORMAT(de.dia, '%Y-%m-%d') AS dia,  CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, CASE WHEN de.id_cancha IS NULL THEN JSON_OBJECT('id', 'TODAS') ELSE JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) END AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha WHERE de.id_disponibilidad = ?`;
const selectDisponibilidadExcepcionByCanchaId = `SELECT de.id_disponibilidad AS id, de.motivo, DATE_FORMAT(de.dia, '%Y-%m-%d') AS dia,  CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, CASE WHEN de.id_cancha IS NULL THEN JSON_OBJECT('id', 'TODAS') ELSE JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) END AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha WHERE de.id_cancha = ? OR de.id_cancha= 0`;
const selectDisponibilidadExcepcionByMotivo = `SELECT de.id_disponibilidad AS id, de.motivo, DATE_FORMAT(de.dia, '%Y-%m-%d') AS dia,  CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, CASE WHEN de.id_cancha IS NULL THEN JSON_OBJECT('id', 'TODAS') ELSE JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) END AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha WHERE de.motivo = ?`;
const selectDisponibilidadExcepcionByFecha = `SELECT de.id_disponibilidad AS id, de.motivo, DATE_FORMAT(de.dia, '%Y-%m-%d') AS dia,  CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, CASE WHEN de.id_cancha IS NULL THEN JSON_OBJECT('id', 'TODAS') ELSE JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) END AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha WHERE de.id_dia = ?`;
const selectNoDisponibles = `SELECT de.id_disponibilidad AS id, de.motivo, DATE_FORMAT(de.dia, '%Y-%m-%d') AS dia,  CASE DAYOFWEEK(de.dia) WHEN 1 THEN 'Domingo' WHEN 2 THEN 'Lunes' WHEN 3 THEN 'Martes' WHEN 3 THEN 'Miércoles' WHEN 4 THEN 'Jueves' WHEN 5 THEN 'Viernes' WHEN 7 THEN 'Sábado' END AS dia_semana, de.hora_inicio, de.hora_fin, CASE WHEN de.id_cancha IS NULL THEN JSON_OBJECT('id', 'TODAS') ELSE JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) END AS cancha, de.cerrado FROM disponibilidad_excepciones de LEFT JOIN canchas c ON de.id_cancha = c.id_cancha WHERE de.cerrado`;
//CASE WHEN de.id_cancha IS NULL THEN JSON_OBJECT('id', 'TODAS') ELSE JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) END AS cancha

const selectDisponibilidadRealByFechaAndIdCancha = `SELECT  IF(de.id_disponibilidad IS NULL or de.dia != ? , 'Horario habitual', de.motivo) AS motivo, d.dia_semana, IF(de.id_disponibilidad IS NULL or de.dia != ? , d.hora_inicio, de.hora_inicio) AS hora_inicio, IF(de.id_disponibilidad IS NULL or de.dia != ? , d.hora_fin, de.hora_fin) AS hora_fin, CASE WHEN de.id_cancha IS NULL  and de.dia = ? THEN JSON_OBJECT('id', 'TODAS') ELSE JSON_OBJECT('id', c.id_cancha, 'nombre', c.nombre) END AS cancha, IF(de.cerrado IS NULL or de.dia != ? , 'Abierto', IF(de.cerrado, 'Cerrado', 'Abierto (Horario especial)') ) AS estado,  DATE_FORMAT(IF(de.ID_disponibilidad IS NULL OR de.dia != ? , ? , de.dia), '%Y-%m-%d')  AS fecha FROM disponibilidad d LEFT JOIN disponibilidad_excepciones de ON DAYOFWEEK(de.dia)-1 = d.dia_semana AND de.dia = ?  LEFT JOIN canchas c ON d.id_cancha = c.id_cancha WHERE ((d.id_cancha = ? ) AND (d.dia_semana = DAYOFWEEK(?)-1))`
//IF(de.id_disponibilidad IS NULL OR de.dia != ? , d.id_disponibilidad, de.id_disponibilidad) AS id
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

async function getDisponibilidadReal(fecha, id_cancha) {
    try {
        const rows = await pool.query(selectDisponibilidadRealByFechaAndIdCancha, [fecha, fecha, fecha, fecha, fecha, fecha, fecha, fecha, id_cancha, fecha, fecha]);
        if (rows.length > 0) {
            const dispFiltradas = rows.filter(r => r.cancha.id !== 'TODAS')
            return dispFiltradas[0];
        } else {
            
            return rows;
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