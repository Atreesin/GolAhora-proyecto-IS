import pool from "./databaseConnection.js"


//registro
const insertClub = 'INSERT INTO clubes SET ?';

//consulta
const selectFullInfoClubes = 'SELECT c.id_club as id, c.nombre, c.CUIT, c.num_telefonico as telefono, c.email,  JSON_OBJECT("id", d.id_direccion, "calle", d.calle, "numero", d.numero, "cp", d.codigo_postal, "localidad", l.nombre, "ciudad", ci.nombre, "provincia", pr.nombre, "pais", pa.nombre) AS direccion FROM clubes c LEFT JOIN direcciones d ON c.id_direccion = d.id_direccion LEFT JOIN localidades l ON d.id_localidad = l.id_localidad LEFT JOIN ciudades ci ON l.id_ciudad = ci.id_ciudad LEFT JOIN provincias pr ON ci.id_provincia = pr.id_provincia LEFT JOIN paises pa ON pr.id_pais = pa.id_pais';
const selectClubes = 'SELECT c.id_club as id, c.nombre, c.CUIT FROM clubes c';
const selectClubById = 'SELECT c.id_club as id, c.nombre, c.CUIT FROM clubes c WHERE c.id_club = ?';
const selectFullInfoClubById = 'SELECT c.id_club as id, c.nombre, c.CUIT, c.num_telefonico as telefono, c.email,  JSON_OBJECT("id", d.id_direccion, "calle", d.calle, "numero", d.numero, "cp", d.codigo_postal, "localidad", l.nombre, "ciudad", ci.nombre, "provincia", pr.nombre, "pais", pa.nombre) AS direccion FROM clubes c LEFT JOIN direcciones d ON c.id_direccion = d.id_direccion LEFT JOIN localidades l ON d.id_localidad = l.id_localidad LEFT JOIN ciudades ci ON l.id_ciudad = ci.id_ciudad LEFT JOIN provincias pr ON ci.id_provincia = pr.id_provincia LEFT JOIN paises pa ON pr.id_pais = pa.id_pais WHERE c.id_club = ?';
//modificar
const updateNombreClubById = 'UPDATE nombre FROM clubes WHERE id_club = ?';



//registrar
async function agregarClub(club) {
    return await pool.query(insertClub, club);
};


//consultas
async function getClubes() {
    try {
        const rows = await pool.query(selectClubes);
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};
async function getFullInfoClubes() {
    try {
        const rows = await pool.query(selectFullInfoClubes);
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getClubById(id) {
    try {
        const rows = await pool.query(selectClubById, id);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getFullInfoClubById(id) {
    try {
        const rows = await pool.query(selectFullInfoClubById, id);
        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const methods = {
    agregarClub,
    getClubes,
    getFullInfoClubes,
    getClubById,
    getFullInfoClubById
}