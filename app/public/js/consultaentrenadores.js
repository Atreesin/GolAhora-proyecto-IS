const API = "https://golahora-proyecto-is.onrender.com/api";



async function obtenerEntrenadores(token) {
    const res = await fetch(API + "/entrenadores", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token // enviamos el token
        }
    });

    const entrenadores = await res.json();
    console.log("Entrenadores:", entrenadores);
    return entrenadores;
}

// ==========================================
// 3. MOSTRAR LOS ENTRENADORES EN LA PÁGINA
// ==========================================
async function cargarEntrenadores() {
    try {
        // Primero hacemos login para obtener el token
        const token = await obtenerToken();

        // Con el token consultamos los entrenadores
        const entrenadores = await obtenerEntrenadores(token);

        // Buscamos el contenedor en el HTML
        const contenedor = document.getElementById("lista-entrenadores");

        // Por cada entrenador creamos una fila
        entrenadores.forEach(entrenador => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${entrenador.nombre}</td>
                <td>${entrenador.apellido}</td>
                <td>${entrenador.email}</td>
                <td>${entrenador.dni}</td>
                <td>${entrenador.telefono}</td>
            `;
            contenedor.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar entrenadores:", error);
    }
}

// Ejecuta cuando carga la página
document.addEventListener("DOMContentLoaded", cargarEntrenadores);