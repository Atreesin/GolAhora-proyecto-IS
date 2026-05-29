const API = "https://golahora-proyecto-is.onrender.com/api"; //Esta CONSTANTE es para no llamar a la URL completa cada vez.

// Busca el input y el div de sugerencias en el HTML
const inputGenero = document.getElementById("genero");
const sugerenciasGenero = document.getElementById("genero-suggestions");

// Variable donde guardamos los géneros cuando carga la página
let listaGeneros = [];

// 1. Cuando carga la página trae todos los géneros de la API
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch(API + "/generos");
        listaGeneros = await res.json();
    } catch (error) {
        console.error("Error al cargar géneros:", error);
    }
});

// 2. Cuando el usuario escribe en el input filtra las sugerencias
inputGenero.addEventListener("input", () => {

    // Lo que escribió el usuario en minúsculas
    const texto = inputGenero.value.toLowerCase();

    // Limpia las sugerencias anteriores
    sugerenciasGenero.innerHTML = "";

    // Si no escribió nada no muestra nada
    if (texto === "") return;

    // Filtra los géneros que contienen lo que escribió
    const filtrados = listaGeneros.filter(genero =>
        genero.toLowerCase().includes(texto)
    );

    // Por cada género filtrado crea un elemento en el div de sugerencias
    filtrados.forEach(genero => {
        const item = document.createElement("div");
        item.textContent = genero;
        item.classList.add("sugerencia-item");

        // Cuando el usuario hace clic en una sugerencia la pone en el input
        item.addEventListener("click", () => {
            inputGenero.value = genero;
            sugerenciasGenero.innerHTML = ""; // oculta las sugerencias
        });

        sugerenciasGenero.appendChild(item);
    });
});