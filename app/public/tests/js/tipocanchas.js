const mensajeError = document.getElementsByClassName("error")[0];

// ==========================================
// SUPERFICIE CON AUTOCOMPLETADO
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  const superficieInput = document.getElementById("id_superficie");
  const suggestionsBox = document.getElementById("id_superficie-suggestions");

  let superficies = [];

  try {
    // 1. Asegúrate de usar la URL completa si estás en un entorno local diferente
    const response = await fetch("/api/superficies");
    superficies = await response.json();
  } catch (error) {
    console.error("Error al cargar superficies:", error);
  }

  superficieInput.addEventListener("input", () => {
    const query = superficieInput.value.toLowerCase();
    suggestionsBox.innerHTML = "";

    if (query.length === 0) {
      suggestionsBox.style.display = "none";
      return;
    }

    // 2. CORRECCIÓN: Filtrar buscando en la propiedad 'tipo_superficie'
    const matches = superficies.filter(s => 
      s.tipo_superficie.toLowerCase().includes(query)
    );

    if (matches.length > 0) {
      matches.forEach(s => {
        const div = document.createElement("div");
        
        // 3. CORRECCIÓN: Mostrar el texto de 'tipo_superficie' en la sugerencia
        div.textContent = s.tipo_superficie; 
        
        div.addEventListener("click", () => {
          // 4. CORRECCIÓN: Asignar el texto correcto al input al hacer clic
          superficieInput.value = s.tipo_superficie;
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
});
