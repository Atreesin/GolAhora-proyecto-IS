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
        tipoCanchaHidden.value = ""; // Limpiamos el ID si el usuario borra o cambia el texto

        if (query.length === 0) {
            suggestionsBox.style.display = "none";
            return;
        }

        // Buscamos dentro de la propiedad 'tipo_cancha' de cada objeto
        const matches = tiposCanchas.filter(t =>
            t.tipo_cancha.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            matches.forEach(t => {
                const div = document.createElement("div");
                div.textContent = t.tipo_cancha;
                div.classList.add("sugerencia-item");
                
                div.addEventListener("click", () => {
                    tipoCanchaInput.value = t.tipo_cancha; // Texto para el usuario
                    tipoCanchaHidden.value = t.id;        // ID numérico para la API
                    suggestionsBox.style.display = "none";
                });
                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = "block";
        } else {
            suggestionsBox.style.display = "none";
        }
    });

    // Cerrar sugerencias al hacer clic afuera del input
    document.addEventListener("click", (e) => {
        if (!suggestionsBox.contains(e.target) && e.target !== tipoCanchaInput) {
            suggestionsBox.style.display = "none";
        }
    });

    // ==========================================
    // ENVÍO DEL FORMULARIO (CORREGIDO A JSON)
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

            // Obtenemos el token del Administrador
            const token = await obtenerToken();

            // Construimos el JSON convirtiendo los números a sus tipos de datos correctos (int y float)
            const datosCancha = {
                nombre: document.getElementById("nombre").value,
                tiempo_cancelacion: parseInt(document.getElementById("tiempo_cancelacion").value, 10),
                precio_hora_reserva: parseFloat(document.getElementById("precio_hora_reserva").value),
                id_tipo_cancha: parseInt(tipoCanchaHidden.value, 10)
            };

            const res = await fetch("/api/canchas/agregar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Especificamos JSON obligatorio
                    "plataform": "web",
                    "X-Auth-Token": token
                },
                credentials: "include",
                body: JSON.stringify(datosCancha) // Enviamos la cadena JSON estructurada
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
