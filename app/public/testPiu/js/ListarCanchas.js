const API_URL = `https://golahora-proyecto-is.onrender.com/api/canchas`;

async function obtenerDatos() {
    try {
        const respuesta = await fetch(API_URL);
        const datosCrudos = await respuesta.json();

        // 1. Agrupamos las canchas por tipo
        const grupos = datosCrudos.reduce((acc, data) => {
            const tipo = data.tipo_cancha || "Sin Tipo";
            if (!acc[tipo]) acc[tipo] = [];
            
            // Creamos la instancia aquí mismo
            let textoDescripcion = data.descripcion || (data.superficie ? data.superficie.descripcion : "No especificada");
            const nuevaCancha = new Cancha(
                data.id, data.tipo_cancha, data.duracion_min, data.duracion_max,
                data.ancho, data.largo, data.capacidad,
                data.superficie ? data.superficie.tipo : "No especificada",
                textoDescripcion, data.imagen_url
            );
            
            acc[tipo].push(nuevaCancha);
            return acc;
        }, {});


        // 3. Dibujamos los títulos y sus respectivas canchas
        contenedor.innerHTML = ""; 
        tiposOrdenados.forEach(tipo => {
            // Creamos y añadimos el título
            const titulo = document.createElement("h3");
            titulo.className = "text-white mt-4 mb-3 text-center";
            titulo.textContent = `Canchas de ${tipo}`;
            contenedor.appendChild(titulo);

            // Añadimos las canchas de ese grupo
            grupos[tipo].forEach(cancha => {
                contenedor.appendChild(cancha.generarHTML());
            });
        });

    } catch (error) {
        console.error("Error al cargar canchas:", error);
        contenedor.innerHTML = `<p class="text-danger">Hubo un error al cargar las canchas.</p>`;
    }
}