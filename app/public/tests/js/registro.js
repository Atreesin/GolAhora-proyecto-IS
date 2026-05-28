const API = "https://golahora-proyecto-is.onrender.com/api";

const mensajeError = document.getElementsByClassName("error")[0];

// =========================
// NACIONALIDAD
// =========================
document.addEventListener("DOMContentLoaded", async () => {

    const paisInput = document.getElementById("nacionalidad");
    const suggestionsBox = document.getElementById("nacionalidad-suggestions");

    let paises = [];

    // Obtener países desde la API
    try {

        const response = await fetch(API + "/paises");
        paises = await response.json();

        console.log("Paises:", paises);

    } catch (error) {

        console.error("Error al cargar países:", error);

    }

    // Evento escritura
    paisInput.addEventListener("input", () => {

        const query = paisInput.value.toLowerCase();

        suggestionsBox.innerHTML = "";

        if (query.length === 0) {

            suggestionsBox.style.display = "none";
            return;

        }

        // Filtrar países
        const matches = paises.filter(p =>
            p.toLowerCase().includes(query)
        );

        if (matches.length > 0) {

            matches.forEach(p => {

                const div = document.createElement("div");

                div.classList.add("sugerencia-item");

                div.textContent = p;

                div.addEventListener("click", () => {

                    paisInput.value = p;

                    suggestionsBox.style.display = "none";

                });

                suggestionsBox.appendChild(div);

            });

            suggestionsBox.style.display = "block";

        } else {

            suggestionsBox.style.display = "none";

        }

    });

    // Ocultar sugerencias al hacer click afuera
    document.addEventListener("click", (e) => {

        if (
            !suggestionsBox.contains(e.target) &&
            e.target !== paisInput
        ) {

            suggestionsBox.style.display = "none";

        }

    });

});

// =========================
// GENERO
// =========================
document.addEventListener("DOMContentLoaded", async () => {

    const generoInput = document.getElementById("genero");
    const suggestionsBox = document.getElementById("genero-suggestions");

    let generos = [];

    // Obtener géneros desde la API
    try {

        const response = await fetch(API + "/generos");
        generos = await response.json();

        console.log("Generos:", generos);

    } catch (error) {

        console.error("Error al cargar géneros:", error);

    }

    // Evento escritura
    generoInput.addEventListener("input", () => {

        const query = generoInput.value.toLowerCase();

        suggestionsBox.innerHTML = "";

        if (query.length === 0) {

            suggestionsBox.style.display = "none";
            return;

        }

        // Filtrar géneros
        const matches = generos.filter(g =>
            g.toLowerCase().includes(query)
        );

        if (matches.length > 0) {

            matches.forEach(g => {

                const div = document.createElement("div");

                div.classList.add("sugerencia-item");

                div.textContent = g;

                div.addEventListener("click", () => {

                    generoInput.value = g;

                    suggestionsBox.style.display = "none";

                });

                suggestionsBox.appendChild(div);

            });

            suggestionsBox.style.display = "block";

        } else {

            suggestionsBox.style.display = "none";

        }

    });

    // Ocultar sugerencias al hacer click afuera
    document.addEventListener("click", (e) => {

        if (
            !suggestionsBox.contains(e.target) &&
            e.target !== generoInput
        ) {

            suggestionsBox.style.display = "none";

        }

    });

});

// =========================
// PAIS
// =========================
document.addEventListener("DOMContentLoaded", async () => {

    const paisInput = document.getElementById("pais");
    const suggestionsBox = document.getElementById("pais-suggestions");

    let paises = [];

    // Obtener países desde la API
    try {

        const response = await fetch(API + "/paises");
        paises = await response.json();

    } catch (error) {

        console.error("Error al cargar países:", error);

    }

    // Evento escritura
    paisInput.addEventListener("input", () => {

        const query = paisInput.value.toLowerCase();

        suggestionsBox.innerHTML = "";

        if (query.length === 0) {

            suggestionsBox.style.display = "none";
            return;

        }

        // Filtrar países
        const matches = paises.filter(p =>
            p.toLowerCase().includes(query)
        );

        if (matches.length > 0) {

            matches.forEach(p => {

                const div = document.createElement("div");

                div.classList.add("sugerencia-item");

                div.textContent = p;

                div.addEventListener("click", () => {

                    paisInput.value = p;

                    suggestionsBox.style.display = "none";

                });

                suggestionsBox.appendChild(div);

            });

            suggestionsBox.style.display = "block";

        } else {

            suggestionsBox.style.display = "none";

        }

    });

    // Ocultar sugerencias al hacer click afuera
    document.addEventListener("click", (e) => {

        if (
            !suggestionsBox.contains(e.target) &&
            e.target !== paisInput
        ) {

            suggestionsBox.style.display = "none";

        }

    });

});

// =========================
// REGISTER
// =========================
document.getElementById("register-form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const res = await fetch(API + "/register", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "plataform": "web"
        },

        body: JSON.stringify({

            nombre: e.target.children.nombre.value,
            apellido: e.target.children.apellido.value,
            nacionalidad: e.target.children.nacionalidad.value,
            dni: e.target.children.dni.value,
            genero: e.target.children.genero.value,
            fecha_nacimiento: e.target.children.fecha_nacimiento.value,
            telefono: e.target.children.telefono.value,
            email: e.target.children.email.value,
            password: e.target.children.password.value,
            confirm_password: e.target.children.confirm_password.value,
            calle: e.target.children.calle.value,
            numero: e.target.children.numero.value,
            codigo_postal: e.target.children.codigo_postal.value,
            pais: e.target.children.pais.value,
            provincia: e.target.children.provincia.value,
            ciudad: e.target.children.ciudad.value,
            localidad: e.target.children.localidad.value

        })

    });

    if (!res.ok) {

        mensajeError.innerHTML = (await res.json()).message;

        return mensajeError.classList.toggle("escondido", false);

    }

    const resJson = await res.json();

    if (resJson.redirect) {

        window.location.href = resJson.redirect;

    }

});
