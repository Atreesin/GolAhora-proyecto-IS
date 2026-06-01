/// 1. DEFINICIÓN DE LA CLASE (Define el molde y el dibujo)
class Cancha {
    constructor(id, tipo_cancha, duracion_min, duracion_max, ancho, largo, capacidad, superficie, descripcion, imagen_url) {
        this.id = id;
        this.tipo_cancha = tipo_cancha;
        this.duracion_min = duracion_min;
        this.duracion_max = duracion_max;
        this.ancho = ancho;
        this.largo = largo;
        this.capacidad = capacidad;
        this.superficie = superficie;
        this.descripcion = descripcion;
        this.imagen_url = imagen_url;
    }

    // El método ahora pertenece a la clase y usa 'this' para acceder a sus datos
    generarHTML() {
        const fila = document.createElement("div");
        fila.className = "col-12 mb-3 d-flex justify-content-center";

        fila.innerHTML = `
            <div class="card card-entrenamientos text-dark shadow border-0 p-4 w-100" style="max-width: 900px; border-radius: 15px; background-color: #ffffff !important;">
                <div class="d-flex justify-content-between align-items-center flex-wrap">
                   <img src="https://golahora-proyecto-is.onrender.com/api${this.imagen_url}" 
                             class="card-img w-100" 
                             style="height: 280px; object-fit: cover;" 
                             alt="${this.tipo_cancha}">
                    </div>
                    <div>
                        <h4 class="font-weight-bold mb-1">Cancha:${this.id}</h4>
                        <p class="text-muted mb-0">
                            <i class="fas fa-futbol text-primary mr-1"></i> 
                            <strong>Tipo de cancha:</strong> ${this.tipo_cancha}
                        </p>
                        <p class="text-success font-weight-bold mb-0 mt-1">
                            <i class="fas fa-check-circle"></i> ${this.descripcion || "Disponible para reservar"}
                        </p>
                    </div>
                    <div class="mt-3 mt-sm-0">
                        <button class="btn btn-warning"  onclick="elegirHorario(${this.id})">>
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
    const tipoCanchaId = localStorage.getItem("tipo_cancha");
    const listaCanchasObjetos = []; // Aquí guardas tus objetos

    if (!contenedor) return;

    if (!tipoCanchaId) {
        contenedor.innerHTML = `<p class="text-white text-center py-4">No se detectó un tipo de cancha. Volvé atrás.</p>`;
        return;
    }

    const API_URL = `https://golahora-proyecto-is.onrender.com/api/tipos_canchas/tipo_cancha_id=${tipoCanchaId}/canchas`;

    async function obtenerDatos() {
        try {
            const respuesta = await fetch(API_URL);
            const datosCrudos = await respuesta.json();

            // Recorremos los datos recibidos
            datosCrudos.forEach(data => {
                // Lógica de limpieza
                let textoDescripcion = data.descripcion || (data.superficie ? data.superficie.descripcion : "No especificada");

                // Creamos la instancia de la clase
                const nuevaCancha = new Cancha(
                    data.id, data.tipo_cancha, data.duracion_min, data.duracion_max,
                    data.ancho, data.largo, data.capacidad,
                    data.superficie ? data.superficie.tipo : "No especificada",
                    textoDescripcion, data.imagen_url
                );

                // Guardamos y dibujamos
                listaCanchasObjetos.push(nuevaCancha);
                contenedor.appendChild(nuevaCancha.generarHTML());
            });
        } catch (error) {
            console.error("Error al cargar canchas:", error);
            contenedor.innerHTML = `<p class="text-danger">Hubo un error al cargar las canchas.</p>`;
        }
    }

    obtenerDatos();
});
function elegirHorario(id) { // Recibe el ID
    localStorage.setItem("cancha_id", id); // Guarda el ID recibido
    window.location.href = "Cancha"; // Redirige
}
    
