const mensajeError = document.getElementsByClassName("error")[0];

// ==========================================
// FUNCIÓN PARA LEER COOKIES DEL NAVEGADOR
// ==========================================
function obtenerCookie(nombre) {
    const valor = `; ${document.cookie}`;
    const partes = valor.split(`; ${nombre}=`);
    if (partes.length === 2) return partes.pop().split(';').shift();
    return null;
}

document.addEventListener("DOMContentLoaded", async () => {
    const tipoCanchaInput = document.getElementById("id_tipo_cancha");
    const tipoCanchaHidden = document.getElementById("id_tipo_cancha_hidden");
    const suggestionsBox = document.getElementById("tipo_cancha-suggestions");
    const formulario = document.getElementById("cancha-formulario");

    let tiposCanchas = [];

    // ==========================================
    // CARGAR TIPOS DE CANCHAS DESDE LA API
    // ==========================================
    try {
        const response = await fetch("/api/tipos_canchas");
        tiposCanchas = await response.json();
    } catch (error) {
        console.error("Error al cargar tipos de canchas:", error);
    }

    // ==========================================
    // AUTOCOMPLETADO TIPO DE CANCHA
    // ==========================================
    tipoCanchaInput.addEventListener("input", () => {
        const query = tipoCanchaInput.value.toLowerCase();
        suggestionsBox.innerHTML = "";
        tipoCanchaHidden.value = ""; 

        if (query.length === 0) {
            suggestionsBox.style.display = "none";
            return;
        }

        const matches = tiposCanchas.filter(t =>
            t.tipo_cancha.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            matches.forEach(t => {
                const div = document.createElement("div");
                div.textContent = t.tipo_cancha;
                div.classList.add("sugerencia-item");
                
                div.addEventListener("click", () => {
                    tipoCanchaInput.value = t.tipo_cancha; 
                    tipoCanchaHidden.value = t.id;        
                    suggestionsBox.style.display = "none";
                });
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = "block";
        } else {
            suggestionsBox.style.display = "none";
        }
    });

    document.addEventListener("click", (e) => {
        if (!suggestionsBox.contains(e.target) && e.target !== tipoCanchaInput) {
            suggestionsBox.style.display = "none";
        }
    });

    // ==========================================
    // ENVÍO DEL FORMULARIO 
    // ==========================================
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!tipoCanchaHidden.value) {
            mensajeError.textContent = "Por favor seleccioná un tipo de cancha válido de la lista.";
            mensajeError.classList.remove("escondido");
            return;
        }

        try {
            mensajeError.classList.add("escondido");

            // 1. Intentamos leer la cookie X-Auth-Token que creó tu Login previo
            let tokenCookie = obtenerCookie("X-Auth-Token");

            // Si la cookie existe pero no viene con el prefijo "jwt=", se lo agregamos dinámicamente
            if (tokenCookie && !tokenCookie.startsWith("jwt=")) {
                tokenCookie = `jwt=${tokenCookie}`;
            }

            // 2. Mapeo estricto de propiedades en formato JSON numérico
            const datosCancha = {
                nombre: document.getElementById("nombre").value.trim(),
                tiempo_cancelacion: parseInt(document.getElementById("tiempo_cancelacion").value, 10),
                precio_hora_reserva: parseFloat(document.getElementById("precio_hora_reserva").value),
                id_tipo_cancha: parseInt(tipoCanchaHidden.value, 10)
            };

            // 3. Cabeceras requeridas según las especificaciones de tu Swagger
            const cabeceras = {
                "Content-Type": "application/json",
                "plataform": "web"
            };

            // Si encontramos la cookie en el navegador, la inyectamos también como cabecera por seguridad
            if (tokenCookie) {
                cabeceras["X-Auth-Token"] = tokenCookie;
            }

            const res = await fetch("/api/canchas/agregar", {
                method: "POST",
                headers: cabeceras,
                credentials: "include", // Envía las cookies nativas automáticamente
                body: JSON.stringify(datosCancha)
            });

            if (res.ok) {
                alert("¡Cancha registrada con éxito!");
                formulario.reset();
                tipoCanchaInput.value = "";
                tipoCanchaHidden.value = "";
            } else {
                const errorData = await res.json().catch(() => ({}));
                mensajeError.textContent = errorData.message || `Error del servidor (${res.status}): No autorizado o faltan datos.`;
                mensajeError.classList.remove("escondido");
            }

        } catch (error) {
            console.error("Error:", error);
            mensajeError.textContent = "Hubo un problema de red al conectar con el servidor.";
            mensajeError.classList.remove("escondido");
        }
    });
});
