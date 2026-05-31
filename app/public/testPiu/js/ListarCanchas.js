async function obtenerDatos() {
    try {
        const respuesta = await fetch(API_URL);
        const datosCrudos = await respuesta.json();

        // 1. Agrupamos las canchas por tipo
        const canchasPorTipo = {};

        datosCrudos.forEach(data => {
            const tipo = data.tipo_cancha || "Otros"; // Si no tiene tipo, va a "Otros"
            
            if (!canchasPorTipo[tipo]) {
                canchasPorTipo[tipo] = [];
            }

            const nuevaCancha = new Cancha(/* ... tus argumentos igual que antes ... */);
            canchasPorTipo[tipo].push(nuevaCancha);
        });

        // 2. Dibujamos por cada grupo
        contenedor.innerHTML = ""; // Limpiamos antes de dibujar
        for (const tipo in canchasPorTipo) {
            // Creamos un contenedor para el título de la sección
            const titulo = document.createElement("h2");
            titulo.className = "text-center my-4";
            titulo.innerText = `Canchas de ${tipo}`;
            contenedor.appendChild(titulo);

            // Dibujamos las tarjetas de este grupo
            canchasPorTipo[tipo].forEach(cancha => {
                contenedor.appendChild(cancha.generarHTML());
            });
        }

    } catch (error) {
        console.error("Error al cargar canchas:", error);
    }
}
