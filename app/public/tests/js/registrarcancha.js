const mensajeError = document.getElementsByClassName("error")[0];

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

            // Mapeamos los datos convirtiendo a tipos numéricos puros (int y float)
            const datosCancha = {
                nombre: document.getElementById("nombre").value.trim(),
                tiempo_cancelacion: parseInt(document.getElementById("tiempo_cancelacion").value, 10),
                precio_hora_reserva: parseFloat(document.getElementById("precio_hora_reserva").value),
                id_tipo_cancha: parseInt(tipoCanchaHidden.value, 10)
            };

            // Validación preventiva en frontend
            if (isNaN(datosCancha.tiempo_cancelacion) || isNaN(datosCancha.precio_hora_reserva) || isNaN(datosCancha.id_tipo_cancha) || !datosCancha.nombre) {
                mensajeError.textContent = "Algunos campos están vacíos o tienen valores numéricos inválidos.";
                mensajeError.classList.remove("escondido");
                return;
            }

            const res = await fetch("/api/canchas/agregar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "plataform": "web"
                    // NOTA: No mandamos X-Auth-Token. El backend leerá la cookie de sesión gracias a 'credentials'.
                },
                credentials: "include", // Esto adjunta automáticamente tu sesión activa del navegador
                body: JSON.stringify(datosCancha)
            });

            if (res.ok) {
                alert("¡Cancha registrada con éxito!");
                formulario.reset();
                tipoCanchaInput.value = "";
                tipoCanchaHidden.value = "";
            } else {
                const errorData = await res.json().catch(() => ({}));
                // Si la API te devuelve un error, lo mostramos detalladamente
                mensajeError.textContent = errorData.message || `Error del servidor (${res.status}): Verifica tu sesión o los datos.`;
                mensajeError.classList.remove("escondido");
            }

        } catch (error) {
            console.error("Error:", error);
            mensajeError.textContent = "Hubo un problema de red al conectar con el servidor.";
            mensajeError.classList.remove("escondido");
        }
    });
});
