import { ADMIN_USER_LEVEL, CLIENT_USER_LEVEL, PROFESOR_USER_LEVEL, ENTRENADOR_USER_LEVEL } from "../config.js";

// Validar nombre y apellido: solo letras y espacios, mínimo 3 caracteres
function validarNombreApellido(valor) {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,}$/;
  return regex.test(valor);
}

// Validar DNI: solo números, entre 7 y 8 dígitos (ajustar según país)
function validarDNI(dni) {
  const regex = /^\d{7,8}$/;
  return regex.test(dni);
}

// Validar Email: formato estándar
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validar Teléfono: admite +, espacios y guiones, mínimo 8 dígitos
function validarTelefono(telefono) {
  const regex = /^\+?\d{8,15}$/;
  return regex.test(telefono.replace(/\s|-/g, ""));
}

// Validar Fecha de Nacimiento: formato YYYY-MM-DD y mayor de 18 años
function validarFechaNacimiento(fecha) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) return false;

  const nacimiento = new Date(fecha);
  const hoy = new Date();
  const edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  return (edad > 13 || (edad === 13 && mes >= 0));
}

function normalizarFecha(valor) {

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) return false;

  const fecha = new Date(valor);

  // Verificar si es una fecha válida
  if (!isNaN(fecha.getTime())) {
    return fecha; // retorna el objeto Date
  } else {
    return false;  // no es fecha válida
  }
}

function compararFechas(fecha1, fecha2) {
  const f1 = new Date(fecha1);
  const f2 = new Date(fecha2);

  // Validar que ambas sean fechas válidas
  if (isNaN(f1.getTime()) || isNaN(f2.getTime())) {
    return null; // si alguna no es fecha válida
  }

  if (f1.getTime() > f2.getTime()) {
    return 1;   // fecha1 es mayor
  } else if (f1.getTime() < f2.getTime()) {
    return -1;  // fecha1 es menor
  } else {
    return 0;   // son iguales
  }
}
// Validar que la contraseña tenga al menos una mayuscula, una minuscula, un numero, un caracter especial y una longitud de 8 caracteres
function esPasswordFuerte(password) {
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneMinuscula = /[a-z]/.test(password);
  const tieneNumero = /\d/.test(password);
  const tieneEspecial = /[@$!%*?&]/.test(password);
  const longitudValida = password.length >= 8;

  return tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial && longitudValida;
}

// hora a 24 hs
/*
function convertirAHora24(valor, saltoMinutos = 30) {
  if (!valor) return false;
  console.log(valor)
  // Normalizar: quitar espacios y pasar a minúsculas
  let str = String(valor).trim().toLowerCase();

  // Regex para capturar hora:minutos + opcional am/pm
  const regex = /^(\d{1,2}):(\d{2})(am|pm)?$/;
  const match = str.match(regex);
  if (!match) return false;
  console.log(valor)
  let [_, hh, mm, meridiano] = match;
  hh = parseInt(hh, 10);
  mm = parseInt(mm, 10);

  // Validar minutos dentro de rango
  if (mm < 0 || mm > 59) return false;

  // Validar salto
  if (mm % saltoMinutos !== 0) return false;

  // Conversión AM/PM
  if (meridiano) {
    if (hh < 1 || hh > 12) return false; // en formato 12h solo 1–12
    if (meridiano === "pm" && hh !== 12) hh += 12;
    if (meridiano === "am" && hh === 12) hh = 0;
  }

  // Validar rango de horas en 24h
  if (hh < 0 || hh > 23) return false;

  // Formatear en HH:MM (24h)
  const horaFinal = `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
  return horaFinal;
}*/

function convertirAHora24(valor, saltoMinutos = 30) {
  if (!valor) return false;
  console.log(valor)
  // Normalizar: quitar espacios y pasar a minúsculas
  let str = String(valor).trim().toLowerCase();

  // Regex para capturar hora:minutos con opcional am/pm
  const regex = /^(\d{1,2}):(\d{2})(am|pm)?$/;
  const match = str.match(regex);
  if (!match) return valor;

  let [_, hh, mm, meridiano] = match;
  hh = parseInt(hh, 10);
  mm = parseInt(mm, 10);

  // Validar minutos dentro de rango
  if (mm < 0 || mm > 59) return false;

  // Validar salto
  if (mm % saltoMinutos !== 0) return false;

  // Conversión AM/PM si corresponde
  if (meridiano) {
    if (hh < 1 || hh > 12) return false; // en formato 12h solo 1–12
    if (meridiano === "pm" && hh !== 12) hh += 12;
    if (meridiano === "am" && hh === 12) hh = 0;
  }

  // Validar rango de horas en 24h
  if (hh < 0 || hh > 23) return false;

  // Formatear en HH:MM (24h)
  const horaFinal = `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
  return horaFinal;
}

function diferenciaHorasFormato(horaInicio, horaFin) {
  // Crear fechas ficticias con las horas dadas
  const inicio = new Date(`1970-01-01T${horaInicio}`);
  const fin = new Date(`1970-01-01T${horaFin}`);

  // Diferencia en milisegundos
  let diffMs = fin - inicio;

  // Si es negativa, significa que horaFin es del día siguiente
  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000; // sumo un día completo
  }

  // Convertir a minutos totales
  const totalMinutos = Math.floor(diffMs / (1000 * 60));

  // Calcular horas y minutos
  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  // Formatear en HH:MM
  const resultado = `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`;
  return resultado;
}

function horaToMinutos(hora) {
  const [hh, mm] = hora.split(":").map(Number);
  return hh * 60 + mm;
}

function compararHoras(hora1, hora2) {
  return horaToMinutos(hora1) >= horaToMinutos(hora2);
}


function tipoUsuario(codigo) {
  console.log(codigo)
  if (codigo == ADMIN_USER_LEVEL) {
    return "Administrador"
  }
  if (codigo == CLIENT_USER_LEVEL) {
    return "Cliente"
  }
  if (codigo == PROFESOR_USER_LEVEL) {
    return "Profesor"
  }
  if (codigo == ENTRENADOR_USER_LEVEL) {
    return "Entrenador"
  }
  return "Invalido"
};

function capitalizarPalabras(texto) {
  return texto
    .split(" ")
    .map(palabra =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(" ");
}

function capitalizarPrimera(palabra) {
  if (!palabra || palabra.length === 0) return "";
  return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
}

function normalizarTelefono(telefono) {
  // Elimina todo lo que no sea dígito o "+"
  return telefono.replace(/[^+\d]/g, "");
}

function obtenerDia(fecha) {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

  return dias[(new Date("2026-05-25")).getDay()]
}

function normalizarDia(valor) {
  /*
  const dias = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

  // Si es número → convertir a índice
  if (typeof valor === "number") {
    if (valor >= 1 && valor <= dias.length) {
      return dias[valor - 1]; // porque el array arranca en 0
    } else {
      return null; // número fuera de rango
    }
  }

  // Si es string → normalizar y buscar
  if (typeof valor === "string") {
    const diaEncontrado = dias.find(dia => dia.toLowerCase() === valor.toLowerCase());
    return diaEncontrado || null; // devuelve el día o null si no existe
  }

  // Si no es ni número ni string
  return null;*/
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  if (convertirADecimalValidado(valor)) {

    if (valor >= 1 && valor <= dias.length) {
      return dias[valor - 1]; // 1 = Lunes, 7 = Domingo
    } else {
      return null; // número fuera de rango
    }
  }
  // Función auxiliar: quita acentos y normaliza a minúsculas
  function limpiarTexto(texto) {
    return texto
      .normalize("NFD")                // descompone caracteres Unicode
      .replace(/[\u0300-\u036f]/g, "") // elimina diacríticos
      .toLowerCase();
  }

  // Si es string → normalizar y buscar
  if (typeof valor === "string") {
    const valorLimpio = limpiarTexto(valor);
    const diaEncontrado = dias.find(dia => limpiarTexto(dia) === valorLimpio);
    return diaEncontrado || null;
  }

  // Si no es ni número ni string
  return null;
}

function convertirADecimalValidado(valor, decimalesPermitidos = 0) {
  const numero = Number(valor);

  if (!Number.isNaN(numero)) {
    const factor = Math.pow(10, decimalesPermitidos);
    if (Number.isInteger(numero * factor)) {
      return numero;
    }
  }
  return false;
}

function estaEnRango(valor, minimo, maximo) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return false;
  return numero >= minimo && numero <= maximo;
}
function esPar(valor) {
  const numero = Number(valor);
  if (Number.isNaN(numero)) return false;
  return numero % 2 === 0;
}

export const methods = {
  validarNombreApellido,
  validarFechaNacimiento,
  validarDNI,
  validarEmail,
  validarTelefono,
  esPasswordFuerte,
  tipoUsuario,
  capitalizarPalabras,
  capitalizarPrimera,
  normalizarTelefono,
  normalizarDia,
  obtenerDia,
  convertirADecimalValidado,
  convertirAHora24,
  diferenciaHorasFormato,
  horaToMinutos,
  compararHoras,
  estaEnRango,
  esPar,
  compararFechas,
  normalizarFecha
}