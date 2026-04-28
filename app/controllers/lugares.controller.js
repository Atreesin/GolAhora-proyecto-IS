import { methods as dbLugarQuery } from "../db/dbLugaresQueries.js";

//nuevo pais
async function nuevoPais(req, res) {
    /*
    const nuevoPais = {
            nombre: req.params.pais
        };
    try{
        await dbLugarQuery.agregarPais(nuevoPais);      
        return 'pais agregado';
    } catch (err) {
        console.error(err);
        return 'el pais ya existe';
    }
        */
    const pais = await dbLugarQuery.getPaisPorNombre(req.params.pais);
    if (!pais) {
        const nuevoPais = {
            nombre: req.params.pais
        };
        await dbLugarQuery.agregarPais(nuevoPais);
        return res.send(`el pais ${req.params.pais} fue agregado`);
    }
    return res.send(`el pais ${req.params.pais} ya existe`);
}


async function idPais(req, res){
    
    const paisBuscado = await dbLugarQuery.getPaisPorNombre(req.params.pais);
    if(!paisBuscado){
        const nuevoPais = {
            nombre: req.params.pais
        };

        await dbLugarQuery.agregarPais(nuevoPais);
        const paisEncontrado = await dbLugarQuery.getPaisPorNombre(req.params.pais);
        return res.send(paisEncontrado.id_pais);
    }
    return res.send(paisBuscado.id_pais);
};

async function idProvincia(provincia, idPais) {
    let idProvincia = await dbLugarQuery.getProvinciaPorNombre(provincia);
    if(!idProvincia){
        const nuevaPronvincia = {
            id_pais: idPais,
            nombre: provincia
        };

        await dbLugarQuery.agregarProvincia(nuevaPronvincia);
        idProvincia = await dbLugarQuery.getProvinciaPorNombre(provinica);
    }
    return idProvincia.idProvincia;
}

async function idCiudad(ciudad, idProvincia){
    const idCiudad = await dbLugarQuery.getCiudadPorNombre(ciudad);
    if(!idCiudad){
        const nuevaCiudad = {
            id_provincia: idProvincia,
            nombre: ciudad
        };

        await dbLugarQuery.agregarCiudad(nuevaCiudad);
        idCiudad = await dbLugarQuery.getCiudadPorNombre(ciudad);
    }
    return idCiudad.id_ciudad;
}

async function idLocalidad(localidad, idCiudad){
    let idLocalidad = await dbLugarQuery.getLocalidadPorNombre(localidad);
    if(!idLocalidad){
        const nuevaLocalidad = {
            id_ciudad: idCiudad,
            nombre: localidad
        };

        await dbLugarQuery.agregarLocalidad(nuevaLocalidad);
        idLocalidad = await dbLugarQuery.getLocalidadPorNombre(localidad);
    }
    return idLocalidad.id_localidad
}

export const methods = {
    nuevoPais,
    idPais,
    idProvincia,
    idCiudad,
    idLocalidad
    /*
    paises,
    provincias,
    ciudades,
    localidades
    */
} 