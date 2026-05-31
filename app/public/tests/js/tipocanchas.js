//cargando superficies

document.addEventListener("DOMContentLoaded", cargarSuperficies);

async function cargarSuperficies() {

    const select =
        document.getElementById("id_superficie");

    try {

        const res = await fetch(
            "https://golahora-proyecto-is.onrender.com/superficies"
        );

        const superficies = await res.json();

        select.innerHTML =
            '<option value="">Seleccione una superficie</option>';

        superficies.forEach(superficie => {

            const option =
                document.createElement("option");

            option.value = superficie.id;

            option.textContent =
                superficie.tipo_superficie;

            select.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        select.innerHTML =
            '<option value="">Error al cargar superficies</option>';
    }
}


//cargando superficies

const API_URL =
    "https://golahora-proyecto-is.onrender.com/tipos_cancha/agregar";

document
    .getElementById("formTipoCancha")
    .addEventListener("submit", registrarTipoCancha);

async function registrarTipoCancha(e) {

    e.preventDefault();

    const formData = new FormData();

    formData.append(
        "tipo_cancha",
        document.getElementById("tipo_cancha").value
    );

    formData.append(
        "duracion_min",
        document.getElementById("duracion_min").value
    );

    formData.append(
        "duracion_max",
        document.getElementById("duracion_max").value
    );

    formData.append(
        "ancho",
        document.getElementById("ancho").value
    );

    formData.append(
        "largo",
        document.getElementById("largo").value
    );

    formData.append(
        "capacidad",
        document.getElementById("capacidad").value
    );

    formData.append(
        "id_superficie",
        document.getElementById("id_superficie").value
    );

    const imagen =
        document.getElementById("imagen").files[0];

    if (imagen) {
        formData.append("imagen", imagen);
    }

    try {

        const token =
            localStorage.getItem("token");

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                platform: "web",
                "X-Auth-Token": token
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {

            document.getElementById("mensaje").innerHTML =
                `<div class="alert alert-success">
                    Tipo de cancha registrado correctamente
                </div>`;

            console.log(data);

        } else {

            document.getElementById("mensaje").innerHTML =
                `<div class="alert alert-danger">
                    ${data.message || "Error al registrar"}
                </div>`;

            console.error(data);
        }

    } catch (error) {

        console.error(error);

        document.getElementById("mensaje").innerHTML =
            `<div class="alert alert-danger">
                Error de conexión con la API
            </div>`;
    }
}