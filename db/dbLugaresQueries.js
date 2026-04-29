import pool from "./databaseConnection.js"

//registrar pais, provincia, ciudad, localidad
const insertPais = 'INSERT INTO paises SET ?';
const insertProvincia = 'INSERT INTO provincias SET ?';
const insertCiudad = 'INSERT INTO ciudades SET ?';
const insertLocalidad = 'INSERT INTO localidades SET ?';

//consultar datos de usuario
const selectNombrePaises = 'SELECT nombre FROM paises ORDER BY nombre ASC';
const selectNombreProvincias = 'SELECT nombre FROM provincias ORDER BY nombre ASC';
const selectNombreCiudades = 'SELECT nombre FROM ciudades ORDER BY nombre ASC';
const selectNombreLocalidades = 'SELECT nombre FROM localidades ORDER BY nombre ASC';
const selectPaises = 'SELECT * FROM paises ORDER BY nombre ASC';
const selectProvincias = 'SELECT * FROM provincias ORDER BY nombre ASC';
const selectCiudades = 'SELECT * FROM ciudades ORDER BY nombre ASC';
const selectLocalidades = 'SELECT * FROM localidades ORDER BY nombre ASC';

const selectPaisByNombre = 'SELECT * FROM paises WHERE nombre = ?';
const selectProvinciaByNombre = 'SELECT * FROM provincias WHERE nombre = ?';
const selectProvinciaByNombreYIdPais = 'SELECT * FROM provincias WHERE nombre = ? and id_pais = ?';
const selectCiudadByNombre = 'SELECT * FROM ciudades WHERE nombre = ?';
const selectCiudadByNombreYIdProvincia = 'SELECT * FROM ciudades WHERE nombre = ? and id_provincia = ?'
const selectLocalidadByNombre = 'SELECT * FROM localidades WHERE nombre = ?';
const selectLocalidadByNombreYIdCiudad = 'SELECT * FROM localidades WHERE nombre = ? and id_ciudad = ?';

const selectProvinciasByPais = 'SELECT pr.id_provincia, pr.nombre, pa.nombre AS pais FROM provincias pr LEFT JOIN paises pa ON pr.id_pais = pa.id_pais WHERE pa.nombre = ?';
const selectCiudadesByProvincia = 'SELECT c.id_ciudad, c.nombre, p.nombre AS provincia FROM ciudades c LEFT JOIN provincias p ON c.id_provincia = p.id_provincia WHERE p.nombre = ?';
const selectLocalidadesByLocalidad = 'SELECT l.id_localidad, l.nombre, c.nombre ciudad AS  FROM localidades l LEFT JOIN ciudades c ON l.id_ciudad = c.id_ciudad WHERE c.nombre = ?';

//registrar
async function agregarPais(pais) {
    await pool.query(insertPais, pais);
};
async function agregarProvincia(provincia) {
    await pool.query(insertProvincia, provincia);
};
async function agregarCiudad(ciudad) {
    await pool.query(insertCiudad, ciudad);
};
async function agregarLocalidad(localidad) {
    await pool.query(insertLocalidad, localidad);
};

//consultar
async function getPaises() {
    try {
        const rows = await pool.query(selectPaises);
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

async function getNombrePaises() {
    try {
        const rows = await pool.query(selectNombrePaises);
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

async function getNombreProvincias() {
    try {
        const rows = await pool.query(selectNombreProvincias);
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

async function getNombreCiudades() {
    try {
        const rows = await pool.query(selectNombreCiudades);
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

async function getNombreLocalidades() {
    try {
        const rows = await pool.query(selectNombreLocalidades);
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

async function getProvincias() {
    try {
        const rows = await pool.query(selectProvincias, []);
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

async function getCiudades() {
    try {
        const rows = await pool.query(selectCiudades, []);
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

async function getLocalidades() {
    try {
        const rows = await pool.query(selectLocalidades, []);
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


async function getPaisPorNombre(pais) {
    try {
        const rows = await pool.query(selectPaisByNombre, [pais]);
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

async function getProvinciaPorNombre(provincia) {
    try {
        const rows = await pool.query(selectProvinciaByNombre, [provincia]);
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

async function getProvinciaPorNombreYIdPais(provincia, id_pais) {
    try {
        const rows = await pool.query(selectProvinciaByNombreYIdPais, [provincia, id_pais]);
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

async function getCiudadPorNombre(ciudad) {
    try {
        const rows = await pool.query(selectCiudadByNombre, [ciudad]);
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

async function getCiudadPorNombreYIdProvincia(ciudad,id_provincia) {
    try {
        const rows = await pool.query(selectCiudadByNombreYIdProvincia, [ciudad, id_provincia]);
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

async function getLocalidadPorNombre(localidad) {
    try {
        const rows = await pool.query(selectLocalidadByNombre, [localidad]);
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

async function getLocalidadPorNombreYIdCiudad(localidad, id_ciudad) {
    try {
        const rows = await pool.query(selectLocalidadByNombreYIdCiudad, [localidad, id_ciudad]);
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
    agregarPais,
    agregarProvincia,
    agregarCiudad,
    agregarLocalidad,
    getNombrePaises,
    getNombreProvincias,
    getNombreCiudades,
    getNombreLocalidades,
    getPaises,
    getProvincias,
    getCiudades,
    getLocalidades,
    getPaisPorNombre,
    getProvinciaPorNombre,
    getProvinciaPorNombreYIdPais,
    getCiudadPorNombre,
    getCiudadPorNombreYIdProvincia,
    getLocalidadPorNombre,
    getLocalidadPorNombreYIdCiudad
}