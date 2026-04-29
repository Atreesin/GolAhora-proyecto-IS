import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { JWT_SECRET, JWT_EXPIRATION, JWT_COOKIE_EXPIRES, CLIENT_USER_LEVEL } from "../config.js";
import { methods as dbUserQuery } from "../db/dbUserQueries.js";
import { methods as dbLugarQuery } from "../db/dbLugaresQueries.js";
import { methods as dbGeneroQuery } from "../db/dbGenerosQueries.js";

/**
* Realiza el login de un usuario comprobando si existe usuario, si el usuario esta verificado,
* encripta el password para compararlo con el password de la base de datos y genera un token.
* 
* Recibe en el req.body la plataforma (android o web), el email y password,
* realiza la comprobacion de login y de ser correcta
* envia mediante response un status "ok" junto con un token en una cookie si la plataforma es web
* y el token junto con la expiracion si la plataforma es android
* @param {*} req request necesita parametros plataform, email y password
* @param {*} res response
* @returns {void}
*/
async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).send({ status: "Error", message: "Algunos campos estan vacios" })
    }

    const usuarioARevisar = await dbUserQuery.getUserLoginOptionByEmail(email);

    if (!usuarioARevisar) {
        return res.status(400).send({ status: "Error", message: "Error al conectarse" })
    }

    const loginCorrecto = await bcryptjs.compare(password, usuarioARevisar.password);

    if (!loginCorrecto) {
        return res.status(400).send({ status: "Error", message: "Login incorrecto" })
    }

    const token = jsonwebtoken.sign(
        { email: email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION });

    const cookieOpption = {
        expires: new Date(Date.now() + JWT_COOKIE_EXPIRES * 24 * 60 * 1000),
        path: "/"
    }

    if (req.headers.plataform === "web") {
        res.cookie("jwt", token, cookieOpption);
        res.send({ status: "ok", message: "Usuario loggeado", redirect: "/profile" })
    }
    if (req.headers.plataform === "windows") {
        res.send({ status: "ok", message: "Usuario loggeado", token: token, expires: cookieOpption.expires })
    }
}

/**
 * Registra un usuario, comprobando halla recibido todos los campos en el body y que no exista otro usuario con el mismo email,
 * encripta la contraseña, genera un token, y envia un link de verificacion por email al correo electronico recibido en el body; genera un username
 * y lo agrega a la base de datos.
 * @param {*} req request necesita en el body los parametros: nombre, apellido, dni, telefono, email, password, confirm_password
 * @param {*} res responde con un status 400 o 500 en caso de error y 201 si es correcto y redirecciona a "/"
 * @returns {void}
 */
async function register(req, res) {

    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const nacionalidad = req.body.nacionalidad;
    const dni = req.body.dni;
    const genero = req.body.genero;
    const fecha_nacimiento = req.body.fecha_nacimiento;
    const telefono = req.body.telefono;
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
    const calle = req.body.calle;
    const numero = req.body.numero;
    const codigo_postal = req.body.codigo_postal;
    const pais = req.body.pais;
    const provincia = req.body.provincia;
    const ciudad = req.body.ciudad;
    const localidad = req.body.localidad;

    if (!nombre || !apellido || !dni || !genero || !fecha_nacimiento || !email || !telefono || !password || !confirm_password || !calle || !numero || !localidad || !ciudad || !provincia || !pais) {
        console.log(provincia);
        return res.status(400).send({ status: "Error", message: "Algunos campos estan vacios" })
    }


    if (!esPasswordFuerte(password)) {
        return res.status(400).send({
            status: "Error",
            message: "La contraseña es muy débil"
        });
    }
    if (!(password === confirm_password)) {

        return res.status(400).send({ status: "Error", message: "Las contraseñas no coinciden" })
    }

    const usuarioExiste = await dbUserQuery.getUserByEmailOrDni(email, dni);
    if (usuarioExiste) {
        return res.status(400).send({ status: "Error", message: "Este usuario ya existe" })
    }
    const salt = await bcryptjs.genSalt(8);
    const hashPassword = await bcryptjs.hash(password, salt);
    const tokenVerificacion = jsonwebtoken.sign(
        { email: email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
    );

    const generateUsername = (id) => `user_${String(id).padStart(11, '0')}`;

    /**  posible refactor **/
    let idNacionalidad = await dbLugarQuery.getPaisPorNombre(nacionalidad);
    if (!idNacionalidad) {
        const nuevoPais = {
            nombre: nacionalidad
        };

        await dbLugarQuery.agregarPais(nuevoPais);
        idNacionalidad = await dbLugarQuery.getPaisPorNombre(nacionalidad);
    }

    let idGenero = await dbGeneroQuery.getIdGeneroByGenero(genero);
    if (!idGenero) {
        const nuevoGenero = {
            genero
        };

        await dbGeneroQuery.agregarGenero(nuevoGenero);
        idGenero = await dbGeneroQuery.getIdGeneroByGenero(genero);
    }
    /**  fin posible refactor **/

    //Obtener el proximo ID disponible
    const nextUserId = await dbUserQuery.getNextUserId();
    //Generar el username basado en el proximo Id
    const username = generateUsername(nextUserId);


    const nuevoUsuario = {
        username,
        nombre,
        apellido,
        nacionalidad: idNacionalidad.id_pais,
        dni,
        genero: idGenero,
        fecha_nacimiento,
        telefono,
        email,
        password: hashPassword,
        user_level: CLIENT_USER_LEVEL
    }
    await dbUserQuery.agregarUsuario(nuevoUsuario);
    const idNuevoUsuario = await dbUserQuery.getUserIdByEmail(email);
    /**  posible refactor **/
    //pais
    let idPais = await dbLugarQuery.getPaisPorNombre(pais);
    if (!idPais) {
        const nuevoPais = {
            nombre: pais
        };

        await dbLugarQuery.agregarPais(nuevoPais);
        idPais = await dbLugarQuery.getPaisPorNombre(pais);
    };
    //provincia
    let idProvincia = await dbLugarQuery.getProvinciaPorNombreYIdPais(provincia, idPais.id_pais);
    if (!idProvincia) {
        const nuevaPronvincia = {
            id_pais: idPais.id_pais,
            nombre: provincia
        };

        await dbLugarQuery.agregarProvincia(nuevaPronvincia);
        idProvincia = await dbLugarQuery.getProvinciaPorNombreYIdPais(provincia, idPais.id_pais);
    };
    //ciudad
    let idCiudad = await dbLugarQuery.getCiudadPorNombreYIdProvincia(ciudad, idProvincia.id_provincia);
    if (!idCiudad) {
        const nuevaCiudad = {
            id_provincia: idProvincia.id_provincia,
            nombre: ciudad
        };

        await dbLugarQuery.agregarCiudad(nuevaCiudad);
        idCiudad = await dbLugarQuery.getCiudadPorNombreYIdProvincia(ciudad, idProvincia.id_provincia);
    }
    //localidad
    let idLocalidad = await dbLugarQuery.getLocalidadPorNombreYIdCiudad(localidad, idCiudad.id_ciudad);
    if (!idLocalidad) {
        const nuevaLocalidad = {
            id_ciudad: idCiudad.id_ciudad,
            nombre: localidad
        };

        await dbLugarQuery.agregarLocalidad(nuevaLocalidad);
        idLocalidad = await dbLugarQuery.getLocalidadPorNombre(localidad, idCiudad.id_ciudad);
    }
    /**  fin posible refactor **/

    const direccion = {
        id_usuario: idNuevoUsuario,
        calle,
        numero,
        codigo_postal,
        id_pais: idPais.id_pais,
        id_provincia: idProvincia.id_provincia,
        id_ciudad: idCiudad.id_ciudad,
        id_localidad: idLocalidad.id_localidad
    }
    //AGREGO LA DIRECCION A UN USUARIO
    await dbUserQuery.agregarDireccion(direccion);
    return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUsuario.username} agregado`, redirect: "/" })
}

/**
 * Verifica el email un usuario mediante un link enviado anteriormente a ese email y activa la cuenta para su uso
 * @param {*} req request necesita el token en los params
 * @param {*} res responde con un redirect, un status y en caso de ser correcto una cookie
 * @returns {void}
 */
async function verificarCuenta(req, res) {
    try {
        if (!req.params.token) {
            console.log("no params token")
            return res.redirect("/")
        }
        const decodificada = jsonwebtoken.verify(req.params.token, JWT_SECRET);
        if (!decodificada || !decodificada.email) {
            console.log("token invalido")
            return res.redirect("/").send({ status: "error", message: "Token invalido" })
        }
        const token = jsonwebtoken.sign(
            { email: decodificada.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION });
        const cookieOpption = {
            expires: new Date(Date.now() + JWT_COOKIE_EXPIRES * 24 * 60 * 1000),
            path: "/"
        }

        const actualizado = await dbUserQuery.actualizarUserVerificado(decodificada.email);

        res.cookie("jwt", token, cookieOpption);
        res.redirect("/")

    } catch (err) {
        res.status(500);
        res.redirect("/")
    }
}

function esPasswordFuerte(password) {
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /\d/.test(password);
    const tieneEspecial = /[@$!%*?&]/.test(password);
    const longitudValida = password.length >= 8;

    return tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial && longitudValida;
}

export const methods = {
    login,
    register,
    verificarCuenta
}