class disponibilidad {
    constructor(id_disponibilidad, dia_semana, hora_inicio, hora_fin, id_cancha) {
        this.id_disponibilidad = id_disponibilidad;
        this.dia_semana = dia_semana;
        this.hora_inicio = hora_inicio;
        this.hora_fin = hora_fin;
        this.id_cancha = id_cancha;
      
    }

    // El método ahora pertenece a la clase y usa 'this' para acceder a sus datos
    generarHTML() {
        const fila = document.createElement("div");
        fila.className = "col-12 mb-3 d-flex justify-content-center";

        fila.innerHTML = `
            <div class="card text-dark shadow border-0 p-4 w-100" style="max-width: 900px; border-radius: 15px; background-color: #ffffff !important;">
                <div class="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                        <h4 class="font-weight-bold mb-1">Dia :${this.dia_semana}</h4>
                        <p class="text-muted mb-0">
                            <i class="fas fa-futbol text-primary mr-1"></i> 
                            <strong>Horario de inicio:</strong> ${this.hora_inicio}
                        </p>
                        <p class="text-success font-weight-bold mb-0 mt-1">
                            <i class="fas fa-check-circle"></i>
                             <strong>Horario de Fin:</strong> ${this.hora_fin}
                        </p>
                    </div>
                    <div class="mt-3 mt-sm-0">
                        <button class="btn btn-warning"  onclick="localStorage.setItem('cancha_id', ${this.id})">>
                            Ver Horarios
                        </button>
                    </div>
                </div>
            </div>
        `;
        return fila;
    }
}

// 2. LÓGICA DE LA API
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("tarjetas-canchas-filtradas");
    const CanchaId = localStorage.getItem("cancha_id");
    const listaHorariosObjetos = []; // Aquí guardas tus objetos

    if (!contenedor) return;

    if (!tipoCanchaId) {
        contenedor.innerHTML = `<p class="text-white text-center py-4">No se detectó un tipo de cancha. Volvé atrás.</p>`;
        return;
    }

    const API_URL = `https://golahora-proyecto-is.onrender.com/api/disponibilidad/cancha_id=${CanchaId}7disponibilidad`;

    async function obtenerDatos() {
        try {
            const respuesta = await fetch(API_URL);
            const datosCrudos = await respuesta.json();

            // Recorremos los datos recibidos
            datosCrudos.forEach(data => {
                

                // Creamos la instancia de la clase
                const nuevaDisponibilidad = new disponibilidad(
                    data.id_cancha, data.dia_semana, data.hora_inicio, data.hora_fin,
                    data.id_cancha
                );

                // Guardamos y dibujamos
                listaCanchasObjetos.push(nuevaDisponibilidad);
                contenedor.appendChild(nuevaDisponibilidad.generarHTML());
            });
        } catch (error) {
            console.error("Error al cargar canchas:", error);
            contenedor.innerHTML = `<p class="text-danger">Hubo un error al cargar disponibilidad de  canchas.</p>`;
        }
    }

    obtenerDatos();
});
function elegirHorario(cancha_id) {
    // Guardamos el ID de la cancha seleccionada para usarlo en la siguiente página
    localStorage.setItem("cancha_id", id);
    
    // Redirigimos al usuario a la página de horarios
    window.location.href = "Disponibilidad_cancha.html"; 
}