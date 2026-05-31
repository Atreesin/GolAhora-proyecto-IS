const API = "https://golahora-proyecto-is.onrender.com/api";

// ==========================================
// 1. CONSULTAR LAS CANCHAS
// ==========================================   

async function obtenerCanchas() {
    const res = await fetch(API + "/tipos_canchas", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const canchas = await res.json();
    console.log("Canchas:", canchas);
    return canchas;
}

// ==========================================
// 2. MOSTRAR LAS CANCHAS EN LA PÁGINA
// ==========================================      
async function cargarCanchas() {
    try {
        // Consultamos las canchas
        const canchas = await obtenerCanchas();
        // Buscamos el contenedor en el HTML
        const contenedor = document.getElementById("lista-canchas");
        // Por cada cancha creamos una card
        canchas.forEach(cancha => {
        const card = document.createElement("div");
        card.classList.add("cancha-card");
        card.innerHTML = `
            <img src="https://golahora-proyecto-is.onrender.com${cancha.tipo_cancha.imagen_url}" alt="${cancha.tipo_cancha.tipo}">
            <div class="cancha-info">
                <h3>${cancha.tipo_cancha.tipo}</h3>
                <p><strong>Dimensiones:</strong> ${cancha.tipo_cancha.ancho}m x ${cancha.tipo_cancha.largo}m</p>
                <p><strong>Capacidad:</strong> ${cancha.tipo_cancha.capacidad} jugadores</p>
                <p><strong>Superficie:</strong> ${cancha.tipo_cancha.superficie}</p>
                <p><strong>Descripción:</strong> ${cancha.tipo_cancha.descripcion_superficie}</p>
            </div>
        `;
        contenedor.appendChild(card);
    });
    } catch (error) {
        console.error("Error al cargar las canchas:", error);
    }
}

// Llamamos a la función para cargar las canchas cuando se cargue la página
window.addEventListener("DOMContentLoaded", cargarCanchas);
