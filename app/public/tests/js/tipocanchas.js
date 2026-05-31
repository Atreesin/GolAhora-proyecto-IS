const mensajeError = document.getElementsByClassName("error")[0];

// ==========================================
// SUPERFICIE CON AUTOCOMPLETADO
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
  const superficieInput = document.getElementById("id_superficie");
  const suggestionsBox = document.getElementById("id_superficie-suggestions");

  let superficies = [];

  try {
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

    // Lista simple de strings
    const matches = superficies.filter(s => s.toLowerCase().includes(query));

    if (matches.length > 0) {
      matches.forEach(s => {
        const div = document.createElement("div");
        div.textContent = s;
        div.addEventListener("click", () => {
          superficieInput.value = s;
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
