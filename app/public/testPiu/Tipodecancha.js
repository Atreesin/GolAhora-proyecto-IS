class Cancha {
    constructor(id, tipo_cancha, duracion_min, duracion_max, ancho, largo, capacidad, nombre_superficie, descripcion, imagen_url) {
        this.id = id;
        this.tipo_cancha = tipo_cancha;
        this.duracion_min = duracion_min;
        this.duracion_max = duracion_max;
        this.ancho = ancho;
        this.largo = largo;
        this.capacidad = capacidad;
        this.nombre_superficie = nombre_superficie;
        this.descripcion = descripcion || "Sin descripción disponible."; // Evita el 'undefined'
        this.imagen_url = imagen_url;
    }

   generarHTML() {
        const columna = document.createElement("div");
        // Asegura que cada tarjeta ocupe todo el ancho disponible y tenga margen abajo
        columna.className = "col-12 mb-4 d-flex justify-content-center";

        columna.innerHTML = `
            <div class="card text-dark shadow border-0 overflow-hidden" 
                 style="max-width: 900px; width: 100%; border-radius: 15px; background-color: #ffffff !important;">
                <div class="row no-gutters align-items-center">
                    
                    <div class="col-md-5">
                        <img src="https://golahora-proyecto-is.onrender.com${this.imagen_url}" 
                             class="card-img w-100" 
                             style="height: 280px; object-fit: cover;" 
                             alt="${this.tipo_cancha}">
                    </div>
                    
                    <div class="col-md-7">
                        <div class="card-body p-4 text-left">
                            
                            <h3 class="card-title font-weight-bold mb-3 text-dark" style="color: #111111 !important; font-size: 1.6rem;">
                                ${this.tipo_cancha.toUpperCase()}
                            </h3>
                            
                            <ul class="list-unstyled mb-3 text-secondary" style="font-size: 0.95rem; line-height: 1.6;">
                                <li class="mb-1"><i class="fas fa-users text-primary mr-2"></i> <strong>Capacidad:</strong> ${this.capacidad} jugadores</li>
                                <li class="mb-1"><i class="fas fa-layer-group text-primary mr-2"></i> <strong>Superficie:</strong> ${this.nombre_superficie}</li>
                                <li class="mb-1"><i class="fas fa-ruler-combined text-primary mr-2"></i> <strong>Medidas:</strong> ${this.largo}m x ${this.ancho}m</li>
                                <li class="mb-1"><i class="fas fa-clock text-primary mr-2"></i> <strong>Turnos:</strong> ${this.duracion_min} min a ${this.duracion_max} min</li>
                            </ul>
                            
                            <p class="card-text text-muted mb-4" style="font-size: 0.9rem; line-height: 1.4;">
                                ${this.descripcion}
                            </p>
                            
                            <div class="text-left">
                                <button class="btn btn-warning text-dark font-weight-bold px-4 shadow-sm" 
                                        style="border-radius: 50px; background-color: #ffc107; border: none;" 
                                        type="button" 
                                        onclick="seleccionarCancha(${this.id})">
                                    Seleccionar
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `;
        
        return columna;
    }
}

let listaCanchasObjetos = [];

document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://golahora-proyecto-is.onrender.com/api/tipos_canchas";
    const contenedor = document.getElementById("tarjetas-canchas");

    if (!contenedor) return;

    fetch(API_URL)
        .then(respuesta => {
            if (!respuesta.ok) throw new Error("Error en la API");
            return respuesta.json();
        })
        .then(datosCrudos => {
            contenedor.innerHTML = ""; 
            listaCanchasObjetos = [];  

            datosCrudos.forEach(data => {
                // Captura inteligente de la descripción por si viene en el nodo raíz o en superficie
                let textoDescripcion = data.descripcion;
                if (!textoDescripcion && data.superficie) {
                    textoDescripcion = data.superficie.descripcion;
                }

                const nuevaCancha = new Cancha(
                    data.id,
                    data.tipo_cancha,
                    data.duracion_min,
                    data.duracion_max,
                    data.ancho,
                    data.largo,
                    data.capacidad,
                    data.superficie ? data.superficie.tipo : "No especificada",
                    textoDescripcion,
                    data.imagen_url
                );

                listaCanchasObjetos.push(nuevaCancha);
                contenedor.appendChild(nuevaCancha.generarHTML());
            });
        })
        .catch(error => {
            console.error("Error:", error);
            contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">Error al procesar las canchas del servidor.</p>`;
        });
});

function seleccionarCancha(id) {
    const canchaSeleccionada = listaCanchasObjetos.find(c => c.id === id);
    if (canchaSeleccionada) {
        alert(`¡Cancha elegida con éxito!\nTipo: ${canchaSeleccionada.tipo_cancha.toUpperCase()}\nSuperficie: ${canchaSeleccionada.nombre_superficie}`);
    }
}
