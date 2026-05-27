import { methods as dbClubQuery } from "../db/dbClubQueries.js";

async function getClubes(req, res){
    const clubes = await dbClubQuery.getClubes() || [];

    return res.send(clubes)
}

async function getClubesFullInfo(req, res){
    const clubes = await dbClubQuery.getFullInfoClubes() || [];

    return res.send(clubes)
}

async function getDatosClubById(req, res){
    const id_club = req.params.id;
    if(!id_club){
        return res.status(400).send({ status: "error", message: "Ingrese el id del Club"})
    }
    const club = await dbClubQuery.getClubById(id_club)
    if (!club){
        return res.status(404).send({ status: "error", message: `No existe el Club con el id ${id_club}`})
    }
    res.send(club);
}

async function getFullDatosClubById(req, res){
    const id_club = req.params.id;
    if(!id_club){
        return res.status(400).send({ status: "error", message: "Ingrese el id del Club"})
    }
    const club = await dbClubQuery.getFullInfoClubById(id_club);
    if (!club){
        return res.status(404).send({ status: "error", message: `No existe el Club con el id ${id_club}`})
    }
    res.send(club);
}


export const methods = {
    getClubes,
    getClubesFullInfo,
    getDatosClubById,
    getFullDatosClubById
}