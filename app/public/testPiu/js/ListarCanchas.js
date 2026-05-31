async function obtenerTodasLasCanchas() {
    try {
        const respuesta = await fetch("https://golahora-proyecto-is.onrender.com/api/canchas");
        const datosCrudos = await respuesta.json(); // Este array trae TODAS las canchas

        // 1. Agrupamos por tipo (esto crea los grupos automáticamente)
        const grupos = datosCrudos.reduce((acc, data) => {
            // Aseguramos que 'tipo_cancha' exista, si no, ponemos "General"
            const tipo = data.tipo_cancha || "Sin clasificar";
            
            if (!acc[tipo]) acc[tipo] = [];
            
            const nuevaCancha = new Cancha(
                data.id, data.tipo_cancha, data.duracion_min, data.duracion_max,
                data.ancho, data.largo, data.capacidad,
                data.superficie ? data.superficie.tipo : "No especificada",
                data.descripcion || "Disponible para reservar", 
                data.imagen_url
            );
            
            acc[tipo].push(nuevaCancha);
            return acc;
        }, {});

        // 2. Obtenemos las categorías y las ordenamos alfabéticamente
        const tiposOrdenados = Object.keys(grupos).sort();

        // 3. Dibujamos en el DOM
        const contenedor = document.getElementById("tarjetas-canchas-filtradas");
        contenedor.innerHTML = ""; 

        tiposOrdenados.forEach(tipo => {
            // Creamos el título de la sección
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
        console.error("Error al cargar las canchas:", error);
    }
}

// Llamamos a la función
obtenerTodasLasCanchas();
