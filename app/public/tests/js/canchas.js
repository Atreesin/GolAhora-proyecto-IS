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
        // contenedor lista-canchas en HTML
        const contenedor = document.getElementById("lista-canchas");
        // Por cada cancha creamos una card
    canchas.forEach(cancha => {
        const card = document.createElement("div");
        card.classList.add("cancha-card");
        card.innerHTML = `
            <img src="${cancha.imagen_url}" alt="${cancha.tipo_cancha}"> alt="${cancha.tipo_cancha}">
            <div class="cancha-info">
                <h3>${cancha.tipo_cancha}</h3>
                <p><strong>Dimensiones:</strong> ${cancha.ancho}m x ${cancha.largo}m</p>
                <p><strong>Capacidad:</strong> ${cancha.capacidad} jugadores</p>
                <p><strong>Superficie:</strong> ${cancha.superficie.tipo}</p>
                <p><strong>Descripción:</strong> ${cancha.superficie.descripcion}</p>
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
