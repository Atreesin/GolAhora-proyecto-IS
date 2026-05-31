document.addEventListener("DOMContentLoaded", () => {
    // 1. Recuperamos el ID seleccionado (probamos ambas opciones por las dudas)
    let tipoCanchaId = localStorage.getItem("tipo_cancha") 
    const contenedor = document.getElementById("tarjetas-canchas-filtradas");

    if (!contenedor) return;

    if (!tipoCanchaId) {
        contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">No se detectó ningún tipo de cancha seleccionado. Volvé atrás.</p>`;
        return;
    }

    // 2. URL de tu API
    const API_URL = `https://golahora-proyecto-is.onrender.com//api/tipos_canchas/tipo_cancha_id=${tipoCanchaId}/canchas`;

    contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">Buscando canchas disponibles...</p>`;

    // 3. Consulta al servidor
    fetch(API_URL)
        .then(respuesta => {
            if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");
            return respuesta.json();
        })
        .then(cancha => {
            contenedor.innerHTML = ""; // Limpiamos el texto de carga

            // VALIDACIÓN: Si el objeto viene vacío o no tiene ID válido
            if (!cancha || !cancha.id) {
                contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">No se encontró información para esta cancha en este momento.</p>`;
                return;
            }

            // 4. Extracción de datos según tu JSON real
            const idCanchaFisica = cancha.id; // 1
            const nombreClub = cancha.club.nombre || "Club No Especificado"; // "Club Atlético River Plate"
            
            // Accedemos de forma segura al objeto interno 'tipo_cancha'
            const infoTipo = cancha.tipo_cancha ? ; 

            // 5. Dibujamos la tarjeta individual en pantalla
            const fila = document.createElement("div");
            fila.className = "col-12 mb-3 d-flex justify-content-center";

            fila.innerHTML = `
                <div class="card text-dark shadow border-0 p-4 w-100" style="max-width: 900px; border-radius: 15px; background-color: #ffffff !important;">
                    <div class="d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                            <h4 class="font-weight-bold mb-1" style="color: #111111 !important; font-family: sans-serif; letter-spacing: 0.5px;">
                                ${nombreClub.toUpperCase()}
                            </h4>
                            <p class="text-muted mb-0" style="font-size: 0.95rem; color: #555555 !important;">
                                <i class="fas fa-futbol text-primary mr-1"></i> <strong>Modalidad:</strong> ${infoTipo} — <strong>Número:</strong> Cancha N° ${idCanchaFisica}
                            </p>
                            <p class="text-success font-weight-bold mb-0 mt-1" style="font-size: 0.85rem;">
                                <i class="fas fa-check-circle"></i> Disponible para reservar hoy
                            </p>
                        </div>
                        <div class="mt-3 mt-sm-0">
                            <button class="btn btn-warning text-dark font-weight-bold px-4 shadow-sm" 
                                    style="border-radius: 50px; background-color: #ffc107 !important; border: none; color: #000000 !important;"
                                    onclick="elegirHorario(${idCanchaFisica})">
                                Ver Horarios
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            contenedor.appendChild(fila);
        })
        .catch(error => {
            console.error("Error detallado:", error);
            contenedor.innerHTML = `
                <div class="col-12 text-center py-4">
                    <p class="text-white mb-2">Error al decodificar la información de la cancha.</p>
                    <button class="btn btn-sm btn-outline-light" style="border-radius:20px;" onclick="location.reload()">Reintentar consulta</button>
                </div>
            `;
        });
});

function elegirHorario(idCancha) {
    alert(`Elegiste la cancha física con ID: ${idCancha}. ¡Acá va tu lógica para turnos!`);
    // Ejemplo de redirección futura:
    // window.location.href = `SeleccionarTurno.html?cancha_id=${idCancha}`;
}
