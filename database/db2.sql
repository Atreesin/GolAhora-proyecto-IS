-- script SQL de creación de base de datos
CREATE DATABASE golahora;

USE golahora;

-- direcciones y relacionados
CREATE TABLE paises
(
    id_pais SERIAL PRIMARY KEY,
    nombre VARCHAR(55) UNIQUE NOT NULL
);

CREATE TABLE provincias
(
    id_provincia SERIAL PRIMARY KEY,
    nombre VARCHAR(55) NOT NULL,

    id_pais BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_pais) REFERENCES paises(id_pais),

    UNIQUE (nombre, id_pais) -- Evita repetición de una provincia en el mismo país
);

CREATE TABLE ciudades
(
    id_ciudad SERIAL PRIMARY KEY,
    nombre VARCHAR(55) NOT NULL,

    id_provincia BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_provincia) REFERENCES provincias(id_provincia),

    UNIQUE (nombre, id_provincia) -- Evita repetición de una localidad en la misma provincia
);

CREATE TABLE localidades
(
    id_localidad SERIAL PRIMARY KEY,
    nombre VARCHAR(55) NOT NULL,

    id_ciudad BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad),

    UNIQUE (nombre, id_ciudad) -- Evita repetición de una localidad en la misma provincia
);

CREATE TABLE direcciones
(
    id_direccion SERIAL PRIMARY KEY,
    calle VARCHAR(55) NOT NULL,
    numero VARCHAR(55) NOT NULL,
    codigo_postal VARCHAR(8) NOT NULL,

    id_localidad BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_localidad) REFERENCES localidades(id_localidad)
);

-- club, reportes y descuentos
CREATE TABLE clubes
(
    id_club SERIAL PRIMARY KEY,
    nombre VARCHAR(55) UNIQUE NOT NULL,

    id_direccion BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_direccion) REFERENCES direcciones(id_direccion)
);

CREATE TABLE descuentos
(
    id_descuento SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT FALSE,
    porcentaje_descuento DECIMAL(5, 2) NOT NULL,

    id_club BIGINT UNSIGNED NOT NULL,

    CONSTRAINT chk_porcentaje_descuento CHECK(porcentaje_descuento > 0 AND porcentaje_descuento <= 100),

    FOREIGN KEY (id_club) REFERENCES clubes(id_club)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE reportes
(
    id_reporte SERIAL PRIMARY KEY,
    tipo_reporte TINYINT UNSIGNED NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    detalle TEXT NOT NULL,

    id_club BIGINT UNSIGNED NOT NULL,

    CONSTRAINT chk_tipo_reporte CHECK(tipo_reporte <= 3),

    FOREIGN KEY (id_club) REFERENCES clubes(id_club)
);

-- canchas y relacionados
CREATE TABLE horarios (
    id_horario SERIAL PRIMARY KEY,
    dia DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,

    CONSTRAINT chk_horas CHECK (hora_fin > hora_inicio)
);

CREATE TABLE tipos_de_cancha
(
    id_tipo_de_cancha SERIAL PRIMARY KEY,
    tipo_cancha VARCHAR(55) NOT NULL,
    duracion_max CHAR(4) NOT NULL,
    superficie VARCHAR(55) NOT NULL,
    capacidad TINYINT UNSIGNED NOT NULL,

    CONSTRAINT chk_capacidad CHECK (capacidad <= 22)
);

CREATE TABLE canchas
(
    id_cancha SERIAL PRIMARY KEY,
    nombre VARCHAR(55) NOT NULL,
    -- revisar estos dos atributos con el grupo (tipo horario o TIME ¿?)
    hora_min TIME NOT NULL DEFAULT '08:00:00', -- CONSULTAR EN EL GRUPO
    hora_max TIME NOT NULL DEFAULT '23:00:00', -- CONSULTAR EN EL GRUPO

    CONSTRAINT chk_rango_reserva CHECK (hora_max > hora_max),

    id_tipo_de_cancha BIGINT UNSIGNED NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,

    FOREIGN KEY (id_tipo_de_cancha) REFERENCES tipos_de_cancha(id_tipo_de_cancha),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club)
);

CREATE TABLE horarios_canchas
(
    id_horario BIGINT UNSIGNED NOT NULL,
    id_cancha BIGINT UNSIGNED NOT NULL,

    CONSTRAINT pk_horarios_canchas PRIMARY KEY (id_horario, id_cancha),

    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha),
    FOREIGN KEY (id_horario) REFERENCES horarios(id_horario)
);

CREATE TABLE bloqueos
(
    id_bloqueo SERIAL PRIMARY KEY,
    tipo_bloqueo VARCHAR( 55) NOT NULL,
    hora_inicio DATETIME NOT NULL,
    hora_fin DATETIME,
    id_cancha BIGINT UNSIGNED NOT NULL,

    CONSTRAINT chk_rango_bloqueo CHECK (hora_fin IS NULL OR hora_fin > hora_inicio),

    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- usuarios y relacionados
CREATE TABLE generos
(
    id_genero SERIAL PRIMARY KEY,
    genero VARCHAR(55) UNIQUE NOT NULL
);

CREATE TABLE usuarios
(
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(55) UNIQUE NOT NULL,
    nivel_usuario TINYINT NOT NULL DEFAULT 0,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nombre VARCHAR(55) NOT NULL,
    apellido VARCHAR(55) NOT NULL,
    email VARCHAR(55) UNIQUE NOT NULL,
    password VARCHAR(55) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    dni VARCHAR(8) UNIQUE NOT NULL,
    num_telefonico VARCHAR(15) NOT NULL DEFAULT '-',

    id_genero BIGINT UNSIGNED NOT NULL,
    id_pais BIGINT UNSIGNED NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,

    CONSTRAINT chk_nivel_usuario CHECK (nivel_usuario <= 3),

    FOREIGN KEY (id_genero) REFERENCES generos(id_genero),
    FOREIGN KEY (id_pais) REFERENCES paises(id_pais),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club)
);

CREATE TABLE usuarios_direcciones
(
    id_usuario BIGINT UNSIGNED NOT NULL,
    id_direccion BIGINT UNSIGNED NOT NULL,

    CONSTRAINT pk_usuarios_direcciones PRIMARY KEY (id_usuario, id_direccion),

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_direccion) REFERENCES direcciones(id_direccion)
);

CREATE TABLE certificaciones
(
    id_certificacion SERIAL PRIMARY KEY,
    tipo_certificacion BOOLEAN NOT NULL,
    matricula VARCHAR(55) NOT NULL,
    fecha_caducidad DATE NOT NULL,

    id_usuario BIGINT UNSIGNED NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE reservas
(
    id_reserva SERIAL PRIMARY KEY,
    dia DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    duracion CHAR(4) NOT NULL,

    id_usuario BIGINT UNSIGNED NOT NULL,
    id_cancha BIGINT UNSIGNED NOT NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha)
);

CREATE TABLE estado_capacitaciones
(
    id_estado_capacitacion SERIAL PRIMARY KEY,
    nombre VARCHAR(55) UNIQUE NOT NULL
);

CREATE TABLE dias
(
    id_dia SERIAL PRIMARY KEY,
    nombre VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE capacitaciones
(
    id_capacitacion SERIAL PRIMARY KEY,
    tipo BOOLEAN NOT NULL,
    horario_asignado TIME NOT NULL,
    capacidad_max TINYINT UNSIGNED NOT NULL,

    id_estado_capacitaciones BIGINT UNSIGNED NOT NULL,
    id_dias BIGINT UNSIGNED NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,

    FOREIGN KEY(id_estado_capacitaciones) REFERENCES estado_capacitaciones(id_estado_capacitacion),
    FOREIGN KEY(id_dias) REFERENCES dias(id_dia),
    FOREIGN KEY(id_club) REFERENCES clubes(id_club)
);

CREATE TABLE asistencias
(
    id_asistencia SERIAL PRIMARY KEY,
    nombre VARCHAR(55) UNIQUE NOT NULL
);

CREATE TABLE clientes_capacitaciones
(
    id_cliente_capacitacion SERIAL PRIMARY KEY,
    id_cliente BIGINT UNSIGNED NOT NULL,
    id_capacitacion BIGINT UNSIGNED NOT NULL,
    id_asistencia BIGINT UNSIGNED NOT NULL,
    fecha TIMESTAMP NOT NULL,

    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_capacitacion) REFERENCES capacitaciones(id_capacitacion),
    FOREIGN KEY (id_asistencia) REFERENCES asistencias(id_asistencia)
);

CREATE TABLE profesionales_capacitaciones
(
    id_profesional_capacitacion SERIAL PRIMARY KEY ,
    id_profesional BIGINT UNSIGNED NOT NULL,
    id_capacitacion BIGINT UNSIGNED NOT NULL,


    FOREIGN KEY (id_profesional) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_capacitacion) REFERENCES capacitaciones(id_capacitacion)
);

CREATE TABLE metodos_de_pago
(
    id_metodo_de_pago SERIAL PRIMARY KEY,
    nombre VARCHAR(55) UNIQUE NOT NULL
);

CREATE TABLE estados_cobro
(
    id_estado_cobro SERIAL PRIMARY KEY,
    nombre VARCHAR(55) UNIQUE NOT NULL
);

CREATE TABLE cobros
(
    id_cobro SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(12, 2) UNSIGNED NOT NULL,
    descuento
    nombre descuento
    id_estado_cobro BIGINT UNSIGNED NOT NULL,
    id_metodo_de_pago BIGINT UNSIGNED NOT NULL,
    id_reserva BIGINT UNSIGNED NOT NULL,
    id_capacitacion BIGINT UNSIGNED NOT NULL,

    FOREIGN KEY (id_estado_cobro) REFERENCES estados_cobro(id_estado_cobro),
    FOREIGN KEY (id_metodo_de_pago) REFERENCES metodos_de_pago(id_metodo_de_pago),
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    FOREIGN KEY (id_capacitacion) REFERENCES capacitaciones(id_capacitacion)
);

CREATE TABLE recibos
(
    id_recibos SERIAL PRIMARY KEY,
    detalles TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    id_cobro BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_cobro) REFERENCES cobros(id_cobro)
);

CREATE TABLE organizaciones_partidos
(
    id_organizaciones_partidos SERIAL PRIMARY KEY,
    tipo_organizacion BOOLEAN NOT NULL
);

CREATE TABLE tipos_eliminacion
(
    id_tipo_eliminacion SERIAL PRIMARY KEY,
    tipo VARCHAR(55) UNIQUE NOT NULL
);

CREATE TABLE torneos
(
    id_torneo SERIAL PRIMARY KEY,
    nombre VARCHAR(55) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    cantidad_equipos TINYINT NOT NULL,
    ganador VARCHAR(100) NOT NULL,

    id_usuario_tutor BIGINT UNSIGNED NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,
    id_tipo_eliminacion BIGINT UNSIGNED NOT NULL,

    FOREIGN KEY (id_usuario_tutor) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club),
    FOREIGN KEY (id_tipo_eliminacion) REFERENCES tipos_de_cancha(id_tipo_de_cancha)
);

CREATE TABLE ligas
(
    id_liga SERIAL PRIMARY KEY,
    nombre VARCHAR(55) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    puntos_empate TINYINT NOT NULL DEFAULT 1,
    puntos_victoria TINYINT NOT NULL DEFAULT 3,
    cantidad_equipos TINYINT NOT NULL,
    ganador VARCHAR(100) NOT NULL,

    id_usuario_tutor BIGINT UNSIGNED NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,

    FOREIGN KEY (id_usuario_tutor) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club)
);

CREATE TABLE equipos
(
    id_equipo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,

    id_torneo BIGINT UNSIGNED,
    id_liga BIGINT UNSIGNED,

    FOREIGN KEY (id_torneo) REFERENCES torneos(id_torneo),
    FOREIGN KEY (id_liga) REFERENCES ligas(id_liga),

    UNIQUE (nombre, id_torneo),
    UNIQUE (nombre, id_liga)
);

CREATE TABLE historial_partidos
(
    id_historial_partidos SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL,
    goles_equipo_a INTEGER UNSIGNED NOT NULL,
    goles_equipo_b INTEGER UNSIGNED NOT NULL,
    ganador VARCHAR(100) NOT NULL,

    id_equipo_a BIGINT UNSIGNED NOT NULL,
    id_equipo_b BIGINT UNSIGNED NOT NULL,

    FOREIGN KEY (id_equipo_a) REFERENCES equipos(id_equipo),
    FOREIGN KEY (id_equipo_b) REFERENCES equipos(id_equipo)
);
