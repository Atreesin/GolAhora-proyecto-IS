document.addEventListener("DOMContentLoaded", () => {
    // 1. Recuperamos el ID del tipo seleccionado
    const tipoCanchaId = localStorage.getItem("tipo_cancha");
    const contenedor = document.getElementById("tarjetas-canchas-filtradas");

    if (!contenedor) return;

    // 2. Llamada directa a la lista general de canchas (según Swagger)
    const API_URL = `https://golahora-proyecto-is.onrender.com/api/canchas`;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            contenedor.innerHTML = ""; 

            // 3. Buscamos la cancha que coincida con el ID del tipo
            // Convertimos a String ambos para asegurar comparación exitosa
            const canchaEncontrada = data.find(c => String(c.tipo_cancha.id) === String(tipoCanchaId));

            if (!canchaEncontrada) {
                contenedor.innerHTML = `<p class="text-white text-center py-4">No se encontró una cancha para este tipo (ID buscado: ${tipoCanchaId}).</p>`;
                return;
            }

            // 4. Renderizamos esa única cancha
            const fila = document.createElement("div");
            fila.className = "col-12 mb-3 d-flex justify-content-center";
            
            fila.innerHTML = `
                <div class="card p-4 w-100" style="max-width: 900px; border-radius: 15px; background-color: #ffffff;">
                    <h4 class="font-weight-bold">${canchaEncontrada.club || "Club Gol Ahora"}</h4>
                    <p class="text-muted">Modalidad: ${canchaEncontrada.tipo_cancha.tipo}</p>
                    <p class="text-muted">Cancha N° ${canchaEncontrada.id}</p>
                    <button class="btn btn-warning" onclick="alert('Reservar ID: ${canchaEncontrada.id}')">Ver Horarios</button>
                </div>
            `;
            contenedor.appendChild(fila);
        })
        .catch(err => {
            console.error(err);
            contenedor.innerHTML = `<p class="text-white text-center py-4">Error al conectar con el servidor.</p>`;
        });
});
});
