async function cargarCanchas() {
    try {
        // Asegúrate de que esta URL sea la correcta para listar todas las canchas
        const respuesta = await fetch("https://golahora-proyecto-is.onrender.com/api/canchas");
        const datos = await respuesta.json();

        const contenedor = document.getElementById("tarjetas-canchas-filtradas");
        
        if (!contenedor) return;
        contenedor.innerHTML = ""; // Limpiamos el contenedor

        // Recorremos el array de datos tal como llega
        datos.forEach(data => {
            let textoDescripcion = data.descripcion || (data.superficie ? data.superficie.descripcion : "No especificada");

            // Creamos la instancia de la clase
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

            // Agregamos la tarjeta directamente al DOM
            contenedor.appendChild(nuevaCancha.generarHTML());
        });

    } catch (error) {
        console.error("Error al cargar las canchas:", error);
        const contenedor = document.getElementById("tarjetas-canchas-filtradas");
        if (contenedor) {
            contenedor.innerHTML = `<p class="text-danger text-center">Hubo un error al cargar las canchas.</p>`;
        }
    }
}

// Ejecutamos la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarCanchas);


