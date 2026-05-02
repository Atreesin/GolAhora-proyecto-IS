CREATE DATABASE golahora;

USE golahora;

-- PAISES TABLE
CREATE TABLE paises(
    id_pais INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(70) NOT NULL UNIQUE,
    PRIMARY KEY (id_pais)
);

-- PROVINCIAS TABLE
CREATE TABLE provincias(
    id_provincia INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_pais INT UNSIGNED NOT NULL,
    nombre VARCHAR(70) NOT NULL,
    PRIMARY KEY (id_provincia),
    FOREIGN KEY (id_pais) REFERENCES paises(id_pais)
);

-- CIUDADES TABLE
CREATE TABLE ciudades(
    id_ciudad INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_provincia INT UNSIGNED NOT NULL,
    nombre VARCHAR(70) NOT NULL,
    PRIMARY KEY (id_ciudad),
    FOREIGN KEY (id_provincia) REFERENCES provincias(id_provincia)
);

-- LOCALIDADES TABLE
CREATE TABLE localidades(
    id_localidad INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_ciudad INT UNSIGNED NOT NULL,
    nombre VARCHAR(70) NOT NULL,
    PRIMARY KEY (id_localidad),
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad)
);

-- GENEROS TABLE
CREATE TABLE generos(
    id_genero INT UNSIGNED NOT NULL AUTO_INCREMENT,
    genero VARCHAR(12) NOT NULL,
    PRIMARY KEY (id_genero)
);


-- USERS TABLE
CREATE TABLE users(
    id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(32) NOT NULL UNIQUE,
    nombre VARCHAR(70) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    nacionalidad INT UNSIGNED NOT NULL,
    dni INT UNSIGNED NOT NULL,
    genero INT UNSIGNED NOT NULL,
    fecha_nacimiento  DATE NOT NULL,
    telefono VARCHAR(15) NOT NULL DEFAULT '-',
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    user_level INT NOT NULL DEFAULT 0,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (nacionalidad) REFERENCES paises(id_pais),
    FOREIGN KEY (genero) REFERENCES generos(id_genero)
);

-- DIRECCIONES TABLE
CREATE TABLE direcciones(
    id_direccion INT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_usuario INT UNSIGNED NOT NULL,
    calle VARCHAR(70) NOT NULL,
    numero VARCHAR(8) NOT NULL,
    codigo_postal varchar(8) NOT NULL,
    id_pais INT UNSIGNED NOT NULL,
    id_provincia INT UNSIGNED NOT NULL,
    id_ciudad INT UNSIGNED NOT NULL,
    id_localidad INT UNSIGNED NOT NULL,
    PRIMARY KEY (id_direccion),
    FOREIGN KEY (id_usuario) REFERENCES users(id_usuario),
    FOREIGN KEY (id_pais) REFERENCES paises(id_pais),
    FOREIGN KEY (id_provincia) REFERENCES provincias(id_provincia),
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad),
    FOREIGN KEY (id_localidad) REFERENCES localidades(id_localidad)
);
