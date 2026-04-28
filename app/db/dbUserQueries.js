import pool from "./databaseConnection.js"

//registrar usuario
const insertUser = 'INSERT INTO users SET ?';
//registrar direccion de usuario
const insertDireccion = 'INSERT INTO direcciones SET ?';
//modificar datos de usuario
const updateUser = 'UPDATE users SET username = ?, nombre = ?, apellido = ?, nacionalidad = ?, dni = ?, genero = ?, fecha_nacimiento = ?, telefono = ?, email = ? WHERE id_usuario = ?';
const updateUsername = 'UPDATE users SET username = ? WHERE id_usuario = ?';
const updateUserNombre = 'UPDATE users SET nombre = ? WHERE id_usuario = ?';
const updateUserApellido = 'UPDATE users SET apellido = ? WHERE id_usuario = ?';
const updateUserNacionalidad = 'UPDATE users SET nacionalidad = ? WHERE id_usuario = ?';
const updateUserDni = 'UPDATE users SET dni = ? WHERE id_usuario = ?';
const updateUserGenero = 'UPDATE users SET genero = ? WHERE id_usuario = ?';
const updateUserFechaNacimiento = 'UPDATE users SET fecha_nacimiento = ? WHERE id_usuario ?'
const updateUserTelefono = 'UPDATE users SET telefono = ? WHERE id_usuario = ?';
const updateUserEmail = 'UPDATE users SET email = ? WHERE id_usuario = ?';
const updateUserPassword = 'UPDATE users SET password = ? WHERE id = ?';
const updateUserUserLevel = 'UPDATE users SET user_level = ? WHERE id_usuario = ?';
//modificar direccion de usuario
const updateDireccion = 'UPDATE direcciones SET calle = ?, numero = ?, codigo_postal = ?, localidad = ?, ciudad = ?, provincia ?, pais = ? WHERE id_direccion = ?';
const updateCalle = 'UPDATE direcciones SET calle = ? WHERE id_direccion = ?';
const updateNumero = 'UPDATE direcciones SET numero = ? WHERE id_direccion = ?';
const updateCodigoPostal = 'UPDATE direcciones SET codigo_postal = ? WHERE id_direccion = ?';
const updateLocalidad = 'UPDATE direcciones SET localidad = ? WHERE id_direccion = ?';
const updateCidad = 'UPDATE direcciones SET ciudad = ? WHERE id__direccion = ?'
const updateProvincia = 'UPDATE direcciones SET provincia = ? WHERE id_direccion = ?';
const updatePais = 'UPDATE direcciones SET pais = ? WHERE id_direccion = ?';
//consultar clientes
const selectUserByEmailOrDni = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.nombre AS genero, u.fecha_nacimiento, u.telefono, u.email, u.user_level FROM users u LEFT JOIN paises n ON u.nacionalidad = n.id_pais LEFT JOIN generos g ON u.genero = g.id_genero WHERE u.email = ? or u.dni = ?';
const selectCantidadUsuarios = 'SELECT COUNT(*) AS total_usuarios FROM users';
const selectUserIdByEmail = 'SELECT id_usuario FROM users WHERE email = ?';
const selectUsersByGenero = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.nombre AS genero, u.telefono, u.email FROM users u LEFT JOIN paises n ON u.nacionalidad = n.id_pais LEFT JOIN generos g ON u.genero = g.id_genero WHERE g.nombre = ? ORDER BY apellido ASC, nombre ASC, dni ASC';
const selectUsersByNacionalidad = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.nombre AS genero, u.telefono, u.email FROM users u LEFT JOIN paises n ON u.nacionalidad = n.id_pais LEFT JOIN generos g ON u.genero = g.id_genero WHERE n.nombre = ? ORDER BY apellido ASC, nombre ASC, dni ASC';
const selectAllUsers = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.nombre AS genero, u.telefono, u.email FROM users u LEFT JOIN paises n ON u.nacionalidad = n.id_pais LEFT JOIN generos g ON u.genero = g.id_genero ORDER BY apellido ASC, nombre ASC, dni ASC';
const selectAllUsersLimit = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.nombre AS genero, u.telefono, u.email FROM users u LEFT JOIN paises n ON u.nacionalidad = n.id_pais LEFT JOIN generos g ON u.genero = g.id_genero ORDER BY apellido ASC, nombre ASC, dni ASC LIMIT ? OFFSET ?';
const selectUsersByLevelLimit = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.nombre AS genero, u.telefono, u.email FROM users u LEFT JOIN paises n ON u.nacionalidad = n.id_pais LEFT JOIN generos g ON u.genero = g.id_genero WHERE u.user_level = ? ORDER BY apellido ASC, nombre ASC, dni ASC LIMIT ? OFFSET ?';
const selectAllUserByLevel = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.nombre AS genero, u.telefono, u.email FROM users u LEFT JOIN paises n ON u.nacionalidad = n.id_pais LEFT JOIN generos g ON u.genero = g.id_genero WHERE user_level = ? ORDER BY apellido ASC, nombre ASC, dni ASC';
const selectUserById = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.nombre AS genero, u.fecha_nacimiento, u.telefono, u.email, u.user_level FROM users u LEFT JOIN paises n ON u.nacionalidad = n.id_pais LEFT JOIN generos g ON u.genero = g.id_genero WHERE id_usuario = ?';
const selectUserLoginOptionByEmail = 'SELECT username, password, user_level FROM users WHERE email = ?';
const selectUserLoginOptionByUsername = 'SELECT username, password, user_level FROM users WHERE username = ?';
const selectFullUserById = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.nombre AS genero, u.fecha_nacimiento, u.telefono, u.email, d.calle, d.numero, d.codigo_postal, pa.nombre AS pais, pr.nombre AS provincia, c.nombre AS ciudad, l.nombre AS localidad, u.user_level, u.fecha_registro  FROM users u LEFT JOIN generos g ON u.genero = g.id_genero LEFT JOIN paises n ON u.nacionalidad = n.id_pais LEFT JOIN direcciones d ON u.id_usuario = d.id_usuario LEFT JOIN paises pa ON d.id_pais = pa.id_pais LEFT JOIN provincias pr ON d.id_provincia = pr.id_provincia LEFT JOIN ciudades c ON d.id_ciudad = c.id_ciudad LEFT JOIN localidades l ON d.id_localidad = l.id_localidad WHERE u.id_usuario = ?';
const selectFullUsersByDni = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.nombre AS genero, u.fecha_nacimiento, u.telefono, u.email, d.calle, d.numero, d.codigo_postal, pa.nombre AS pais, pr.nombre AS provincia, c.nombre AS ciudad, l.nombre AS localidad, u.user_level, u.fecha_registro  FROM users u LEFT JOIN generos g ON u.genero = g.id_genero LEFT JOIN paises n ON u.nacionalidad = n.id_pais LEFT JOIN direcciones d ON u.id_usuario = d.id_usuario LEFT JOIN paises pa ON d.id_pais = pa.id_pais LEFT JOIN provincias pr ON d.id_provincia = pr.id_provincia LEFT JOIN ciudades c ON d.id_ciudad = c.id_ciudad LEFT JOIN localidades l ON d.id_localidad = l.id_localidad WHERE u.dni LIKE ? ORDER BY u.apellido, u.nombre';
const selectFullUsersByApellido = 'SELECT u.username, u.nombre, u.apellido, n.nombre AS nacionalidad, u.dni, g.nombre AS genero, u.fecha_nacimiento, u.telefono, u.email, d.calle, d.numero, d.codigo_postal, pa.nombre AS pais, pr.nombre AS provincia, c.nombre AS ciudad, l.nombre AS localidad, u.user_level, u.fecha_registro  FROM users u LEFT JOIN generos g ON u.genero = g.id_genero LEFT JOIN paises n ON u.nacionalidad = n.id_pais LEFT JOIN direcciones d ON u.id_usuario = d.id_usuario LEFT JOIN paises pa ON d.id_pais = pa.id_pais LEFT JOIN provincias pr ON d.id_provincia = pr.id_provincia LEFT JOIN ciudades c ON d.id_ciudad = c.id_ciudad LEFT JOIN localidades l ON d.id_localidad = l.id_localidad WHERE u.apellido LIKE ? ORDER BY u.apellido, u.nombre';
//consultar direcciones
const selectDireccionByid ='SELECT d.calle, d.numero, d.codigo_postal, pa.nombre AS pais, pr.nombre AS provincia, l.nombre AS localidad FROM direcciones d LEFT JOIN paises pa ON d.id_pais = pa.id_pais LEFT JOIN provincias pr ON d.id_provincia = pr.id_provincia LEFT JOIN ciudades c ON d.id_ciudad = c.id_ciudad LEFT JOIN localidades l ON d.id_localidad = l.id_localidad WHERE d.id_direccion = ?';
const selectDireccionByUser ='SELECT d.calle, d.numero, d.codigo_postal, pa.nombre AS pais, pr.nombre AS provincia, l.nombre AS localidad FROM direcciones d LEFT JOIN paises pa ON d.id_pais = pa.id_pais LEFT JOIN provincias pr ON d.id_provincia = pr.id_provincia LEFT JOIN ciudades c ON d.id_ciudad = c.id_ciudad LEFT JOIN localidades l ON d.id_localidad = l.id_localidad WHERE d.id_usuario = ?';
//eliminar

//utils
const nextUserId = 'SELECT * FROM users ORDER BY id_usuario DESC LIMIT 1;';


//registrar
async function agregarUsuario(usuario) {
    await pool.query(insertUser, usuario);
}

async function agregarDireccion(direccion) {
    await pool.query(insertDireccion, direccion);
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

async function getUsuarios(){
    try {
        const rows = await pool.query(selectAllUsers);
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

async function getSeccionDeUsuarios(cantidad, desde){
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

async function getUsuariosByLevel(user_level){
    try {
        const rows = await pool.query(selectAllUserByLevel, user_level);
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

async function getSeccionDeUsuariosByLevel(user_level, cantidad, desde){
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
        const rows = await pool.query(selectUserIdByEmail, [email, dni]);
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
async function getFullUserById(id){
    try {
        const rows = await pool.query(selectFullUserById, id);
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

async function getFullUsersByDni(dni){
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

async function getDireccionByUserId(id_usuario){
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

//modificar

//extra
async function getNextUserId() {

    const result = await pool.query(nextUserId);
    console.log(result);
    if (result.length > 0){  

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
    getSeccionDeUsuariosByLevel,
    getUserById,
    getUserLoginOptionByEmail,
    getUserLoginOptionByUsername,
    getUserIdByEmail,
    getUsersByGenero,
    getUsersByNacionalidad,
    getFullUserById,
    getFullUsersByDni,
    getFullUsersByApelido,
    getDireccionById,
    getDireccionByUserId,
    getNextUserId
};

