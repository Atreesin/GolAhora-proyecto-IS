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

// Validar que la contraseña tenga al menos una mayuscula, una minuscula, un numero, un caracter especial y una longitud de 8 caracteres
function esPasswordFuerte(password) {
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero = /\d/.test(password);
    const tieneEspecial = /[@$!%*?&]/.test(password);
    const longitudValida = password.length >= 8;

    return tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial && longitudValida;
}

function tipoUsuario(codigo) {
    
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
    return "gorriado"
};

export const methods = {
    validarNombreApellido,
    validarFechaNacimiento,
    validarDNI,
    validarEmail,
    validarTelefono,
    esPasswordFuerte,
    tipoUsuario
}