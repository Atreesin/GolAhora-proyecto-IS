import { link } from "fs";
import { methods as dbCobroQuery } from "../db/dbCobrosQueries.js";

async function registrarcobroReserva(id_cobro, monto, detalles, id_metodo_pago, id_club, id_usuario, id_estado_cobro = 1, porcentaje_descuento = 0){
    //1 = Pendiente
    // id cobro es null genero el cobro
    //generar link de pago
    const estado_cobro = await dbCobroQuery.getEstadosCobrosById(id_estado_cobro);
    if(!estado_cobro){
        return null
    }


    if(!id_cobro){
        // registro el cobro
        const metodo = await dbCobroQuery.getMetdosDePagoById(id_metodo_pago)
        //no deberia pasar por que se comprueba antes pero por las dudas
        if(!metodo){
            return null
        }
        if(metodo.nombre === 'Mercado Pago'){
            //genero el link
        }
        const cobro = {
            
        }
        await dbCobroQuery.registrarCobro(        )
        return true
    }
    if(estado_cobro.estado === 'Aprobado'){
        //generar recibo
    }
    if(estado_cobro.estado === 'Pendiente'){
        //cancelar la reserva
    }



}