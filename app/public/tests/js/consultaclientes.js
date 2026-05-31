const API = "https://golahora-proyecto-is.onrender.com/api";

// ==========================================
// 1. LOGIN COMO ADMINISTRADOR Y OBTENER TOKEN
// ==========================================
async function obtenerToken() {
    const res = await fetch("/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            "plataform": "web" 
        },
        body: JSON.stringify({
            email: "administrador@golahora.com",
            password: "Unaj2026@golahora"
        })
    });

    const data = await res.json();
    console.log("Respuesta del login:", data);
    return data.token;
}

// ==========================================
// 2. CONSULTAR LOS CLIENTES CON EL TOKEN
// ==========================================

async function obtenerClientes(token) {
    const res = await fetch(API + "/users", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token // enviamos el token
        }
    });

    const clientes = await res.json();
    console.log("Clientes:", clientes);
    return clientes;
}

// ==========================================
// 3. MOSTRAR LOS CLIENTES EN LA PÁGINA
// ==========================================
async function cargarClientes() {
    try {
        // Primero hacemos login para obtener el token
        const token = await obtenerToken();

        // Con el token consultamos los clientes
        const clientes = await obtenerClientes(token);

        // Buscamos el contenedor en el HTML
        const contenedor = document.getElementById("lista-clientes");

        // Por cada cliente creamos una fila
        clientes.forEach(cliente => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.email}</td>
                <td>${cliente.dni}</td>
                <td>${cliente.telefono}</td>
            `;
            contenedor.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar clientes:", error);
    }
}

// Ejecuta cuando carga la página
document.addEventListener("DOMContentLoaded", cargarClientes);