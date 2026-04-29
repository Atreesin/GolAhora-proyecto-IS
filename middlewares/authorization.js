import {methods as cookieHelper} from '../helpers/cookieHelper.js'; 


async function soloAdmin(req,res,next){
    const isAdmin = await cookieHelper.comprobarAdmin(req);
    if(isAdmin) return next();
    return res.redirect("/login");
}

async function soloUsers(req,res,next){
    const logeado = await cookieHelper.revisarCookie(req);
    console.log(logeado)
    if(logeado) return next();
    return res.redirect("/login");
}

async function soloPublico(req,res,next){
    const logeado = await cookieHelper.revisarCookie(req);
    if(!logeado) return next();
    return res.redirect("/");
}



export const methods = {
    soloAdmin,
    soloUsers,
    soloPublico,
}