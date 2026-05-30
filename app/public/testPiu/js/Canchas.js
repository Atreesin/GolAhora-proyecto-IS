document.addEventListener("DOMContentLoaded", () => {
    // 1. Recuperamos el ID del tipo de cancha seleccionado anteriormente
    const tipoCanchaId = localStorage.getItem("tipo_cancha") || localStorage.getItem("tipo_cancha_seleccionado");
    const contenedor = document.getElementById("tarjetas-canchas-filtradas");

    if (!contenedor) return;

    // 2. Usamos la URL correcta que aparece en tu Swagger
    const API_URL = `https://golahora-proyecto-is.onrender.com/api/canchas`;

    contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">Cargando canchas...</p>`;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            contenedor.innerHTML = ""; // Limpiamos carga

            // 3. Filtramos las canchas que coinciden con el tipo seleccionado
            // Comparamos el ID del tipo de cancha de la cancha con el ID guardado
            const canchasFiltradas = data.filter(cancha => 
                cancha.tipo_cancha && cancha.tipo_cancha.id == tipoCanchaId
            );

            if (canchasFiltradas.length === 0) {
                contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">No hay canchas disponibles para este tipo.</p>`;
                return;
            }

            // 4. Renderizamos las canchas filtradas
            canchasFiltradas.forEach(cancha => {
                const fila = document.createElement("div");
                fila.className = "col-12 mb-3 d-flex justify-content-center";
                
                fila.innerHTML = `
                    <div class="card p-4 w-100" style="max-width: 900px; border-radius: 15px;">
                        <h4 class="font-weight-bold">${cancha.club || "Club sin nombre"}</h4>
                        <p class="text-muted">Modalidad: ${cancha.tipo_cancha.tipo} | Cancha N° ${cancha.id}</p>
                        <button class="btn btn-warning" onclick="alert('Reservar ID: ${cancha.id}')">Ver Horarios</button>
                    </div>
                `;
                contenedor.appendChild(fila);
            });
        })
        .catch(err => {
            console.error(err);
            contenedor.innerHTML = `<p class="text-white text-center py-4">Error al cargar canchas. Ver consola.</p>`;
        });
});
