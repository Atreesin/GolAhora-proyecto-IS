import { methods as dbGeneroQuery } from "../db/dbGenerosQueries.js";



async function generos(req, res){
    
    const generos = await dbGeneroQuery.getGeneros();
    
    return res.send(generos);
};


export const methods = {
    generos
}
