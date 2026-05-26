DROP DATABASE golahora;
-- script SQL de creación de base de datos
CREATE DATABASE golahora;
USE golahora;
-- direcciones y relacionados
CREATE TABLE paises (
    id_pais SERIAL PRIMARY KEY,
    nombre VARCHAR(55) UNIQUE NOT NULL
);
CREATE TABLE provincias (
    id_provincia SERIAL PRIMARY KEY,
    nombre VARCHAR(55) NOT NULL,
    id_pais BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_pais) REFERENCES paises(id_pais),
    UNIQUE (nombre, id_pais) -- Evita repetición de una provincia en el mismo país
);
CREATE TABLE ciudades (
    id_ciudad SERIAL PRIMARY KEY,
    nombre VARCHAR(55) NOT NULL,
    id_provincia BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_provincia) REFERENCES provincias(id_provincia),
    UNIQUE (nombre, id_provincia) -- Evita repetición de una localidad en la misma provincia
);
CREATE TABLE localidades (
    id_localidad SERIAL PRIMARY KEY,
    nombre VARCHAR(70) NOT NULL,
    id_ciudad BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad),
    UNIQUE (nombre, id_ciudad) -- Evita repetición de una localidad en la misma provincia
);
CREATE TABLE direcciones (
    id_direccion SERIAL PRIMARY KEY,
    calle VARCHAR(100) NOT NULL,
    numero VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(8) NOT NULL,
    id_localidad BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_localidad) REFERENCES localidades(id_localidad)
);
-- club, reportes y descuentos
CREATE TABLE clubes (
    id_club SERIAL PRIMARY KEY,
    nombre VARCHAR(55) UNIQUE NOT NULL,
    CUIT CHAR(13) UNIQUE NOT NULL,
    num_telefonico VARCHAR(15) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    id_direccion BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_direccion) REFERENCES direcciones(id_direccion)
);
CREATE TABLE descuentos (
    id_descuento SERIAL PRIMARY KEY,
    descripcion TEXT NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT FALSE,
    porcentaje_descuento DECIMAL(5, 2) NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,
    CONSTRAINT chk_porcentaje_descuento CHECK(
        porcentaje_descuento > 0
        AND porcentaje_descuento <= 100
    ),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE reportes (
    id_reporte SERIAL PRIMARY KEY,
    tipo_reporte TINYINT UNSIGNED NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    detalle TEXT NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,
    CONSTRAINT chk_tipo_reporte CHECK(tipo_reporte <= 3),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club)
);
-- canchas y relacionados
CREATE TABLE superficies (
    id_superficie SERIAL PRIMARY KEY,
    tipo_superficie VARCHAR(55) UNIQUE NOT NULL,
    descripcion VARCHAR(200)
);
CREATE TABLE tipos_de_cancha (
    id_tipo_de_cancha SERIAL PRIMARY KEY,
    tipo_cancha VARCHAR(55) NOT NULL,
    duracion_min INT NOT NULL,
    duracion_max INT NOT NULL,
    ancho DECIMAL(5, 2) NOT NULL,
    largo DECIMAL(5, 2) NOT NULL,
    capacidad TINYINT UNSIGNED NOT NULL,
    imagen_url VARCHAR(255),
    id_superficie BIGINT UNSIGNED NOT NULL,
    CONSTRAINT chk_capacidad CHECK (capacidad <= 22),
    --
    CONSTRAINT chk_duracion CHECK (duracion_min <= duracion_max AND duracion_min > 0),
    CONSTRAINT chk_ancho CHECK (
        ancho BETWEEN 10 AND 85
        AND ancho < largo
    ),
    CONSTRAINT chk_largo CHECK (
        largo BETWEEN 22 AND 120
        AND ancho < largo
    ),
    FOREIGN KEY (id_superficie) REFERENCES superficies(id_superficie)
);
CREATE TABLE ocupaciones (
    id_ocupacion SERIAL PRIMARY KEY,
    tipo_ocupacion VARCHAR(55) NOT NULL,
    hora_inicio DATETIME NOT NULL,
    hora_fin DATETIME
);
CREATE TABLE canchas (
    id_cancha SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    tiempo_cancelacion INT NOT NULL,
    id_tipo_de_cancha BIGINT UNSIGNED NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,
    constraint chk_tiempo_cancelacion CHECK (tiempo_cancelacion >= 0),
    FOREIGN KEY (id_tipo_de_cancha) REFERENCES tipos_de_cancha(id_tipo_de_cancha),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club)
);
CREATE TABLE ocupaciones_cancha (
    id_ocupacion_cancha SERIAL PRIMARY KEY,
    id_ocupacion BIGINT UNSIGNED NOT NULL,
    id_cancha BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_ocupacion) REFERENCES ocupaciones(id_ocupacion),
    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha)
);
CREATE TABLE horarios (
    id_horario SERIAL PRIMARY KEY,
    dia DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_cancha BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha)
);
-- usuarios y relacionados
CREATE TABLE generos (
    id_genero SERIAL PRIMARY KEY,
    genero VARCHAR(75) UNIQUE NOT NULL
);
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    user_level TINYINT UNSIGNED NOT NULL DEFAULT 0,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(150) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    dni VARCHAR(8) UNIQUE NOT NULL,
    telefono VARCHAR(15) NOT NULL DEFAULT '-',
    id_direccion BIGINT UNSIGNED NOT NULL,
    id_direccion_opcional BIGINT UNSIGNED,
    id_genero BIGINT UNSIGNED NOT NULL,
    id_nacionalidad BIGINT UNSIGNED NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_direccion) REFERENCES direcciones(id_direccion),
    FOREIGN KEY (id_direccion_opcional) REFERENCES direcciones(id_direccion),
    FOREIGN KEY (id_genero) REFERENCES generos(id_genero),
    FOREIGN KEY (id_nacionalidad) REFERENCES paises(id_pais),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club)
);
CREATE TABLE certificaciones (
    id_certificacion SERIAL PRIMARY KEY,
    tipo_certificacion BOOLEAN NOT NULL,
    matricula VARCHAR(100) NOT NULL,
    fecha_caducidad DATE NOT NULL,
    link_archivo TEXT NOT NULL,
    id_usuario BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
-- reservas, cobros y recibos
CREATE TABLE metodos_de_pago (
    id_metodo_de_pago SERIAL PRIMARY KEY,
    nombre VARCHAR(55) UNIQUE NOT NULL
);
CREATE TABLE estados_cobro (
    id_estado_cobro SERIAL PRIMARY KEY,
    estado VARCHAR(55) UNIQUE NOT NULL
);
CREATE TABLE cobros (
    id_cobro SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(12, 2) UNSIGNED NOT NULL,
    porcentaje_descuento DECIMAL(3, 2) CHECK (porcentaje_descuento <= 1),
    detalles TEXT NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,
    id_usuario BIGINT UNSIGNED NOT NULL,
    id_estado_cobro BIGINT UNSIGNED NOT NULL,
    id_metodo_de_pago BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_club) REFERENCES clubes(id_club),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_estado_cobro) REFERENCES estados_cobro(id_estado_cobro),
    FOREIGN KEY (id_metodo_de_pago) REFERENCES metodos_de_pago(id_metodo_de_pago)
);
CREATE TABLE recibos (
    id_recibos SERIAL PRIMARY KEY,
    nro_transaccion VARCHAR(70) NOT NULL,
    detalles TEXT NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_cobro BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_cobro) REFERENCES cobros(id_cobro)
);
CREATE TABLE reservas (
    id_reserva SERIAL PRIMARY KEY,
    id_ocupacion BIGINT UNSIGNED NOT NULL,
    id_usuario BIGINT UNSIGNED NOT NULL,
    id_cancha BIGINT UNSIGNED NOT NULL,
    id_cobro BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_ocupacion) REFERENCES ocupaciones(id_ocupacion),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha),
    FOREIGN KEY (id_cobro) REFERENCES cobros(id_cobro)
);
-- clases y entrenamientos
CREATE TABLE estado_capacitaciones (
    id_estado_capacitacion SERIAL PRIMARY KEY,
    estado VARCHAR(55) UNIQUE NOT NULL
);
CREATE TABLE dias (
    id_dia SERIAL PRIMARY KEY,
    nombre VARCHAR(10) UNIQUE NOT NULL
);
CREATE TABLE asistencias (
    id_asistencia SERIAL PRIMARY KEY,
    estado VARCHAR(55) UNIQUE NOT NULL
);
CREATE TABLE clases (
    id_clase SERIAL PRIMARY KEY,
    id_asistencia BIGINT UNSIGNED NOT NULL,
    id_usuario BIGINT UNSIGNED NOT NULL,
    id_profesional BIGINT UNSIGNED NOT NULL,
    id_estado_capacitaciones BIGINT UNSIGNED NOT NULL,
    id_ocupacion BIGINT UNSIGNED NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,
    id_cancha BIGINT UNSIGNED NOT NULL,
    id_cobro BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_cobro) REFERENCES cobros(id_cobro),
    FOREIGN KEY (id_asistencia) REFERENCES asistencias(id_asistencia),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_profesional) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_estado_capacitaciones) REFERENCES estado_capacitaciones(id_estado_capacitacion),
    FOREIGN KEY (id_ocupacion) REFERENCES ocupaciones(id_ocupacion),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club),
    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha)
);
CREATE TABLE entrenamientos (
    id_entrenamiento SERIAL PRIMARY KEY,
    capacidad_max TINYINT UNSIGNED NOT NULL,
    id_profesional BIGINT UNSIGNED NOT NULL,
    id_estado_capacitaciones BIGINT UNSIGNED NOT NULL,
    id_ocupacion BIGINT UNSIGNED NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,
    id_cancha BIGINT UNSIGNED NOT NULL,
    id_cobro BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_cobro) REFERENCES cobros(id_cobro),
    FOREIGN KEY (id_profesional) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_estado_capacitaciones) REFERENCES estado_capacitaciones(id_estado_capacitacion),
    FOREIGN KEY (id_ocupacion) REFERENCES ocupaciones(id_ocupacion),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club),
    FOREIGN KEY (id_cancha) REFERENCES canchas(id_cancha)
);
CREATE TABLE clientes_entrenamientos (
    id_cliente_capacitacion SERIAL PRIMARY KEY,
    id_cliente BIGINT UNSIGNED NOT NULL,
    id_entrenamiento BIGINT UNSIGNED NOT NULL,
    id_asistencia BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_entrenamiento) REFERENCES entrenamientos(id_entrenamiento),
    FOREIGN KEY (id_asistencia) REFERENCES asistencias(id_asistencia),
    UNIQUE (id_cliente, id_entrenamiento)
);
-- ligas y torneos
CREATE TABLE estado_partidos (
    id_estado_partido SERIAL PRIMARY KEY,
    estado VARCHAR(55) UNIQUE NOT NULL
);
CREATE TABLE torneos (
    id_torneo SERIAL PRIMARY KEY,
    nombre VARCHAR(55) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    id_usuario_tutor BIGINT UNSIGNED NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,
    id_estado BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_estado) REFERENCES estado_partidos(id_estado_partido),
    FOREIGN KEY (id_usuario_tutor) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club)
);
CREATE TABLE ligas (
    id_liga SERIAL PRIMARY KEY,
    nombre VARCHAR(70) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    puntos_empate TINYINT NOT NULL DEFAULT 1,
    puntos_victoria TINYINT NOT NULL DEFAULT 3,
    id_usuario_tutor BIGINT UNSIGNED NOT NULL,
    id_club BIGINT UNSIGNED NOT NULL,
    id_estado BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_estado) REFERENCES estado_partidos(id_estado_partido),
    FOREIGN KEY (id_usuario_tutor) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_club) REFERENCES clubes(id_club)
);
CREATE TABLE equipos (
    id_equipo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);
CREATE TABLE participacion_ligas (
    id_participacion_liga SERIAL PRIMARY KEY,
    id_equipo BIGINT UNSIGNED NOT NULL,
    id_liga BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_equipo) REFERENCES equipos(id_equipo),
    FOREIGN KEY (id_liga) REFERENCES ligas(id_liga),
    UNIQUE (id_equipo, id_liga)
);
CREATE TABLE participacion_torneos (
    id_participacion_torneo SERIAL PRIMARY KEY,
    id_equipo BIGINT UNSIGNED NOT NULL,
    id_torneo BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (id_equipo) REFERENCES equipos(id_equipo),
    FOREIGN KEY (id_torneo) REFERENCES torneos(id_torneo),
    UNIQUE (id_equipo, id_torneo)
);
INSERT INTO paises (nombre)
values ('Argentina');
INSERT INTO provincias (id_pais, nombre)
values (1, 'Buenos Aires');
INSERT INTO ciudades (id_provincia, nombre)
values (1, 'Florencio Varela');
INSERT INTO localidades (id_ciudad, nombre)
values (1, 'Florencio Varela');
INSERT INTO generos (genero)
VALUES ('Masculino'),
    ('Femenino'),
    ('No binario'),
    ('Género fluido'),
    ('Agénero'),
    ('Hombre trans'),
    ('Mujer trans'),
    ('Otro'),
    ('Prefiero no especificar');
INSERT INTO direcciones (calle, numero, codigo_postal, id_localidad)
values ('Avenida Calchaquí', '6200', '1888', 1);
INSERT INTO clubes (
        nombre,
        cuit,
        num_telefonico,
        email,
        id_direccion
    )
values (
        'El buen deporte',
        '20-11111111-1',
        '1155555555',
        'mail@golahora.com',
        1
    );
INSERT INTO usuarios (
        username,
        user_level,
        fecha_registro,
        nombre,
        apellido,
        email,
        password,
        fecha_nacimiento,
        dni,
        telefono,
        id_direccion,
        id_direccion_opcional,
        id_genero,
        id_nacionalidad,
        id_club
    )
values (
        'user_00000000001',
        '152',
        '2026-05-26 00:28:01',
        'Administrador',
        'Principal',
        'administrador@golahora.com',
        '$2b$08$jaXXwnndaCje1nPEexDiMOFV4.qjDUtF0lgJTYBBiGry0oZ4kVSoG',
        '2000-01-01',
        '99999999',
        '01112345678',
        1,
        NULL,
        1,
        1,
        1
    );
INSERT INTO superficies (tipo_superficie, descripcion)
VALUES (
        'Césped natural',
        'Suelo de tierra con pasto vivo. Dureza media, amortigua impactos. Uso recomendado en estadios profesionales y clubes grandes.'
    ),
    (
        'Césped sintético (artificial)',
        'Base de caucho y arena con fibras plásticas. Dureza media, buen agarre y bajo mantenimiento. Uso recomendado en complejos deportivos y fútbol 5/7.'
    ),
    (
        'Tierra/arcilla',
        'Suelo compactado, irregular. Dureza variable, puede ser duro en seco y blando en húmedo. Uso recomendado en torneos barriales y zonas rurales.'
    ),
    (
        'Arena',
        'Suelo blando y suelto. Dureza baja, reduce impacto pero dificulta velocidad. Uso recomendado en fútbol playa y recreativo.'
    ),
    (
        'Parquet / madera',
        'Superficie dura y lisa. Dureza alta, buen bote de pelota. Uso recomendado en gimnasios cerrados para futsal.'
    ),
    (
        'Cemento / hormigón',
        'Piso rígido y áspero. Dureza muy alta, mayor riesgo de lesiones. Uso recomendado en clubes barriales y espacios urbanos.'
    ),
    (
        'Caucho sintético',
        'Piso elástico y antideslizante. Dureza baja-media, amortigua impactos. Uso recomendado en canchas techadas y gimnasios modernos.'
    );
SELECT pr.id_provincia,
    pr.nombre,
    pa.nombre AS pais
FROM provincias pr
    LEFT JOIN paises pa ON pr.id_pais = pa.id_pais
WHERE pa.nombre = 'Argentina';
SELECT pa.nombre as pais,
    pr.nombre as provincia,
    c.nombre as ciudad,
    l.nombre as localidad
FROM localidades l
    LEFT JOIN ciudades c ON l.id_ciudad = c.id_ciudad
    LEFT JOIN provincias pr ON c.id_provincia = pr.id_provincia
    LEFT JOIN paises pa ON pa.id_pais = pr.id_pais
ORDER BY pa.nombre ASC,
    pr.nombre ASC,
    c.nombre ASC,
    l.nombre ASC