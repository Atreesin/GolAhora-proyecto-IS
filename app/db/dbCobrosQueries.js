import pool from './databaseConnection.js';

const insertCobro = 'INSERT INTO cobros SET ?';

const selectEstadosCobros = `SELECT id_estado_cobro AS id, estado FROM cobros`;
const selectEstadosCobrosById = `SELECT id_estado_cobro AS id, estado FROM cobros WHERE id_estado_cobro ?`;
const selectCobros = `SELECT co.id_cobro AS id, DATE_FORMAT(co.fecha, '%Y-%m-%d') AS fecha, co.link_pago, co.monto, co.porcentaje_descuento, co.detalles, JSON_OBJECT('id', c.id_club,'nombre', c.nombre)AS club, JSON_OBJECT('id', u.id_usuario, 'nombre', u.nombre, 'apellido', u.apellido, 'dni', u.dni, 'email', u.email, 'telefono', u.telefono) AS cliente, ec.estado, mp.nombre AS metodo_pago FROM cobros co LEFT JOIN clubes c ON c.id_club = co.id_club LEFT JOIN usuarios U ON id_usuario = id_usuario LEFT JOIN estados_cobro ec ON ec.id_estado_cobro = co.id_estado_cobro LEFT JOIN metodos_de_pago mp ON mp.id_metodo_de_pago = co.id_metodo_de_pago`;
const selectMetodosDePago = `SELECT id_metodo_de_pago AS id, nombre FROM metodos_de_pago`;
const selectMetodosDePagoById = `SELECT id_metodo_de_pago AS id, nombre FROM metodos_de_pago WHERE id_metodo_de_pago = ?`;



async function registrarCobro(cobro) {
    return await pool.query(insertCobro, cobro);
}

async function getCobros() {
    try {
        const rows = await pool.query(selectCobros);
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

async function getEstadosCobros() {
    try {
        const rows = await pool.query(selectEstadosCobros);
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

async function getEstadosCobrosById(id_estado_cobro) {
    try {
        const rows = await pool.query(selectEstadosCobrosById, id_estado_cobro);
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

async function getMetodosDePago() {
    try {
        const rows = await pool.query(selectMetodosDePago);
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
async function getMetdosDePagoById(id_metodo_de_pago) {
    try {
        const rows = await pool.query(selectMetodosDePagoById, id_metodo_de_pago);
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
    registrarCobro,
    getCobros,
    getEstadosCobros,
    getEstadosCobrosById,
    getMetodosDePago,
    getMetdosDePagoById
}