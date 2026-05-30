document.addEventListener("DOMContentLoaded", () => {
    // 1. Recuperamos el ID que seleccionó el usuario
    const tipoCanchaId = localStorage.getItem("tipo_cancha_seleccionado");
    const contenedor = document.getElementById("tarjetas-canchas-filtradas");

    if (!contenedor) return;

    if (!tipoCanchaId) {
        contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">No se seleccionó ningún tipo de cancha. Volvé atrás.</p>`;
        return;
    }

    // 2. URL del endpoint del servidor
    const API_URL = `https://golahora-proyecto-is.onrender.com/api/tipos_canchas/tipo_cancha_id=${tipoCanchaId}/canchas`;

    contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">Buscando canchas disponibles...</p>`;

    // 3. Consulta al servidor
    fetch(API_URL)
        .then(respuesta => {
            if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");
            return respuesta.json();
        })
        .then(datos => {
            contenedor.innerHTML = ""; // Limpiamos el texto de carga

            // BLINDAJE: Si los datos vienen dentro de una propiedad (ej. datos.canchas), los extraemos
            let listaCanchas = Array.isArray(datos) ? datos : (datos.canchas || []);

            if (listaCanchas.length === 0) {
                contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">No hay canchas individuales registradas para este tipo en este momento.</p>`;
                return;
            }

            // 4. Renderizamos las canchas devueltas
            listaCanchas.forEach(cancha => {
                const fila = document.createElement("div");
                fila.className = "col-12 mb-3 d-flex justify-content-center";

                // Usamos las propiedades 'nombre' o 'nombre_cancha' según lo que use tu base de datos
                const nombreMostrar = cancha.nombre || cancha.nombre_cancha || `Cancha Nro N° ${cancha.id}`;

                fila.innerHTML = `
                    <div class="card text-dark shadow border-0 p-4 w-100" style="max-width: 900px; border-radius: 15px; background-color: #ffffff !important;">
                        <div class="d-flex justify-content-between align-items-center flex-wrap">
                            <div>
                                <h4 class="font-weight-bold mb-1" style="color: #111111 !important; font-family: sans-serif;">
                                    ${nombreMostrar.toUpperCase()}
                                </h4>
                                <p class="text-muted mb-0" style="font-size: 0.9rem;">
                                    Estado: <span class="text-success font-weight-bold">Disponible para reservar</span>
                                </p>
                            </div>
                            <button class="btn btn-warning text-dark font-weight-bold px-4 mt-2 mt-sm-0 shadow-sm" 
                                    style="border-radius: 50px; background-color: #ffc107 !important; border: none; color: #000000 !important;"
                                    onclick="elegirHorario(${cancha.id})">
                                Ver Horarios
                            </button>
                        </div>
                    </div>
                `;
                contenedor.appendChild(fila);
            });
        })
        .catch(error => {
            console.error("Error detallado:", error);
            contenedor.innerHTML = `
                <div class="col-12 text-center py-4">
                    <p class="text-white mb-2">Error al procesar los datos de las canchas.</p>
                    <button class="btn btn-sm btn-outline-light" style="border-radius:20px;" onclick="location.reload()">Reintentar consulta</button>
                </div>
            `;
        });
});

function elegirHorario(idCancha) {
    alert(`Elegiste la cancha física con ID: ${idCancha}. ¡Acá va tu lógica para turnos!`);
}cha física con ID: ${idCancha}. Acá lo mandarías a la pantalla de turnos.`);
    // window.location.href = `SeleccionarTurno.html?cancha_id=${idCancha}`;
}
