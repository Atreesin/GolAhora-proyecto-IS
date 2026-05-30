// 1. EL MOLDE (LA CLASE) EN BASE A TU JSON REAL
class Cancha {
    constructor(id, tipo_cancha, duracion_min, duracion_max, ancho, largo, capacidad, nombre_superficie, descripcion, imagen_url) {
        this.id = id;
        this.tipo_cancha = tipo_cancha;
        this.duracion_min = duracion_min;
        this.duracion_max = duracion_max;
        this.ancho = ancho;
        this.largo = largo;
        this.capacidad = capacidad;
        this.nombre_superficie = nombre_superficie; // Guarda el texto dentro de superficie.tipo
        this.descripcion = descripcion;
        this.imagen_url = imagen_url;
    }

    // Método para fabricar la tarjeta HTML horizontal
    generarHTML() {
        const columna = document.createElement("div");
        columna.className = "col-12 col-md-12 mb-4 mx-auto";

        columna.innerHTML = `
            <div class="card card-Tipocancha overflow-hidden border-0 shadow bg-white" 
                 style="border-radius: 20px; max-width: 750px; margin: 0 auto; background-color: #ffffff !important;">
                
                <div class="row g-0 align-items-center">
                    
                    <div class="col-12 col-md-4" id="Fototipodecancha-${this.id}">
                        <img src="https://golahora-proyecto-is.onrender.com${this.imagen_url}" 
                             class="w-100" 
                             style="height: 100%; min-height: 200px; object-fit: cover;" 
                             alt="${this.tipo_cancha}">
                    </div>
                    
                    <div class="col-12 col-md-8 bg-white" style="background-color: #ffffff !important;">
                        <div class="card-body bg-white p-4 text-start" id="infotipodecancha-${this.id}" style="background-color: #ffffff !important;">
                            
                            <h3 class="fs-4 fw-bold text-dark mb-3">${this.tipo_cancha.toUpperCase()}</h3>
                            <h4 class="fs-6 text-muted mb-2">Capacidad: ${this.capacidad} jugadores</h4>
                            <h4 class="fs-6 text-muted mb-2">Superficie: ${this.nombre_superficie}</h4>
                            <h4 class="fs-6 text-muted mb-2">Medidas: ${this.largo}m x ${this.ancho}m</h4>
                            <h4 class="fs-6 text-muted mb-3">Turnos: ${this.duracion_min} min a ${this.duracion_max} min</h4>
                            
                            <p class="small text-secondary mb-0">${this.descripcion}</p>
                            
                            <div class="text-end mt-3">
                                <button class="btn btn-warning text-dark fw-bold px-4 rounded-pill" 
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

// 2. ARREGLO GLOBAL
let listaCanchasObjetos = [];

// 3. FETCH CON EXTRACCIÓN DINÁMICA
document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://golahora-proyecto-is.onrender.com/api/tipos_canchas";
    const contenedor = document.getElementById("tarjetas-canchas");

    // Validamos que el contenedor exista para evitar errores en consola
    if (!contenedor) {
        console.error("No se encontró el contenedor con id 'tarjetas-canchas' en tu HTML.");
        return;
    }

    fetch(API_URL)
        .then(respuesta => {
            if (!respuesta.ok) throw new Error("Error al conectar con la API");
            return respuesta.json();
        })
        .then(datosCrudos => {
            contenedor.innerHTML = ""; 
            listaCanchasObjetos = [];  

            datosCrudos.forEach(data => {
                // Ajustamos la extracción para que coincida EXACTAMENTE con tu pantalla de Swagger/API
                const nuevaCancha = new Cancha(
                    data.id,
                    data.tipo_cancha,
                    data.duracion_min,
                    data.duracion_max,
                    data.ancho,
                    data.largo,
                    data.capacidad,
                    data.superficie ? data.superficie.tipo : "No especificada", // Entra al objeto interno de superficie
                    data.descripcion,
                    data.imagen_url
                );

                listaCanchasObjetos.push(nuevaCancha);
                contenedor.appendChild(nuevaCancha.generarHTML());
            });

            console.log("¡Objetos mapeados con éxito desde el servidor!", listaCanchasObjetos);
        })
        .catch(error => {
            console.error("Error en la petición:", error);
            contenedor.innerHTML = `<p class="text-white text-center py-4">Error al procesar las canchas del servidor.</p>`;
        });
});

// 4. FUNCIÓN DE SELECCIÓN
function seleccionarCancha(id) {
    const canchaSeleccionada = listaCanchasObjetos.find(c => c.id === id);
    if (canchaSeleccionada) {
        alert(`Elegiste: ${canchaSeleccionada.tipo_cancha.toUpperCase()}\nSuperficie: ${canchaSeleccionada.nombre_superficie}`);
    }
}