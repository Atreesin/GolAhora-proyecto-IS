document.addEventListener("DOMContentLoaded", () => {
    // Recuperamos el ID seleccionado
    let tipoCanchaId = localStorage.getItem("tipo_cancha") || localStorage.getItem("tipo_cancha_seleccionado");
    const contenedor = document.getElementById("tarjetas-canchas-filtradas");

    if (!contenedor) return;

    if (!tipoCanchaId) {
        contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">No se detectó ningún tipo de cancha seleccionado.</p>`;
        return;
    }

    // URL de diagnóstico: vamos a mostrarla para ver qué está pasando
    const API_URL = `https://golahora-proyecto-is.onrender.com/api/tipos_canchas/cancha_id=${tipoCanchaId}/canchas`;

    contenedor.innerHTML = `<p class="text-white text-center py-4 w-100">Consultando: ${API_URL}</p>`;

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                // Aquí capturamos el 404
                throw new Error(`Error en la respuesta: ${response.status} - URL consultada: ${API_URL}`);
            }
            return response.json();
        })
        .then(cancha => {
            // ... (tu lógica de renderizado aquí)
        })
        .catch(err => {
            console.error("Error capturado:", err);
            contenedor.innerHTML = `
                <div class="text-center text-white">
                    <p style="word-break: break-all;">${err.message}</p>
                    <button class="btn btn-outline-light" onclick="location.reload()">Reintentar</button>
                </div>
            `;
        });
});
