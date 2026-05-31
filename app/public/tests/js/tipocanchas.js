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
        credentials: "include", // ← guarda la cookie de sesión
        body: JSON.stringify({
            email: "administrador@golahora.com",
            password: "Unaj2026@golahora"
        })
    });
    const data = await res.json();
    return data.token;
}

document.addEventListener("DOMContentLoaded", async () => {
    const superficieInput = document.getElementById("id_superficie");
    const superficieHidden = document.getElementById("id_superficie_hidden");
    const suggestionsBox = document.getElementById("id_superficie-suggestions");
    const formulario = document.getElementById("tipo-cancha-formulario");

    let superficies = [];

    // ==========================================
    // CARGAR SUPERFICIES DESDE LA API
    // ==========================================
    try {
        const response = await fetch("/api/superficies");
        superficies = await response.json();
    } catch (error) {
        console.error("Error al cargar superficies:", error);
    }

    // ==========================================
    // AUTOCOMPLETADO DE SUPERFICIE
    // ==========================================
    superficieInput.addEventListener("input", () => {
        const query = superficieInput.value.toLowerCase();
        suggestionsBox.innerHTML = "";
        superficieHidden.value = "";

        if (query.length === 0) {
            suggestionsBox.style.display = "none";
            return;
        }

        const matches = superficies.filter(s =>
            s.tipo_superficie.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            matches.forEach(s => {
                const div = document.createElement("div");
                div.textContent = s.tipo_superficie;
                div.classList.add("sugerencia-item");

                div.addEventListener("click", () => {
                    superficieInput.value = s.tipo_superficie;
                    superficieHidden.value = s.id;
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
        if (!suggestionsBox.contains(e.target) && e.target !== superficieInput) {
            suggestionsBox.style.display = "none";
        }
    });

    // ==========================================
    // ENVÍO DEL FORMULARIO
    // ==========================================
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!superficieHidden.value) {
            mensajeError.textContent = "Por favor seleccioná una superficie válida de la lista.";
            mensajeError.classList.remove("escondido");
            return;
        }

        try {
            mensajeError.classList.add("escondido");

            // Primero obtenemos el token
            const token = await obtenerToken();

            // Armamos el FormData con los datos del formulario
            const formData = new FormData(formulario);

            const response = await fetch("/api/tipos_cancha/agregar", {
                method: "POST",
                headers: {
                    "plataform": "web"
                    // ← sin X-Auth-Token, la cookie se envía automáticamente
                },
                credentials: "include", // ← esto le dice al navegador que incluya las cookies
                body: formData
            });

            if (response.ok) {
                alert("¡Tipo de cancha registrado con éxito!");
                formulario.reset();
                superficieInput.value = "";
                superficieHidden.value = "";
            } else {
                const errorData = await response.json().catch(() => ({}));
                mensajeError.textContent = errorData.message || `Error: ${response.status}`;
                mensajeError.classList.remove("escondido");
            }

        } catch (error) {
            console.error("Error:", error);
            mensajeError.textContent = "Hubo un problema de red al conectar con el servidor.";
            mensajeError.classList.remove("escondido");
        }
    });
});
