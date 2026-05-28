import pool from "./databaseConnection.js";

const insertTipoCancha = `INSERT INTO tipos_de_cancha SET ?`;
const insertCancha = `INSERT INTO canchas SET ?`;

const selectTipoCanchas = `SELECT tc.id_tipo_de_cancha AS id, tc.tipo_cancha AS tipo, tc.duracion_min, tc.duracion_max, tc.ancho, tc.largo, tc.capacidad, JSON_OBJECT('id', s.id_superficie ,'descripcion', s.descripcion) AS superficie, tc.imagen_url FROM tipos_de_cancha tc LEFT JOIN superficies s ON tc.id_superficie = s.id_superficie`
const selectCanchas = `SELECT can.id_cancha AS id, can.nombre, tc.tipo_cancha, tc.ancho, tc.largo, tc.capacidad, JSON_OBJECT('id', s.id_superficie ,'descripcion', s.descripcion) AS superficie, JSON_OBJECT('id', clu.id_club, 'nombre', clu.nombre) AS club FROM canchas can LEFT JOIN tipos_de_cancha tc ON can.id_tipo_de_cancha = tc.id_tipo_de_cancha LEFT JOIN superficies s ON tc.id_superficie = s.id_superficie LEFT JOIN clubes clu ON can.id_club = clu.id_club`
const selectTipoCanchaById = `SELECT tc.id_tipo_de_cancha AS id, tc.tipo_cancha AS tipo, tc.duracion_min, tc.duracion_max, tc.ancho, tc.largo, tc.capacidad, JSON_OBJECT('id', s.id_superficie ,'descripcion', s.descripcion) AS superficie, tc.imagen_url FROM tipos_de_cancha tc LEFT JOIN superficies s ON tc.id_superficie = s.id_superficie WHERE tc.id_tipo_de_cancha = ?`
const selectTipoCanchaByNombre = `SELECT tc.id_tipo_de_cancha AS id, tc.tipo_cancha AS tipo, tc.duracion_min, tc.duracion_max, tc.ancho, tc.largo, tc.capacidad, JSON_OBJECT('id', s.id_superficie ,'descripcion', s.descripcion) AS superficie, tc.imagen_url FROM tipos_de_cancha tc LEFT JOIN superficies s ON tc.id_superficie = s.id_superficie WHERE tc.tipo_cancha = ?`
const selectCanchaById = `SELECT can.id_cancha AS id, can.nombre, tc.tipo_cancha, tc.ancho, tc.largo, tc.capacidad, JSON_OBJECT('id', s.id_superficie ,'descripcion', s.descripcion) AS superficie, JSON_OBJECT('id', clu.id_club, 'nombre', clu.nombre) AS club FROM canchas can LEFT JOIN tipos_de_cancha tc ON can.id_tipo_de_cancha = tc.id_tipo_de_cancha LEFT JOIN superficies s ON tc.id_superficie = s.id_superficie LEFT JOIN clubes clu ON can.id_club = clu.id_club WHERE can.id_cancha = ?`
const selectCanchaByNombreAndClubId = `SELECT can.id_cancha AS id, can.nombre, tc.tipo_cancha, tc.ancho, tc.largo, tc.capacidad, JSON_OBJECT('id', s.id_superficie ,'descripcion', s.descripcion) AS superficie, JSON_OBJECT('id', clu.id_club, 'nombre', clu.nombre) AS club FROM canchas can LEFT JOIN tipos_de_cancha tc ON can.id_tipo_de_cancha = tc.id_tipo_de_cancha LEFT JOIN superficies s ON tc.id_superficie = s.id_superficie LEFT JOIN clubes clu ON can.id_club = clu.id_club WHERE can.id_cancha = ? AND can.id_club = ?`
const selectSuperficies = `SELECT * FROM superficies`;
const selectSuperficieById = `SELECT * FROM superficies WHERE id_superficie = ?`;

async function agregarTipoCancha(tipo_cancha) {
    return await pool.query(insertTipoCancha, tipo_cancha);
}
async function agregarCancha(cancha) {
    return await pool.query(insertCancha, cancha);
}


// consultar
async function getSuperficies() {
    try {
        const rows = await pool.query(selectSuperficies);
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

async function getSuperficieById(id_superficie) {
    try {
        const rows = await pool.query(selectSuperficieById, id_superficie);
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

async function getTipoCanchas() {
    try {
        const rows = await pool.query(selectTipoCanchas);
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

async function getCanchas() {
    try {
        const rows = await pool.query(selectCanchas);
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

async function getTipoCanchaById(id_tipo_de_cancha) {
    try {
        const rows = await pool.query(selectTipoCanchaById, id_tipo_de_cancha);
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



async function getTipoCanchaByNombre(nombre) {
    try {
        const rows = await pool.query(selectTipoCanchaByNombreAndClubId, nombre);
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

async function getCanchaById(id_cancha) {
    try {
        const rows = await pool.query(selectCanchaById, id_cancha);
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

async function getCanchaByNombreAndClubId(id_cancha, id_club) {
    try {
        const rows = await pool.query(selectCanchaByNombreAndClubId, [id_cancha, id_club]);
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


export const methods = {
    agregarTipoCancha,
    agregarCancha,
    getSuperficies,
    getSuperficieById,
    getTipoCanchas,
    getTipoCanchaById,
    getTipoCanchaByNombre,
    getCanchas,
    getCanchaById,
}