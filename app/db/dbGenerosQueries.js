import pool from "./databaseConnection.js"

//registrar generos
const insertGenero = 'INSERT INTO generos SET ?';

//consultar generos
const selectGeneros = 'SELECT * FROM generos';
const selectGeneroById = 'SELECT genero FROM generos where id_genero = ?';
const selectIdGeneroByGenero = 'SELECT id_genero FROM generos where genero = ?';


async function agregarGenero(genero) {
    await pool.query(insertGenero, genero);
}
 
async function getGeneros() {
    try {
        const rows = await pool.query(selectGeneros, []);
        if (rows.length > 0) {
            return rows; // Devuelve todos los generos
        } else {
            return null; // Usuario no encontrado
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getGeneroById(id) {
    try {
        const rows = await pool.query(selectGeneroById, [id]);
            if (rows.length > 0) {
                return rows[0].genero;
            } else {
                return null;
            }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getIdGeneroByGenero(genero){
    try {
        const rows = await pool.query(selectIdGeneroByGenero, [genero]);
            if (rows.length > 0) {
                return rows[0].id_genero;
            } else {
                return null;
            }
    } catch (err) {
        console.error(err);
        throw err;
    }
};


export const methods = {
    agregarGenero,
    getGeneroById,
    getIdGeneroByGenero
};