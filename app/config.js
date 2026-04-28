import { config } from "dotenv";

config();

export const PORT = process.env.SERVER_PORT || 4000
export const HOST = `http://${process.env.SERVER_HOST}:${PORT}`
export const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION
export const JWT_COOKIE_EXPIRES = process.env.JWT_COOKIE_EXPIRES
export const ADMIN_USER_LEVEL = process.env.ADMIN_USER_LEVEL
export const CLIENT_USER_LEVEL = process.env.CLIENT_USER_LEVEL
export const PROFESOR_USER_LEVEL = process.env.PROFESOR_USER_LEVEL
export const ENTRENADOR_USER_LEVEL = process.env.ENTRENADOR_USER_LEVEL

export const database = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};
