import pool from "./databaseConnection.js"


//registro
const insertClub = 'INSERT INTO clubes SET ?';

//consulta
const selectClubes = 'SELECT * FROM clubes';
const selectClubById = 'SELECT * FROM clubes WHERE id_club = ?';

//modificar
const updateNombreClubById = 'UPDATE nombre FROM clubes WHERE id_club = ?';



//registrar
async function agregarClub(club) {
    await pool.query(insertClub, club);
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

export const methods = {
    agregarClub,
    getClubes,
    getClubById
}