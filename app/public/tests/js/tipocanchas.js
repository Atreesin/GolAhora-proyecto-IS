const mensajeError = document.getElementsByClassName("error")[0];

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
  // LÓGICA DEL AUTOCOMPLETADO
  // ==========================================
  superficieInput.addEventListener("input", () => {
    const query = superficieInput.value.toLowerCase();
    suggestionsBox.innerHTML = "";
    superficieHidden.value = ""; // Si borra el texto, limpiamos el ID oculto

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
        
        div.addEventListener("click", () => {
          superficieInput.value = s.tipo_superficie; // Muestra el texto al usuario
          superficieHidden.value = s.id;            // Guarda el ID numérico para la API
          suggestionsBox.style.display = "none";
        });
        suggestionsBox.appendChild(div);
      });
      suggestionsBox.style.display = "block";
    } else {
      suggestionsBox.style.display = "none";
    }
  });

  // Cerrar sugerencias al hacer clic afuera
  document.addEventListener("click", (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== superficieInput) {
      suggestionsBox.style.display = "none";
    }
  });


  // ==========================================
  // NUEVO: PROCESAR Y ENVIAR EL FORMULARIO
  // ==========================================
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Verificación de seguridad por si no seleccionó una opción válida del autocompletado
    if (!superficieHidden.value) {
      mensajeError.textContent = "Por favor, seleccione una superficie válida de la lista de sugerencias.";
      mensajeError.classList.remove("escondido");
      return;
    }

    // Mapeamos automáticamente todos los inputs del formulario usando FormData (controla textos, números y archivos)
    const formData = new FormData(formulario);

    try {
      mensajeError.classList.add("escondido"); // Limpiamos errores previos

      const response = await fetch("/tipos_cancha/agregar", {
        method: "POST",
        headers: {
          // El header requerido por tu Swagger
          "platform": "web"
          // NOTA: No agregues "Content-Type" manualmente; el navegador lo configura solo al usar FormData junto con el límite del archivo.
        },
        body: formData
      });

      if (response.ok) {
        const resultado = await response.json();
        alert("¡Tipo de cancha registrado con éxito!");
        formulario.reset(); // Limpia los campos del formulario
      } else {
        const errorData = await response.json().catch(() => ({}));
        mensajeError.textContent = errorData.message || `Error en el servidor: ${response.status}`;
        mensajeError.classList.remove("escondido");
      }

    } catch (error) {
      console.error("Error en la conexión:", error);
      mensajeError.textContent = "Hubo un problema de red al intentar conectar con el servidor.";
      mensajeError.classList.remove("escondido");
    }
  });
});
