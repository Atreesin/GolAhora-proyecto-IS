const API = "https://golahora-proyecto-is.onrender.com/api/user_info";

async function ObtenerDatosPersonales(){
    try {
        // 1. Buscamos el token que guardaste cuando el usuario inició sesión
        const token = localStorage.getItem("token");

        // Si no hay token, lo mandamos al login porque no inició sesión
        if (!token) {
            console.warn("No se encontró ningún token de autenticación.");
            window.location.href = "login.html"; 
            return;
        }

        // 2. Hacemos la petición PASANDO EL TOKEN para que la API sepa quién es
        const Respuesta = await fetch(API, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            }
        });

        // Si la API responde con un error (ej: 401 No autenticado)
        if (!Respuesta.ok) {
            throw new Error("Error en la autenticación con el servidor.");
        }

        // Accedo al body y lo transformo en JSON
        const Datos = await Respuesta.json();
        
        // Busco los campos en mi html
        const CampoNombre = document.querySelector('.input-Nombre');
        const CampoApellido = document.querySelector('.input-Apellido');
        const CampoNacionalidad = document.querySelector('.input-Nacionalidad');
        const CampoDni = document.querySelector('.input-Dni');
        const CampoGenero = document.querySelector('.input-Genero');
        const CampoEmail = document.querySelector('.input-Email');
        const CampoTelefono = document.querySelector('.input-Telefono');

        // Conecto los campos con mi DB 
        if (CampoNombre) CampoNombre.value = Datos.nombre ;
        if (CampoApellido) CampoApellido.value = Datos.apellido ;
        if (CampoNacionalidad) CampoNacionalidad.value = Datos.nacionalidad ;
        if (CampoDni) CampoDni.value = Datos.dni ;
        if (CampoGenero) CampoGenero.value = Datos.genero ;
        if (CampoTelefono) CampoTelefono.value = Datos.telefono;
        if (CampoEmail) CampoEmail.value = Datos.email ;

    } catch(error) {
        console.error("Error al obtener los datos:", error);
    }
}  

ObtenerDatosPersonales();