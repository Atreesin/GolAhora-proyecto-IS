import { methods as dbClubQuery } from "../db/dbClubQueries.js";

async function getClubes(req, res){
    const clubes = await dbClubQuery.getClubes();

    return res.send(clubes)
}

async function getClubesFullInfo(req, res){
    const clubes = await dbClubQuery.getFullInfoClubes();

    return res.send(clubes)
}

async function getDatosClubById(req, res){
    const id_club = req.params.id;
    if(!id_club){
        return res.status(400).send({ status: "error", message: "Ingrese el id del Club"})
    }
    res.send(await dbClubQuery.getClubById(id_club));
}

async function getFullDatosClubById(req, res){
    const id_club = req.params.id;
    if(!id_club){
        return res.status(400).send({ status: "error", message: "Ingrese el id del Club"})
    }
    res.send(await dbClubQuery.getFullInfoClubById(id_club));
}


export const methods = {
    getClubes,
    getClubesFullInfo,
    getDatosClubById,
    getFullDatosClubById
}