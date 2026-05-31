const mensajeError = document.getElementsByClassName("error")[0];

// ==========================================
// LOGIN PARA OBTENER TOKEN
// ==========================================
async function obtenerToken() {
    const res = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "plataform": "web"
        },
        credentials: "include",
        body: JSON.stringify({
            email: "administrador@golahora.com",
            password: "Unaj2026@golahora"
        })
    });
    const data = await res.json();
    return data.token;
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

            // Login para obtener la cookie de sesión
            const token = await obtenerToken();

            const formData = new FormData();
            formData.append("nombre", document.getElementById("nombre").value);
            formData.append("tiempo_cancelacion", document.getElementById("tiempo_cancelacion").value);
            formData.append("precio_hora_reserva", document.getElementById("precio_hora_reserva").value);
            formData.append("id_tipo_cancha", tipoCanchaHidden.value);

            const res = await fetch("/api/canchas/agregar", {
                method: "POST",
                headers: {
                    "plataform": "web"
                },
                credentials: "include",
                body: formData
            });

            if (res.ok) {
                alert("¡Cancha registrada con éxito!");
                formulario.reset();
                tipoCanchaInput.value = "";
                tipoCanchaHidden.value = "";
            } else {
                const errorData = await res.json().catch(() => ({}));
                mensajeError.textContent = errorData.message || `Error: ${res.status}`;
                mensajeError.classList.remove("escondido");
            }

        } catch (error) {
            console.error("Error:", error);
            mensajeError.textContent = "Hubo un problema de red al conectar con el servidor.";
            mensajeError.classList.remove("escondido");
        }
    });
});
