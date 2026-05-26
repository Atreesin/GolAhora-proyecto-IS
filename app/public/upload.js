/*document.getElementById('formUpload').addEventListener('submit', async (e) => {
  e.preventDefault();

  const archivo = document.getElementById('imagen').files[0];
  const formData = new FormData();
  formData.append('imagen', archivo);

  try {
    const response = await fetch('/api/tipos_cancha/agregar', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    console.log('Respuesta del servidor:', data);
  } catch (error) {
    console.error('Error al subir archivo:', error);
  }
});*/
const mensajeError = document.getElementsByClassName("error")[0];

document.addEventListener("DOMContentLoaded", async () => {
  const selectSuperficie = document.getElementById("id_superficie");

  try {
    const res = await fetch("http://localhost/api/superficies");
    if (!res.ok) throw new Error("Error al obtener superficies");

    const superficies = await res.json();
    console.log(superficies)
    superficies.forEach(s => {
      const option = document.createElement("option");
      option.value = s.id_superficie;              // el valor será el ID
      option.textContent = s.tipo_superficie;      // lo que se muestra al usuario
      selectSuperficie.appendChild(option);
    });
  } catch (err) {
    console.error("No se pudieron cargar las superficies:", err);
  }
});

document.getElementById("formUpload").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("tipo_cancha", e.target.tipo_cancha.value);
  formData.append("duracion_min", e.target.duracion_min.value);
  formData.append("duracion_max", e.target.duracion_max.value);
  formData.append("ancho", e.target.ancho.value);
  formData.append("largo", e.target.largo.value);
  formData.append("capacidad", e.target.capacidad.value);
  formData.append("id_superficie", e.target.id_superficie.value);
  formData.append("imagen", document.getElementById("imagen").files[0]);

  const res = await fetch("/api/tipos_cancha/agregar", {
    method: "POST",
    headers: {
      "plataform": "web"
    },
    body: formData
  });


  if (!res.ok) {
    mensajeError.innerHTML = (await res.json()).message;
    return mensajeError.classList.toggle("escondido", false);
  }

  const resJson = await res.json();

  if (resJson.redirect) {
    window.location.href = resJson.redirect;
  }
})