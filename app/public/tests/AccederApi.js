const API_LOGIN = "https://golahora-proyecto-is.onrender.com/api/login";


document.getElementById("login").addEventListener("submit", async (evento) => {
    evento.preventDefault(); // Frenamos la recarga automática

    // Capturamos los datos en el momento exacto del clic
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        const Respuesta = await fetch(API_LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                email: email,
                password: password
            })   
        });

        // Si la API responde con un error (ej: status 400 o 401)
        if (!Respuesta.ok) {
            throw new Error("El correo o la contraseña son incorrectos.");
        }
        const datos = await Respuesta.json();
    
        alert("¡Ingreso exitoso!");
        
        // Nota: Asegúrate de que "rol" o "role" coincida exactamente con lo que devuelve tu API
        const nivelUsuario = datos.user_info?.users_level || datos.user?.users_level;

        if (nivelUsuario === "Administrador" ) {
            
            window.location.href = "InterfazAdministrador.html";

        } else if (nivelUsuario === "Cliente") {
            
            window.location.href = "InterfazCliente.html";}
        
        

    } catch (error) {
        // Si hay error de contraseña o de red, salta acá
        alert(error.message);
        console.error("Error detectado:", error);
    }
});