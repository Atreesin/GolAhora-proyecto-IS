// 1. DEFINIMOS EL MOLDE (LA CLASE) PARA NUESTROS OBJETOS
class Cancha {
    constructor(id, tipo, duracion_min, duracion_max, ancho, largo, capacidad, superficie, descripcion_superficie, imagen_url) {
        this.id = id;
        this.tipo = tipo;
        this.duracion_min = duracion_min;
        this.duracion_max = duracion_max;
        this.ancho = ancho;
        this.largo = largo;
        this.capacidad = capacidad;
        this.superficie = superficie;
        this.descripcion_superficie = descripcion_superficie;
        this.imagen_url = imagen_url;
    }

    // Método propio del objeto para armar únicamente su tarjeta horizontal
    generarHTML() {
        const columna = document.createElement("div");
        columna.className = "col-12 col-md-12 mb-4 mx-auto";

        columna.innerHTML = `
            <div class="card card-Tipocancha overflow-hidden border-0 shadow bg-white" 
                 style="border-radius: 20px; max-width: 750px; margin: 0 auto; background-color: #ffffff !important;">
                
                <div class="row g-0 align-items-center">
                    
                    <div class="col-12 col-md-4" id="Fototipodecancha-${this.id}">
                        <img src="${this.imagen_url}" class="w-100" style="height: 100%; min-height: 200px; object-fit: cover;" alt="${this.tipo}">
                    </div>
                    
                    <div class="col-12 col-md-8 bg-white" style="background-color: #ffffff !important;">
                        <div class="card-body bg-white p-4 text-start" id="infotipodecancha-${this.id}" style="background-color: #ffffff !important;">
                            
                            <h3 class="fs-4 fw-bold text-dark mb-3">${this.tipo.toUpperCase()}</h3>
                            <h4 class="fs-6 text-dark mb-2">Capacidad: ${this.capacidad} jugadores</h4>
                            <h4 class="fs-6 text-dark mb-2">Superficie: ${this.superficie}</h4>
                            <h4 class="fs-6 text-dark mb-2">Medidas: ${this.largo}m x ${this.ancho}m</h4>
                            <h4 class="fs-6 text-dark mb-3">Turnos: ${this.duracion_min}hs a ${this.duracion_max}hs</h4>
                            
                            <p class="small text-secondary mb-0">${this.descripcion_superficie}</p>
                            
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

// 2. ARREGLO GLOBAL DONDE GUARDAREMOS LOS OBJETOS INSTANCIADOS
let listaCanchasObjetos = [];

// 3. CONSULTA A LA API Y CREACIÓN DE OBJETOS
document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://golahora-proyecto-is.onrender.com/api/tipos_canchas";
    // APUNTAMOS AL ID DE LA FILA INTERNA PARA NO BORRAR EL FONDO NI EL TÍTULO
    const contenedor = document.getElementById("tarjetas-canchas");

    fetch(API_URL)
        .then(respuesta => {
            if (!respuesta.ok) throw new Error("Error en la API");
            return respuesta.json();
        })
        .then(datosCrudos => {
            contenedor.innerHTML = ""; 
            listaCanchasObjetos = [];  

            datosCrudos.forEach(data => {
                // CORREGIDO: Emparejamos los parámetros exactos con las propiedades del JSON de tu Backend
                const nuevaCancha = new Cancha(
                    data.id,
                    data.tipo,
                    data.duracion_min,
                    data.duracion_max,
                    data.ancho,
                    data.largo,
                    data.capacidad,
                    data.superficie,
                    data.descripcion_superficie,
                    data.imagen_url
                );

                listaCanchasObjetos.push(nuevaCancha);
                contenedor.appendChild(nuevaCancha.generarHTML());
            });

            console.log("¡Objetos de canchas creados e inyectados!", listaCanchasObjetos);
        })
        .catch(error => {
            console.error("Error:", error);
            contenedor.innerHTML = `<p class="text-white text-center py-4">Error al procesar las canchas del servidor.</p>`;
        });
});

// Función de respuesta al hacer clic
function seleccionarCancha(id) {
    const canchaSeleccionada = listaCanchasObjetos.find(c => c.id === id);
    if (canchaSeleccionada) {
        // CORREGIDO: Ajustado para usar .tipo en lugar de .nombre que ya no existe en tu clase
        alert(`Elegiste el tipo de cancha: ${canchaSeleccionada.tipo.toUpperCase()}\nCapacidad máxima: ${canchaSeleccionada.capacidad} personas.`);
    }
}
