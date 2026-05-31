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
       <img src="https://golahora-proyecto-is.onrender.com/api/img/canchas/${cancha.imagen_url.split('/').pop()}" 
         alt="${cancha.tipo_cancha}"
         onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Sin+imagen'">
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

// ==========================================
// 3. CONSULTAR LAS CANCHAS REALES
// ==========================================
async function obtenerCanchasReales() {
    const res = await fetch("/api/canchas", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const canchas = await res.json();
    console.log("Canchas reales:", canchas);
    return canchas;
}

// ==========================================
// 4. MOSTRAR LAS CANCHAS REALES EN LA PÁGINA
// ==========================================
async function cargarCanchasReales() {
    try {
        const canchas = await obtenerCanchasReales();
        const contenedor = document.getElementById("lista-canchas-reales");

        canchas.forEach(cancha => {
            const card = document.createElement("div");
            card.classList.add("cancha-card");
            card.innerHTML = `
            <img src="https://golahora-proyecto-is.onrender.com/api/img/canchas/${cancha.imagen_url.split('/').pop()}" 
                 alt="${cancha.nombre}"
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Sin+imagen'">
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Sin+imagen'">
                <div class="cancha-info">
                    <h3>${cancha.nombre}</h3>
                    <p><strong>Tipo:</strong> ${cancha.tipo_cancha}</p>
                    <p><strong>Club:</strong> ${cancha.club.nombre}</p>
                    <p><strong>Dimensiones:</strong> ${cancha.ancho}m x ${cancha.largo}m</p>
                    <p><strong>Capacidad:</strong> ${cancha.capacidad} jugadores</p>
                    <p><strong>Superficie:</strong> ${cancha.superficie.tipo ?? "No especificada"}</p>
                    <p><strong>Precio por hora:</strong> $${cancha.precio_hora_reserva}</p>
                </div>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        console.error("Error al cargar canchas:", error);
    }
}

// UN SOLO DOMContentLoaded QUE LLAMA A LAS DOS FUNCIONES
window.addEventListener("DOMContentLoaded", () => {
    cargarCanchas();        // tipos de canchas
    cargarCanchasReales();  // canchas reales
});
