import { methods as dbGeneroQuery } from "../db/dbGenerosQueries.js";



async function generos(req, res){
    
    const paises = await dbGeneroQuery.getGeneros();
    
    return res.send(paises);
};


export const methods = {
    generos
}
