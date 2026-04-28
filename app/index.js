import express from "express";
import morgan from 'morgan';
import cookieParser from "cookie-parser";

import cors from "cors";

import {PORT} from './config.js';

import { methods as dbLugarQuery } from "./db/dbLugaresQueries.js";

import { methods as lugarController } from "./controllers/lugares.controller.js";

import path from 'path';
import { fileURLToPath } from "url";
export const __dirname = path.dirname(fileURLToPath(import.meta.url));


//Server
const app = express();
app.use(morgan('dev'));

app.listen(PORT, () => {
    console.log("servidor corriendo en puerto: ", PORT);
});

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//rutas
app.get("/", (req,res) => res.send("Sitio en construcción"));
app.get("/register", async (req, res) => {res.json(await verPaises())});

app.get("/agregarPais/:pais", async (req, res) => await lugarController.nuevoPais(req, res));
app.get("/buscarOagregarPais/:pais", async (req, res) => await lugarController.idPais(req, res))

async function nuevoPais(pais){
    const nuevoPais = {
            nombre: pais
        };
    try{
        await dbLugarQuery.agregarPais(nuevoPais);      
        return 'pais agregado';
    } catch (err) {
        console.error(err);
        return 'el pais ya existe';
    }
}

async function verPaises(){
    try{   
        const paises = await dbLugarQuery.getPaises();
        return paises;
    } catch (err) {
        return {error: 'error'};
    }

}
