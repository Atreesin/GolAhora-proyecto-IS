import pool from "./databaseConnection.js";
import { methods as helper } from "../helpers/utilsHelper.js";
//registrar usuario
const insertUser = 'INSERT INTO usuarios SET ?';
//registrar direccion de usuario
const insertDireccion = 'INSERT INTO direcciones SET ?';
//modificar datos de usuario
const updateUser = 'UPDATE usuarios SET username = ?, nombre = ?, apellido = ?, email = ?, fecha_nacimiento = ?, dni = ?, telefono = ?, id_genero = ?, id_nacionalidad AS nacionalidad = ? WHERE id_usuario = ?';
const updateUsername = 'UPDATE usuarios SET username = ? WHERE id_usuario = ?';
const updateUserNombre = 'UPDATE usuarios SET nombre = ? WHERE id_usuario = ?';
const updateUserApellido = 'UPDATE usuarios SET apellido = ? WHERE id_usuario = ?';
const updateUserNacionalidad = 'UPDATE usuarios SET id_nacionalidad = ? WHERE id_usuario = ?';
const updateUserDni = 'UPDATE usuarios SET dni = ? WHERE id_usuario = ?';
const updateUserGenero = 'UPDATE usuarios SET id_genero = ? WHERE id_usuario = ?';
const updateUserFechaNacimiento = 'UPDATE usuarios SET fecha_nacimiento = ? WHERE id_usuario ?'
const updateUserTelefono = 'UPDATE usuarios SET telefono = ? WHERE id_usuario = ?';
const updateUserEmail = 'UPDATE usuarios SET email = ? WHERE id_usuario = ?';
const updateUserPassword = 'UPDATE usuarios SET password = ? WHERE id = ?';
const updateUserUserLevel = 'UPDATE usuarios SET user_level = ? WHERE id_usuario = ?';
const updateUserDireccion = 'UPDATE direcciones d SET d.calle = ?, d.numero = ?, d.codigo_postal = ?, d.id_localidad = ? WHERE d.id_direccion = (SELECT u.id_direccion FROM usuarios u WHERE u.id_usuario = ?)';
const updateUserDireccionOpcional = 'UPDATE direcciones d SET d.calle = ?, d.numero = ?, d.codigo_postal = ?, d.id_localidad = ? WHERE d.id_direccion = (SELECT u.id_direccion_opcional FROM usuarios u WHERE u.id_usuario = ?)';
const updateUserClub = 'UPDATE usuarios SET id_club = ? WHERE id_usuario = ?';

//modificar direccion de usuario
const updateDireccion = 'UPDATE direcciones SET calle = ?, numero = ?, codigo_postal = ?, id_localidad = ? WHERE id_direccion = ?';
const updateCalle = 'UPDATE direcciones SET calle = ? WHERE id_direccion = ?';
const updateNumero = 'UPDATE direcciones SET numero = ? WHERE id_direccion = ?';
const updateCodigoPostal = 'UPDATE direcciones SET codigo_postal = ? WHERE id_direccion = ?';
const updateLocalidad = 'UPDATE direcciones SET localidad = ? WHERE id_direccion = ?';

//consultar usuarios
const selectUserByEmailOrDni = 'SELECT u.id_usuario, u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.genero, u.fecha_nacimiento, u.telefono, u.email, u.user_level, c.nombre AS club FROM usuarios u LEFT JOIN paises n ON u.id_nacionalidad = n.id_pais LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN clubes c ON c.id_club = u.id_club WHERE u.email = ? or u.dni = ?';
const selectCantidadUsuarios = 'SELECT COUNT(*) AS total_usuarios FROM usuarios';
const selectUserIdByEmail = 'SELECT id_usuario FROM usuarios WHERE email = ?';
const selectUsersByGenero = 'SELECT u.id_usuario, u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.genero, u.telefono, u.email, c.nombre AS club FROM usuarios u LEFT JOIN paises n ON u.id_nacionalidad = n.id_pais LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN clubes c ON c.id_club = u.id_club WHERE g.nombre = ? ORDER BY apellido ASC, nombre ASC, dni ASC';
const selectUsersByNacionalidad = 'SELECT u.id_usuario, u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.genero, u.telefono, u.email, c.nombre AS club  FROM usuarios u LEFT JOIN paises n ON u.id_nacionalidad = n.id_pais LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN clubes c ON c.id_club = u.id_club WHERE n.nombre = ? ORDER BY apellido ASC, nombre ASC, dni ASC';
const selectAllUsers = 'SELECT u.id_usuario, u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.genero, u.telefono, u.email, u.user_level, c.nombre AS club  FROM usuarios u LEFT JOIN paises n ON u.id_nacionalidad = n.id_pais LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN clubes c ON c.id_club = u.id_club ORDER BY username ASC, apellido ASC, nombre ASC, dni ASC';
const selectAllUsersLimit = 'SELECT u.id_usuario, u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.genero, u.telefono, u.email, c.nombre AS club  FROM usuarios u LEFT JOIN paises n ON u.id_nacionalidad = n.id_pais LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN clubes c ON c.id_club = u.id_club ORDER BY apellido ASC, nombre ASC, dni ASC LIMIT ? OFFSET ?';
const selectUsersByLevelLimit = 'SELECT u.id_usuario, u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.genero, u.telefono, u.email, c.nombre AS club  FROM usuarios u LEFT JOIN paises n ON u.id_nacionalidad = n.id_pais LEFT JOIN generos g ON u.genero = g.id_genero LEFT JOIN clubes c ON c.id_club = u.id_club WHERE u.user_level = ? ORDER BY apellido ASC, nombre ASC, dni ASC LIMIT ? OFFSET ?';
const selectAllUserByLevel = 'SELECT u.id_usuario, u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.genero, u.telefono, u.email, u.user_level, c.nombre AS club  FROM usuarios u LEFT JOIN paises n ON u.id_nacionalidad = n.id_pais LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN clubes c ON c.id_club = u.id_club WHERE user_level = ? ORDER BY apellido ASC, nombre ASC, dni ASC';
const selectUserById = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.genero, u.fecha_nacimiento, u.telefono, u.email, u.user_level, c.nombre AS club FROM usuarios u LEFT JOIN paises n ON u.id_nacionalidad = n.id_pais LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN clubes c ON c.id_club = u.id_club WHERE id_usuario = ?';
const selectUserByEmail = 'SELECT u.id_usuario, u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.genero, u.fecha_nacimiento, u.telefono, u.email, u.user_level, c.nombre AS club FROM usuarios u LEFT JOIN paises n ON u.id_nacionalidad = n.id_pais LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN clubes c ON c.id_club = u.id_club WHERE u.email = ?';
const selectUserLoginOptionByEmail = 'SELECT u.username, u.password, u.user_level, c.nombre AS club FROM usuarios u LEFT JOIN clubes c ON c.id_club = u.id_club WHERE u.email = ?';
const selectUserLoginOptionByUsername = 'SELECT u.username, u.password, u.user_level, c.nombre AS club FROM usuarios u LEFT JOIN clubes c ON c.id_club = u.id_club WHERE u.username = ?';

const selectFullUserById = 'SELECT u.username, u.nombre, u.apellido, u.dni, n.nombre AS nacionalidad, g.genero, u.fecha_nacimiento, u.email, u.telefono, u.fecha_registro, d.calle, d.numero, d.codigo_postal, l.nombre AS localidad, ci.nombre AS ciudad, pr.nombre AS provincia, pa.nombre AS pais, c.nombre AS club, u.user_level, u.fecha_registro FROM usuarios u LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN paises n ON n.id_pais = u.id_nacionalidad LEFT JOIN direcciones d ON u.id_direccion = d.id_direccion LEFT JOIN localidades l ON d.id_localidad = l.id_localidad LEFT JOIN ciudades ci ON ci.id_ciudad = l.id_ciudad LEFT JOIN provincias pr ON pr.id_provincia = ci.id_provincia LEFT JOIN paises pa ON pa.id_pais = pr.id_pais JOIN clubes c ON c.id_club = u.id_club WHERE u.id_usuario = ?';
const selectFullUserByEmail = 'SELECT u.id_usuario, u.username, u.nombre, u.apellido, u.dni, n.nombre AS nacionalidad, g.genero, u.fecha_nacimiento, u.email, u.telefono, u.fecha_registro, d.calle, d.numero, d.codigo_postal, l.nombre AS localidad, ci.nombre AS ciudad, pr.nombre AS provincia, pa.nombre AS pais, c.nombre AS club, u.user_level, u.fecha_registro FROM usuarios u LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN paises n ON n.id_pais = u.id_nacionalidad LEFT JOIN direcciones d ON u.id_direccion = d.id_direccion LEFT JOIN localidades l ON d.id_localidad = l.id_localidad LEFT JOIN ciudades ci ON ci.id_ciudad = l.id_ciudad LEFT JOIN provincias pr ON pr.id_provincia = ci.id_provincia LEFT JOIN paises pa ON pa.id_pais = pr.id_pais JOIN clubes c ON c.id_club = u.id_club WHERE u.email = ?';
const selectFullUserByDni = 'SELECT u.id_usuario, u.username, u.nombre, u.apellido, u.dni, n.nombre AS nacionalidad, g.genero, u.fecha_nacimiento, u.email, u.telefono, u.fecha_registro, d.calle, d.numero, d.codigo_postal, l.nombre AS localidad, ci.nombre AS ciudad, pr.nombre AS provincia, pa.nombre AS pais, c.nombre AS club, u.user_level, u.fecha_registro FROM usuarios u LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN paises n ON n.id_pais = u.id_nacionalidad LEFT JOIN direcciones d ON u.id_direccion = d.id_direccion LEFT JOIN localidades l ON d.id_localidad = l.id_localidad LEFT JOIN ciudades ci ON ci.id_ciudad = l.id_ciudad LEFT JOIN provincias pr ON pr.id_provincia = ci.id_provincia LEFT JOIN paises pa ON pa.id_pais = pr.id_pais JOIN clubes c ON c.id_club = u.id_club WHERE u.dni LIKE ? ORDER BY u.apellido, u.nombre';
const selectFullUserByApellido = 'SELECT u.id_usuario, u.username, u.nombre, u.apellido, u.dni, n.nombre AS nacionalidad, g.genero, u.fecha_nacimiento, u.email, u.telefono, u.fecha_registro, d.calle, d.numero, d.codigo_postal, l.nombre AS localidad, ci.nombre AS ciudad, pr.nombre AS provincia, pa.nombre AS pais, c.nombre AS club, u.user_level, u.fecha_registro FROM usuarios u LEFT JOIN generos g ON u.id_genero = g.id_genero LEFT JOIN paises n ON n.id_pais = u.id_nacionalidad LEFT JOIN direcciones d ON u.id_direccion = d.id_direccion LEFT JOIN localidades l ON d.id_localidad = l.id_localidad LEFT JOIN ciudades ci ON ci.id_ciudad = l.id_ciudad LEFT JOIN provincias pr ON pr.id_provincia = ci.id_provincia LEFT JOIN paises pa ON pa.id_pais = pr.id_pais JOIN clubes c ON c.id_club = u.id_club WHERE u.apellido LIKE ? ORDER BY u.apellido, u.nombre';

//consultar direcciones
const selectDireccionByid = 'SELECT d.calle, d.numero, d.codigo_postal, l.nombre AS localidad, ci.nombre AS ciudad, pr.nombre AS provincia, pa.nombre AS pais FROM direcciones d LEFT JOIN localidades l ON d.id_localidad = l.id_localidad LEFT JOIN ciudades ci ON on l.id_ciudad = ci.id_ciudad LEFT JOIN provincias pr ON ci.id_provincia = pr.id_provincia LEFT JOIN paises pa ON pr.id_pais = pa.id_pais WHERE d.id_direccion = ?';
const selectDireccionByUser = 'SELECT d.calle, d.numero, d.codigo_postal, l.nombre AS localidad, ci.nombre AS ciudad, pr.nombre AS provincia, pa.nombre AS pais FROM direcciones d LEFT JOIN localidades l ON d.id_localidad = l.id_localidad LEFT JOIN ciudades l.id_ciudad = ci.id_ciudad LEFT JOIN provincias pr ON ci.id_provincia = pr.id_provincia LEFT JOIN paises pa ON pr.id_pais = pa.id_pais WHERE d.id_direccion = (SELECT u.id_direccion FROM usuarios u WHERE u.id_usuario = ?)';
const selectDireccionOpcionalByUser = 'SELECT d.calle, d.numero, d.codigo_postal, l.nombre AS localidad, ci.nombre AS ciudad, pr.nombre AS provincia, pa.nombre AS pais FROM direcciones d LEFT JOIN localidades l ON d.id_localidad = l.id_localidad LEFT JOIN ciudades l.id_ciudad = ci.id_ciudad LEFT JOIN provincias pr ON ci.id_provincia = pr.id_provincia LEFT JOIN paises pa ON pr.id_pais = pa.id_pais WHERE d.id_direccion = (SELECT u.id_direccion_opcional FROM usuarios u WHERE u.id_usuario = ?)';
//eliminar

//utils
const nextUserId = 'SELECT * FROM usuarios ORDER BY id_usuario DESC LIMIT 1;';


//registrar
async function agregarUsuario(usuario) {
    return await pool.query(insertUser, usuario);
}

async function agregarDireccion(direccion) {
    return await pool.query(insertDireccion, direccion);
}

//consultar
async function getCantidadUsuarios() {
    try {
        const rows = await pool.query(selectCantidadUsuarios);
        if (rows.length > 0) {
            return rows[0].total_usuarios;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getUsuarios() {
    try {
        const rows = await pool.query(selectAllUsers);
        if (rows.length > 0) {
            const usuarios = rows.map(u => ({
                ...u,
                user_level: helper.tipoUsuario(u.user_level) 
            }));
            return usuarios;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getSeccionDeUsuarios(cantidad, desde) {
    try {
        const rows = await pool.query(selectAllUsersLimit, [cantidad, desde]);
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

async function getUsuariosByLevel(user_level) {
    try {
        const rows = await pool.query(selectAllUserByLevel, user_level);
        if (rows.length > 0) {
            const usuarios = rows.map(u => ({
                ...u,
                user_level: helper.tipoUsuario(u.user_level) 
            }));
            return usuarios;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getNombresUsuariosByLevel(user_level) {
    try {
        const rows = await pool.query(selectAllUserByLevel, user_level);
        if (rows.length > 0) {
            const usuarios = rows.map(u => ({
                nombre: u.nombre,
                apellido: u.apellido,
                user_level: helper.tipoUsuario(u.user_level) 
            }));
            return usuarios;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getSeccionDeUsuariosByLevel(user_level, cantidad, desde) {
    try {
        const rows = await pool.query(selectUsersByLevelLimit, [user_level, cantidad, desde]);
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

async function getUserById(id) {
    try {
        const rows = await pool.query(selectUserById, id);
        if (rows.length > 0) {
            rows[0].user_level = helper.tipoUsuario(rows[0].user_level);
            return rows[0]; 
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getUserByEmail(email) {
    try {
        const rows = await pool.query(selectUserByEmail, email);
        if (rows.length > 0) {
            rows[0].user_level = helper.tipoUsuario(rows[0].user_level);
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getUserLoginOptionByEmail(email) {
    try {
        const rows = await pool.query(selectUserLoginOptionByEmail, email);
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

async function getUserLoginOptionByUsername(username) {
    try {
        const rows = await pool.query(selectUserLoginOptionByUsername, username);
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

async function getUserIdByEmail(email) {
    try {
        const rows = await pool.query(selectUserIdByEmail, email);
        if (rows.length > 0) {
            return rows[0].id_usuario;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getUserByEmailOrDni(email, dni) {
    try {
        const rows = await pool.query(selectUserByEmailOrDni, [email, dni]);
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

async function getUsersByGenero(genero) {
    try {
        const rows = await pool.query(selectUsersByGenero, genero);
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

async function getUsersByNacionalidad(nacionalidad) {
    try {
        const rows = await pool.query(selectUsersByNacionalidad, nacionalidad);
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

//full user
async function getFullUserById(id) {
    try {
        const rows = await pool.query(selectFullUserById, id);
        if (rows.length > 0) {
            rows[0].user_level = helper.tipoUsuario(rows[0].user_level);
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getFullUserByEmail(email) {
    try {
        const rows = await pool.query(selectFullUserByEmail, email);
        if (rows.length > 0) {
            rows[0].user_level = helper.tipoUsuario(rows[0].user_level);
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
};

async function getFullUsersByDni(dni) {
    try {
        const rows = await pool.query(selectFullUsersByDni, dni);
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

async function getFullUsersByApelido(apellido) {
    try {
        const rows = await pool.query(selectFullUsersByApellido, apellido);
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

//direcciones
async function getDireccionById(id) {
    try {
        const rows = await pool.query(selectDireccionByid, id);
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

async function getDireccionByUserId(id_usuario) {
    try {
        const rows = await pool.query(selectDireccionByUser, id_usuario);
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

async function getDireccionOpcionalByUserId(id_usuario) {
    try {
        const rows = await pool.query(selectDireccionOpcionalByUser, id_usuario);
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

//modificar

//extra
async function getNextUserId() {

    const result = await pool.query(nextUserId);
    if (result.length > 0) {

        return result[0].id_usuario + 1;
    }
    return 1;
};

export const methods = {
    agregarUsuario,
    agregarDireccion,
    getCantidadUsuarios,
    getUsuarios,
    getUserByEmailOrDni,
    getSeccionDeUsuarios,
    getUsuariosByLevel,
    getNombresUsuariosByLevel,
    getSeccionDeUsuariosByLevel,
    getUserById,
    getUserByEmail,
    getUserLoginOptionByEmail,
    getUserLoginOptionByUsername,
    getUserIdByEmail,
    getUsersByGenero,
    getUsersByNacionalidad,
    getFullUserById,
    getFullUserByEmail,
    getFullUsersByDni,
    getFullUsersByApelido,
    getDireccionById,
    getDireccionByUserId,
    getDireccionOpcionalByUserId,
    getNextUserId
};

