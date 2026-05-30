document.addEventListener("DOMContentLoaded", () => {
    // Recuperamos el ID seleccionado
    let tipoCanchaId = localStorage.getItem("tipo_cancha") || localStorage.getItem("tipo_cancha_seleccionado");
    const contenedor = document.getElementById("tarjetas-canchas-filtradas");

    if (!contenedor) return;

    if (!tipoCanchaId) {
        contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">No se detectó ningún tipo de cancha.</p>`;
        return;
    }

    const API_URL = `https://golahora-proyecto-is.onrender.com/api/tipos_canchas/cancha_id=${tipoCanchaId}/canchas`;

    contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">Cargando datos...</p>`;

    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error("Error en la respuesta: " + response.status);
            return response.json();
        })
        .then(cancha => {
            contenedor.innerHTML = ""; // Limpiamos pantalla

            // Validamos que el objeto tenga al menos un ID
            if (!cancha || typeof cancha.id === 'undefined') {
                throw new Error("Formato de datos inválido");
            }

            // Datos extraídos del JSON
            const clubNombre = cancha.club || "Sin nombre";
            const tipoNombre = (cancha.tipo_cancha && cancha.tipo_cancha.tipo) ? cancha.tipo_cancha.tipo : "N/A";
            const idFisico = cancha.id;

            // Renderizamos la tarjeta
            const div = document.createElement("div");
            div.className = "col-12 mb-3 d-flex justify-content-center";
            div.innerHTML = `
                <div class="card p-4 w-100" style="max-width: 900px; border-radius: 15px; background-color: #ffffff !important;">
                    <h4 class="font-weight-bold">${clubNombre.toUpperCase()}</h4>
                    <p class="text-muted">Modalidad: ${tipoNombre} | Cancha N° ${idFisico}</p>
                    <button class="btn btn-warning" onclick="alert('ID: ${idFisico}')">Ver Horarios</button>
                </div>
            `;
            contenedor.appendChild(div);
        })
        .catch(err => {
            console.error("Error capturado:", err);
            contenedor.innerHTML = `
                <div class="text-center text-white">
                    <p>Error: ${err.message}</p>
                    <button class="btn btn-outline-light" onclick="location.reload()">Reintentar</button>
                </div>
            `;
        });
});
