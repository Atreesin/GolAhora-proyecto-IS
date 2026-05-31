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
                <img src="${cancha.imagen}" alt="${cancha.nombre}">
                <h3>${cancha.nombre}</h3>
                <p>${cancha.descripcion}</p>    
                <p>Precio por hora: $${cancha.precio_hora}</p>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar las canchas:", error);
    }
}

// Llamamos a la función para cargar las canchas cuando se cargue la página
window.addEventListener("DOMContentLoaded", cargarCanchas);