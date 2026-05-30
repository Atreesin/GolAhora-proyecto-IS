document.addEventListener("DOMContentLoaded", () => {
    // 1. Recuperamos el ID que guardamos en la pantalla anterior
    const tipoCanchaId = localStorage.getItem("tipo_cancha");
    const contenedor = document.getElementById("tarjetas-canchas-filtradas");

    if (!contenedor) return;

    // Si por alguna razón no hay ID, avisamos y no hacemos nada
    if (!tipoCanchaId) {
        contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">No se seleccionó ningún tipo de cancha. Volvé atrás.</p>`;
        return;
    }

    // 2. Armamos la URL exacta de la consulta que me pasaste
    const API_URL = `https://golahora-proyecto-is.onrender.com/api/tipos_canchas/cancha_id=${tipoCanchaId}`;

    contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">Buscando canchas disponibles...</p>`;

    // 3. Llamamos al backend
    fetch(API_URL)
        .then(respuesta => {
            if (!respuesta.ok) throw new Error("Error al traer las canchas del servidor");
            return respuesta.json();
        })
        .then(canchas => {
            contenedor.innerHTML = ""; // Limpiamos el mensaje de carga

            // Si la lista viene vacía
            if (canchas.length === 0) {
                contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">No hay canchas físicas registradas para este tipo en este momento.</p>`;
                return;
            }

            // 4. Recorremos el listado y creamos las tarjetas en el nuevo HTML
            canchas.forEach(cancha => {
                const fila = document.createElement("div");
                fila.className = "col-12 mb-3 d-flex justify-content-center";

                fila.innerHTML = `
                    <div class="card text-dark shadow border-0 p-4" style="max-width: 900px; width: 100%; border-radius: 15px; background-color: #ffffff !important;">
                        <div class="d-flex justify-content-between align-items-center flex-wrap">
                            <div>
                                <h4 class="font-weight-bold mb-1" style="color: #111111 !important;">
                                    ${cancha.nombre || 'Cancha Individual'}
                                </h4>
                                <p class="text-muted mb-0" style="font-size: 0.9rem;">
                                    Estado: <span class="text-success font-weight-bold">Disponible</span>
                                </p>
                            </div>
                            <button class="btn btn-warning text-dark font-weight-bold px-4 mt-2 mt-sm-0 shadow-sm" 
                                    style="border-radius: 50px; background-color: #ffc107 !important; border: none;"
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
            console.error("Error:", error);
            contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">Error al conectar con el sistema de filtrado.</p>`;
        });
});

// Función para cuando elijan la cancha definitiva
function elegirHorario(idCancha) {
    alert(`Elegiste la cancha física con ID: ${idCancha}. Acá lo mandarías a la pantalla de turnos.`);
    // window.location.href = `SeleccionarTurno.html?cancha_id=${idCancha}`;
}